from requests import get

URLS = {
    "hashes.json": "https://bestdori.com/api/hash/all.json",
    "characters.json": "https://bestdori.com/api/characters/main.3.json",
    "cards.json": "https://bestdori.com/api/cards/all.5.json",
    "bands.json": "https://bestdori.com/api/bands/main.1.json",
    "skills.json": "https://bestdori.com/api/skills/all.10.json",
    "125.expert.json": "https://bestdori.com/api/charts/125/expert.json"
}
for filename, url in URLS.items():
    response = get(url)
    with open(f'public/data/{filename}', "w") as f:
        f.write(response.text)
