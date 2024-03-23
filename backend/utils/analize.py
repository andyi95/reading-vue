import io

import re

import pymorphy2 as py
from nltk import pos_tag
from nltk.corpus import stopwords
from nltk.stem.porter import PorterStemmer
from collections import Counter
from aioredis import from_url
import json

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


def split_text(text: str, max_length: int = 5000):
    chunks = []
    while text:
        if len(text) <= max_length:
            chunks.append(text)
            break
        split_at = max(text.rfind('.', 0, max_length),
                       text.rfind(',', 0, max_length),
                       text.rfind(' ', 0, max_length))
        if split_at == -1:
            split_at = max_length
        chunks.append(text[:split_at + 1])
        text = text[split_at + 1:]
    return chunks
