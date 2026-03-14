import requests
from bs4 import BeautifulSoup
import time
import json
from tqdm import tqdm

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
    
    time.sleep(1.0)  # サーバーへの負荷を避けるための待機



for url in tqdm(card_urls, desc="カード情報を収集中"):
    try:
        response = requests.get(url, headers=headers, timeout=10)
    except requests.exceptions.Timeout:
        print("timeout:", url)
        continue
    if response.status_code != 200:
        continue
    soup = BeautifulSoup(response.text, "html.parser")
    box = soup.select_one(".cardlist-Detail_Box")
    if not box:
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
    time.sleep(1.0)

# JSON保存
with open("cards.json", "w", encoding="utf-8") as f:
    json.dump(cards, f, ensure_ascii=False, indent=2)

print(f"{len(cards)} 枚のカード情報を保存しました！")