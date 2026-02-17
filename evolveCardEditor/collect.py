import requests
from bs4 import BeautifulSoup
import time
import json
from tqdm import tqdm

BASE_URL = "https://shadowverse-evolve.com"
CARD_URL = BASE_URL + "/cardlist/?cardno={}"
headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                  "AppleWebKit/537.36 (KHTML, like Gecko) "
                  "Chrome/117.0.0.0 Safari/537.36"
}

cards = []
# 例としてEBD04のカード001〜030を取得
for j in tqdm(range(1, 18)):
    for i in tqdm(range(1, 181)):
        
        card_no = f"BP{j:02d}-{i:03d}"
        url = CARD_URL.format(card_no)
        response = requests.get(url, headers=headers)
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
        card["ability"] = detail.decode_contents().replace("<br/>", "\n").replace('src="/wordpress/',
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
        time.sleep(1.5)

# JSON保存
with open("cards.json", "w", encoding="utf-8") as f:
    json.dump(cards, f, ensure_ascii=False, indent=2)

print(f"{len(cards)} 枚のカード情報を保存しました！")