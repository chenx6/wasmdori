# Bandori band girl party assist tools / Wasmdori

Bandori band girl party assist tools (Powered by webassembly)

## Sub-project

- [bgp-team-builder](https://github.com/chenx6/bgp-team-builder)
- [bgp-card-recognize](https://github.com/chenx6/bgp-card-recognize)

## Dependency

- [Hyperapp(Front-end framework)](https://github.com/jorgebucaran/hyperapp)
- [Bootstrap(CSS)](https://getbootstrap.com/)
- [Bestdori(Datasource)](https://bestdori.com/)
- [Vite(Build tool)](https://cn.vitejs.dev/)
- ...

## Build guide

First, build the sub project and put then into `/libs` folder

```plaintext
libs
├── card_recognize.js
├── card_recognize.wasm
├── wasmdori_bg.wasm
└── wasmdori.js
```

Then, use `fetch.py` to fetch data from Bestdori

```bash
# Please install requests from pypi in your computer first
python3 fetch.py
```

Last, use `vite` to build the Front-end framework

```bash
npm install
npm run build
```
