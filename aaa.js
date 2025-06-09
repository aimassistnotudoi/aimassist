const smallHiragana = ["ぁ", "ぃ", "ぅ", "ぇ", "ぉ", "っ", "ゃ", "ゅ", "ょ", "ゎ"]
const smallHiraganaUnicode = []
for (let char of smallHiragana) smallHiraganaUnicode.push(char.charCodeAt(0))

const smallKatakana = ["ァ", "ィ", "ゥ", "ェ", "ォ", "ッ", "ャ", "ュ", "ョ", "ヮ", "ヵ", "ヶ"]
const smallKatakanaUnicode = []
for (let char of smallKatakana) smallKatakanaUnicode.push(char.charCodeAt(0))

const kansuuji = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"]
const kansuujiUnicode = []
for (let char of kansuuji) kansuujiUnicode.push(char.charCodeAt(0))

function kaxnAA(string) {
    let resultString = ""
    for (let char of string) {
        codePoint = char.codePointAt(0)
        let resultChar = char

        if ((codePoint >= 0x4E00 && codePoint <= 0x9FFF) ||
            (codePoint >= 0x3400 && codePoint <= 0x4DBF) ||
            (codePoint >= 0x20000 && codePoint <= 0x2FA1F) ||
            (codePoint >= 0xF900 && codePoint <= 0xFAFF)) { //漢字のUnicodeたち
                resultChar = kansuujiUnicode.includes(codePoint) ? "壱" : "漢"
            }
        else if (0x3040 <= codePoint && codePoint <= 0x309F && !smallHiraganaUnicode.includes(codePoint)) {
            resultChar = "あ"
        }
        else if (0x30A0 <= codePoint && codePoint <= 0x30FA && !smallKatakanaUnicode.includes(codePoint)) {
            resultChar = "ア"
        }
        else if (smallHiraganaUnicode.includes(codePoint)) {
            resultChar = "ぁ"
        }
        else if (smallKatakanaUnicode.includes(codePoint)) {
            resultChar = "ァ"
        }
        else if (/\d/.test(char)) {
            resultChar = "1"
        }
        else if (/[A-Z]/.test(char)) {
            resultChar = "A"
        }
        else if (/[a-z]/.test(char)) {
            resultChar = "a"
        }
        else if (char == "+" || char == "-") {
            resultChar = "±"
        }
        resultString += resultChar
    }
    return resultString
}