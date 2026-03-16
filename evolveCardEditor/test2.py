import json

with open("cards.json", "r", encoding="utf-8") as f:
    cards = json.load(f)

rarities = []
for card in cards:
    rarity = card["rarity"]
    if rarity not in rarities:
        rarities.append(rarity)

# for card in cards:
#     if card["rarity"] == "-":
#         print(card["name"], card["product"], card["rarity"])

for card in cards:
    if card["name"] == "シズル":
        print(card["name"], card["product"], card["rarity"])
    
print(json.dumps(rarities, ensure_ascii=False, indent=2))