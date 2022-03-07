import pymorphy2 as py
morph = py.MorphAnalyzer()


class PPattern:
    def __init__(self):
        super().__init__()
        self.tags = []
        self.rules = []
        self.example = ''

    def checkPhrase(self, words, used=set()):
        def getNextWord(wordList):
            if len(wordList) == 0:
                return None
            index = wordList[0]
            wordList[0:1] = []
            return index

        def checkWord(tags, word, prevResult):
            variants = morph.parse(word)
            for v in variants:
                if set(tags) <= v.tag.grammemes \
                        and self.checkRules(prevResult + [(word, v)]):
                    return (word, v)
            return None

        allResults = []
        result = []
        wordList = list(set([x for x in range(0, len(words))]) - used)
        wordList.sort()
        wi = getNextWord(wordList)
        nextTag = 0
        usedP = set()
        while wi is not None:
            w = words[wi]
            res = checkWord(self.tags[nextTag].split(','), w, result)
            if res is not None:
                result.append(res)
                usedP.add(wi)
                nextTag = nextTag + 1
                if nextTag >= len(self.tags):
                    return (result, usedP)
            wi = getNextWord(wordList)
        return None

    def checkRules(self, result):
        for r in self.rules:
            indexes = r[0]
            func = r[1]
            l = r[2]
            if max(indexes) < len(result):  # У нас есть достаточно данных
                args = [result[x][1] for x in indexes]
                if not func(*args):
                    return False
        return True

    def checkPropRule(self, getFunc, getArgs, srcFunc, srcArgs, op=lambda x, y: x == y):
        v1 = getFunc(getArgs)
        v2 = srcFunc(srcArgs)
        return op(v1, v2)

    def setProp(self, setFunc, setArgs, srcFunc, srcArgs):
        setFunc(setArgs, srcFunc(srcArgs))