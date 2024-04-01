import io
import json
import re
from collections import Counter

import pymorphy2 as py
from aioredis import from_url
from google.cloud import texttospeech
from langdetect import detect
from nltk import pos_tag
from nltk.corpus import stopwords
from nltk.stem.porter import PorterStemmer

from settings import Settings

stemmer = PorterStemmer()
morph = py.MorphAnalyzer()


async def analize_text(text: str, settings: Settings) -> list:
    redis = from_url(f"redis://{settings.REDIS_URL}", encoding="utf-8", decode_responses=True)
    async def parse_line(line: str, counter: int):
        words = line.split()
        new_line = []
        for word in words:
            stripped = re.sub(r'[^\w\s]', '', word).lower()
            cached = await redis.get(stripped)
            if cached:
                proccessed = json.loads(cached)
                proccessed.update(
                    {'id': counter, 'word': word}
                )
                new_line.append(proccessed)
                counter += 1
                continue
            word = {'word': word, 'id': counter}
            if re.search(r'[а-яА-Я]', stripped):
                parsed = morph.parse(stripped)[0]
                word.update({
                    'tag': parsed.tag.POS,
                    'normal_form': parsed.normal_form
                })
            else:
                parsed = pos_tag([stripped.lower()], tagset='universal')
                word.update({
                    'tag': parsed[0][1],
                    'normal_form': stemmer.stem(stripped.lower())
                })
            await redis.set(stripped, json.dumps(word))
            new_line.append(word)
            counter += 1
        return new_line, counter
    buf = io.StringIO(text)
    s = buf.readline()
    res = []
    i = 0
    while s:
        s = s.strip()
        if s != '':
            t, i = await parse_line(s, i)
            res.extend(t)
        s = buf.readline()
    return res


def count_words(text: str) -> dict:
    result = []

    def parse_line(line):
        words = line.split()
        new_line = ''
        for word in words:
            stripped = re.sub(r'[^\w\s]', '', word)
            if re.search(r'[а-яА-Я]', stripped) and stripped.lower() not in stopwords.words('russian'):
                parsed = morph.parse(stripped.lower())[0]
                result.append(parsed.normal_form)
            elif stripped.lower() not in stopwords.words('english'):
                normal_form = stemmer.stem(stripped.lower())
                result.append(normal_form)
        return new_line
    buf = io.StringIO(text)
    s = buf.readline()
    res = ''
    while s:
        s = s.strip()
        if s != '':
            res += parse_line(s)
        s = buf.readline()
    v = Counter(result)
    return dict(v.most_common())


class TextAnalizer:
    def __init__(self, text: str):
        self.text = text

    def split_text(self, max_byte_length: int = 5000):
        chunks = []
        text = self.text
        while text:
            split_at = max_byte_length
            current_chunk_bytes = text[:split_at].encode('utf-8')

            while len(current_chunk_bytes) > max_byte_length and split_at > 0:
                split_at -= 1
                current_chunk_bytes = text[:split_at].encode('utf-8')

            if split_at == 0:
                split_at = max_byte_length

            best_split = max(text.rfind('.', 0, split_at),
                             text.rfind(',', 0, split_at),
                             text.rfind(' ', 0, split_at))

            if best_split == -1:
                best_split = split_at

            chunks.append(text[:best_split + 1])
            text = text[best_split + 1:]
        return chunks

    def get_voice_params(self) -> texttospeech.VoiceSelectionParams:
        LANG_CODES = {
            'ru': {
                'language_code': 'ru-RU',
                'name': 'ru-RU-Standard-B'
            },
            'uk': {
                'language_code': 'uk-UA',
                'name': 'uk-UA-Standard-A'
            },
            'sk': {
                'language_code': 'sk-SK',
                'name': 'sk-SK-Standard-A'
            },
            'en': {
                'language_code': 'en-US',
                'name': 'en-US-Neural2-I'
            },
            'fr': {
                'language_code': 'fr-FR',
                'name': 'fr-FR-Neural2-C'
            }
        }
        lang = detect(self.text)
        if lang in LANG_CODES:
            return texttospeech.VoiceSelectionParams(
                language_code=LANG_CODES[lang]['language_code'],
                name=LANG_CODES[lang]['name'],
                ssml_gender=texttospeech.SsmlVoiceGender.NEUTRAL
            )
        return texttospeech.VoiceSelectionParams(
            language_code='ru-Ru',
            ssml_gender=texttospeech.SsmlVoiceGender.NEUTRAL,
            name='ru-RU-Standard-B'
        )
