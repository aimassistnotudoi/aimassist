import json

with open("cards.json", "r", encoding="utf-8") as f:
    load = json.load(f)

cards = load["cards"]

data = {}
data["version"] = "1.0"
data["cards"] = cards
with open("cards.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)