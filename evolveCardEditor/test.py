import json

with open("cards.json", "r", encoding="utf-8") as f:
    cards = json.load(f)

tribes = {}
for card in cards:
    tribe = card.get("tribe", "")
    li = tribe.split("・")
    for t in li:
        if t not in tribes:
            tribes[t] = 1
        else:
            tribes[t] += 1

print(tribes.keys())