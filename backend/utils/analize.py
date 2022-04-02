import io
import pymorphy2 as py
import re
morph = py.MorphAnalyzer()


colors = {
    'NOUN': '#0000ff',  # red
    'ADJF': '#009933',  # green
    'ADJS': '#00cc00',
    'VERB': '#000080',  #blue
    'INF': '#0000cc', # light-blue
    'PRTF': '#ff9900', # orange
    'PRTS': '#cc6600',
    'GRND': '#751aff',
    'NUMR': '#013a20',
    'ADVB': '#478C5C',
    'NPRO': '#BACC81',
    'PRED': '#cc33ff',
    'PREP': '#ECF87F',
    'CONJ': '#999966',
}

def analize_text(text: str, colorset: dict=None):
    def parseLine(s):
        words = s.split()
        new_line = []
        for word in words:
            stripped = re.sub(r'[^\w\s]', '', word).lower()
            parsed = morph.parse(stripped)[0]
            color = colors.get(parsed.tag.POS, '')
            word = {'word': word, 'color': color, 'tag': parsed.tag.POS}
            new_line.append(word)
        return new_line

    buf = io.StringIO(text)
    s = buf.readline()
    res = []
    while s:
        s = s.strip()
        if s != '':
            res.extend(parseLine(s))
        s = buf.readline()
    return res

def count_words(text: str):
    counter = {}
    def parseLine(s):
        words = s.split()
        new_line = ''
        for word in words:
            stripped = re.sub(r'[^\w\s]', '', word)
            parsed = morph.parse(stripped)[0]
            counter[parsed.normal_form] = counter.get(parsed.normal_form, 0) + 1
            color = colors.get(parsed.tag.POS)
            # if color:
            #     word = f'<span style="color: {color}">{word}</span>'
            # new_line += word + ' '
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


if __name__ == '__main__':
    count_words('Нормальную (начальную) форму слова можно получить через атрибуты Parse.normal_form и Parse.normalized. Чтоб получить объект Parse, нужно сперва разобрать слово и выбрать правильный вариант разбора из предложенных')