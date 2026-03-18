import json

with open("cards.json", "r", encoding="utf-8") as f:
    data = json.load(f)

cards = data["cards"]

products = {
  "プレミアムカードセット「プリンセスコネクト！Re:Dive」": 0,
  "コラボパック「プリンセスコネクト！Re:Dive」": 1,
  "EXビギナーデッキ「ビショップ」": 2,
  "EXビギナーデッキ「ナイトメア」": 3,
  "EXビギナーデッキ「ウィッチ」": 4,
  "EXビギナーデッキ「エルフ」": 5,
  "ブースターパック「新約都市・透京」": 6,
  "ブースターパック「Convergent Destinies/コンヴァージェント・ディスティニー」": 7,
  "リーダーカードセット 「Shadowverse: Worlds Beyond」": 8,
  "EXコラボパック「アイドルマスター シンデレラガールズ」": 9,
  "スターターデッキ「燃え尽きぬ炎」": 10,
  "スターターデッキ「新たなる戦場」": 11,
  "ブースターパック「新たなる創世」": 12,
  "ブースターパック「絶傑の試練」": 13,
  "ブースターパック第14弾「夢幻の饗󠄀宴」": 14,
  "EXコラボパック「ウマ娘 プリティーダービー」": 15,
  "ブースターパック第13弾「暗黒降誕」": 16,
  "ブースターパック第12弾「黒鉄の侵略者」": 17,
  "スペシャルパック「シーサイド・メモリーズ」": 18,
  "ブースターパック第11弾「宿命の弾丸」": 19,
  "コラボスターターデッキ「黙示録の炎」": 20,
  "コラボスターターデッキ「聖域の騎士団」": 21,
  "コラボパック「カードファイト!! ヴァンガード」": 22,
  "DXスターターデッキ「学院に咲く双華」「武なる雷鳴」": 23,
  "ブースターパック第10弾「Gods of the Arcana」": 24,
  "ブースターパック第9弾「光影の二重奏」": 25,
  "ブースターパック第8弾「次元混沌」": 26,
  "ブースターパック第7弾「森羅鋼鉄」": 27,
  "コラボスターターデッキ「Passion」": 28,
  "コラボスターターデッキ「Cool」": 29,
  "コラボスターターデッキ「Cute」": 30,
  "コラボパック「アイドルマスター シンデレラガールズ」": 31,
  "ブースターパック第6弾「絶対なる覇者」": 32,
  "ブースターパック第5弾「永劫なる絶傑」": 33,
  "ブースターパック第4弾「天星神話」": 34,
  "エントリーデッキシャドウバースＦ第3弾「蜜田川イツキ」": 35,
  "エントリーデッキシャドウバースＦ第2弾「真壁スバル」": 36,
  "エントリーデッキシャドウバースＦ第1弾「天竜ライト」": 37,
  "ブースターパック第3弾「FLAME OF LAEVATEINN / フレイム・オブ・レーヴァテイン」": 38,
  "コラボスターターデッキ「出走！ウマ娘！」": 39,
  "コラボパック「ウマ娘 プリティーダービー」": 40,
  "ブースターパック第2弾「黒銀のバハムート」": 41,
  "スターターデッキ第6弾「穢れし洗礼」": 42,
  "スターターデッキ第5弾「永久なる定め」": 43,
  "スターターデッキ第4弾「蛇竜の爪牙」": 44,
  "スターターデッキ第3弾「神秘錬成」": 45,
  "スターターデッキ第2弾「怨讐刀鬼」": 46,
  "スターターデッキ第1弾「麗しの妖精姫」": 47,
  "ブースターパック第1弾「創世の夜明け」": 48,
  "PRカード": -1
}

rarities = {
    "PR" : -1,
    "プレミアム" : 0,
    "GR・プレミアム" : 1,
    "SR・プレミアム" : 2,
    "BR・プレミアム" : 3,
    "SSP" : 4,
    "SP" : 5,
    "SL" : 6,
    "UR" : 7,
    "LG" : 8,
    "GR" : 9,
    "SR" : 10,
    "BR" : 11,
    "-" : 12
}



filtered_cards = {}
for card in cards:
    product = card["product"]
    rarity = card["rarity"]
    name = card["name"]
    Type = card["type"]
    key = (name, Type)

    if key not in filtered_cards:
        filtered_cards[key] = card
    else:
        current_product = filtered_cards[key]["product"]
        current_rarity = filtered_cards[key]["rarity"]
        if products[product] > products[current_product]:
            del filtered_cards[key]
            filtered_cards[key] = card
        elif products[product] == products[current_product] and rarities[rarity] > rarities[current_rarity]:
            del filtered_cards[key]
            filtered_cards[key] = card

new_cards = list(filtered_cards.values())

result = {
    "version": "1.0",
    "cards": new_cards
}


with open("unique_cards.json", "w", encoding="utf-8") as f:
    json.dump(result, f, ensure_ascii=False, indent=2)