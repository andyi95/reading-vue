import io
import re

import pymorphy2 as py

morph = py.MorphAnalyzer()
from nltk.corpus import stopwords
from nltk import pos_tag
from nltk.stem.porter import PorterStemmer
stemmer = PorterStemmer()


colors = {
    'NOUN': '#0000ff',  # blue
    'VERB': '#009933',  # green
    'INFN': '#009933',
    'PRTF': '#ff9900', # orange
    'PRTS': '#cc6600',
    'GRND': '#751aff',
    'NUMR': '#013a20',
    'ADVB': '#478C5C',
    'NPRO': '#BACC81',
    'PRED': '#cc33ff',
    'PREP': '#ECF87F',
    'CONJ': '#999966',
    'ADJF': '#f4a261',
}

colors['PRON'] = colors['NPRO']
colors.update({
    'PRON': colors['NPRO'], 'PROPN': colors['NPRO'],
    'ADV': colors['ADVB'], 'NUM': colors['NUMR'],
    'ADJS': colors['ADJF'], 'ADJ': colors['ADJF']
})

def analize_text(text: str, colorset: dict=None):
    def parseLine(s, i):
        words = s.split()
        new_line = []
        for word in words:
            stripped = re.sub(r'[^\w\s]', '', word).lower()
            word = {'word': word, 'id': i}
            if re.search(r'[а-яА-Я]', stripped):
                parsed = morph.parse(stripped)[0]
                word.update({
                    'color': colors.get(parsed.tag.POS, ''),
                    'tag': parsed.tag.POS
                })
            else:
                parsed = pos_tag([stripped.lower()], tagset='universal')
                word.update({
                    'color': colors.get(parsed[0][1]),
                    'tag': parsed[0][1]
                })
            new_line.append(word)
            i += 1
        return new_line, i
    buf = io.StringIO(text)
    s = buf.readline()
    res = []
    i = 0
    while s:
        s = s.strip()
        if s != '':
            t, i = parseLine(s, i)
            res.extend(t)
        s = buf.readline()
    return res

def count_words(text: str):
    counter = {}
    def parseLine(s):
        words = s.split()
        new_line = ''
        for word in words:
            stripped = re.sub(r'[^\w\s]', '', word)
            if re.search(r'[а-яА-Я]', stripped) and stripped.lower() not in stopwords.words('russian'):
                parsed = morph.parse(stripped.lower())[0]
                counter[parsed.normal_form] = counter.get(parsed.normal_form, 0) + 1
            elif stripped.lower() not in stopwords.words('english'):
                normal_form = stemmer.stem(stripped.lower())
                counter[normal_form] = counter.get(normal_form, 0) + 1
        return new_line
    buf = io.StringIO(text)
    s = buf.readline()
    res = ''
    while s:
        s = s.strip()
        if s != '':
            res += parseLine(s)
        s = buf.readline()
    v = sorted(counter.items(), key=lambda x:x[1], reverse=True)
    return dict(v)
