import requests
from bs4 import BeautifulSoup
import time
import json
import random

ALLCARD_URL = "https://shadowverse-evolve.com/cardlist/cardsearch_ex?view=image&page={}"
BASE_URL = "https://shadowverse-evolve.com"
headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                  "AppleWebKit/537.36 (KHTML, like Gecko) "
                  "Chrome/117.0.0.0 Safari/537.36"
}


cards = []
card_urls = []
page_index = 0
while True:
    response = requests.get(ALLCARD_URL.format(page_index), headers=headers)
    if response.status_code != 200:
        print(f"ページ {page_index} の取得に失敗しました。終了します。")
        break
    soup = BeautifulSoup(response.text, "html.parser")
    items = soup.select("li.ex-item")
    if len(items) == 0:
        print("カードの取得が完了しました。")
        break
    
    for li in items:
        a = li.select_one("a")
        href = a["href"]
        url = BASE_URL + href
        card_urls.append(url)
    
    page_index += 1
    if(page_index%100==0):
        print(f"ページ {page_index} までのカードURLを取得しました。")
    
    time.sleep(random.uniform(0.1, 0.3))  # サーバーへの負荷を避けるための待機

print(f"合計 {len(card_urls)} 枚のカードURLを取得しました。")


for url in card_urls:
    try:
        response = requests.get(url, headers=headers, timeout=10)
    except requests.exceptions.Timeout:
        print("timeout:", url)
        continue
    if response.status_code != 200:
        print("failed to get card page:", url)
        continue
    soup = BeautifulSoup(response.text, "html.parser")
    box = soup.select_one(".cardlist-Detail_Box")
    if not box:
        print("failed to get card box:", url)
        continue

    card = {}

    # カード名
    card["name"] = box.select_one("h1.ttl").text.strip()

    # 画像URL
    img_tag = box.select_one("img")
    if img_tag:
        card["img"] = BASE_URL + img_tag["src"]

    # 基本情報
    for dl in box.select("dl"):
        if dl.select_one("dt").text.strip() == "クラス":
            dt = "clan"
        elif dl.select_one("dt").text.strip() == "カード種類":
            dt = "type"
        elif dl.select_one("dt").text.strip() == "タイプ":
            dt = "tribe"
        elif dl.select_one("dt").text.strip() == "レアリティ":
            dt = "rarity"
        elif dl.select_one("dt").text.strip() == "収録商品":
            dt = "product"
        dd = dl.select_one("dd").text.strip()
        card[dt] = dd

    # ステータス
    for s in box.select(".status-Item"):
        if s.select_one(".heading").text.strip() == "コスト":
            heading = "cost"
        elif s.select_one(".heading").text.strip() == "攻撃力":
            heading = "atk"
        elif s.select_one(".heading").text.strip() == "体力":
            heading = "life"
        value = s.text.replace(heading, "").strip()
        card[heading] = value

    # 能力テキスト
    detail = box.select_one(".detail p")
    card["ability"] = detail.decode_contents().replace('src="/wordpress/',
            f'src="{BASE_URL}/wordpress/').strip() if detail else ""

    # イラスト・カード番号
    illust = box.select_one(".illustrator")
    if illust:
        spans = illust.select("span")
        if len(spans) >= 2:
            card["illustrator"] = spans[0].text.strip()
            card["card_id"] = spans[1].text.strip()
        elif len(spans) == 1:
            card["card_id"] = spans[0].text.strip()
            card["illustrator"] = ""


    # 関連カード

    rel_cards = []
    for rel in soup.select(".cardlist-Detail_Relation img"):
        rel_cards.append({
            "name": rel.get("alt"),
            "image": BASE_URL + rel.get("src")
        })
    card["related"] = rel_cards

    cards.append(card)

    # サーバーへの負荷を避けるための待機（重要！）
    time.sleep(random.uniform(0.1, 0.3))

# JSON保存
with open("cards.json", "w", encoding="utf-8") as f:
    json.dump(cards, f, ensure_ascii=False, indent=2)

print(f"{len(cards)} 枚のカード情報を保存しました！")


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