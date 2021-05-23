import { h, text, app } from "hyperapp"
import {
    jsonFetcher,
    GotHashesData,
    GotCardsData,
    geneEncodedStr,
    getResURL,
    getCurrLangNo,
    ServerChange,
    navBar
} from "./utils.js"
import { translates } from "./languages.js"
import Module from "../libs/card_recognize.js"

// Effects & Actions

const GotImage = (state, result) => ({
    ...state,
    screenshot: result
})

const GotCharacterData = (state, data) => ({
    ...state,
    rawCharacters: data
})

const GotMod = (state, data) => ({
    ...state,
    mod: data
})

// Initlize wasm module
// initModule -> GotMod
const initModule = (dispatch, payload) => {
    Module().then(mod => dispatch(payload.action, mod))
}

const setPage = (state, payload) => {
    // If user want prev page but current page is the first page
    if (payload.number < 0 && state.page == 0) {
        return state;
    }
    // Using pageBegin and pageEnd to get the data we want to show
    const pageBegin = (state.page + 1) * state.itemPerPage;
    const pageEnd = (state.page + 2) * state.itemPerPage;
    // If user want next page and nextPage's content length is 0
    if (payload.number > 0
        && state.tableData
            .slice(pageBegin, pageEnd).length == 0) {
        return state;
    }
    return {
        ...state,
        page: state.page + payload.number
    }
}

const prevPage = () => [setPage, { number: -1 }]
const nextPage = () => [setPage, { number: +1 }]
const ImageShowStatus = (state) => ({ ...state, showImage: !state.showImage })

const SelectAll = (state) => {
    // If selectedCard is full, remove all selected card
    state.selectedCard.size == state.tableData.length
        ? state.selectedCard.clear()
        : state.tableData.forEach(v => state.selectedCard.add(v))
    // Weird behavior, it need declaim selectedCard again to update data
    return { ...state, selectedCard: state.selectedCard };
}

const DrawCanvas = state => {
    let img = document.getElementById("show-img");
    let dataCanvas = document.getElementById("data-canvas");
    let showCanvas = document.getElementById("show-canvas");

    // Put image into dataCanvas
    dataCanvas.width = img.width;
    dataCanvas.height = img.height;
    let dataCanvasContext = dataCanvas.getContext("2d");
    dataCanvasContext.drawImage(img, 0, 0);

    // Draw image to showCanvas
    const width = showCanvas.clientWidth;
    const ratio = width / img.width;
    const height = img.height * ratio;
    showCanvas.width = width;
    showCanvas.height = height;
    let showCanvasContext = showCanvas.getContext("2d");
    showCanvasContext.drawImage(img, 0, 0, img.width, img.height, 0, 0, width, height);

    return state;
}

const loadImage = (dispatch, options) => {
    let reader = new FileReader();
    reader.onload = e => dispatch(options.action, e.target.result);
    reader.readAsDataURL(options.file);
}

// ChangeScreenshot -> loadImage -> GotImage
const ChangeScreenshot = (state, event) => [
    state,
    [loadImage, { action: GotImage, file: event.target.files[0] }]
]

// Select card in canvas
const SelectCard = (state, event) => {
    // Has not load image
    if (state.screenshot.length === 0) {
        return state;
    }
    let image = document.getElementById('show-img');
    let canvas = document.getElementById("show-canvas");

    // Calculate the click position in image
    let canvasInfo = canvas.getBoundingClientRect();
    const x = Math.round(image.width * (event.clientX - canvasInfo.left) / canvasInfo.width);
    const y = Math.round(image.height * (event.clientY - canvasInfo.top) / canvasInfo.height);
    console.log(`click x: ${x}, y: ${y}`);

    // Get canvas data
    let dataCanvas = document.getElementById("data-canvas");
    let context = dataCanvas.getContext('2d');
    let imageData = context.getImageData(0, 0, image.width, image.height);
    let uintArray = imageData.data;

    // Put data into heap
    let uint8tPtr = state.mod._malloc(uintArray.length);
    state.mod.HEAPU8.set(uintArray, uint8tPtr);
    let v = state.mod.process(uint8tPtr, image.width, image.height, JSON.stringify(state.rawHashes), x, y);
    state.mod._free(uint8tPtr);

    // Generate table data
    let result = [];
    for (let i = 0; i < v.size(); i++) {
        result.push(v.get(i));
    }
    return {
        ...state,
        tableData: result
    };
}

// Select card in table
const SelectCardCheckBox = (state, payload) => ({
    ...state,
    selectedCard: state.selectedCard.has(payload.id)
        ? state.selectedCard.delete(payload.id) && state.selectedCard
        : state.selectedCard.add(payload.id)
})

// Use selected card to generate result
const GenerateResult = state => {
    let cards = [];
    for (const v of state.selectedCard) {
        let card = state.rawCards[v];
        let level = card.levelLimit + (card.stat.training ? 10 : 0);
        cards.push({
            id: v,
            level: level,
            exclude: false,
            art: 1,
            train: 1,
            ep: 2,
            skill: 0,
        })
    }
    return {
        ...state,
        result: geneEncodedStr(cards)
    }
}

// Views

const screenshotSelect = state => h("div", { class: "row p-1" }, [
    h("div", { class: "col" }, [
        h("label", { for: "screenshot-select", class: "form-label" }, text(state.language.selectScreenshot)),
        h("input", { type: "file", name: "screenshot-select", class: "form-control", onchange: ChangeScreenshot })
    ])
])

const serverSelect = state => h("div", { class: "row p-1" }, [
    h("div", { class: "col" }, [
        h("label", { for: "server" }, text(state.language.selectServer)),
        h("select", { name: "server", id: "server", class: "form-select", onchange: ServerChange }, [
            h("option", { value: "0" }, text("日本")),
            h("option", { value: "1" }, text("International")),
            h("option", { value: "2" }, text("繁体中文")),
            h("option", { value: "3" }, text("简体中文")),
        ])
    ])
])

const tr = (state, item) => {
    const card = state.rawCards[item];
    return h("tr", {}, [
        // ...Object.values(item).map((v) => h("td", {}, text(v))),
        state.showImage
            ? h("img", { src: getResURL(card, item), width: "64" })
            : h("td", {}, text("...")),
        h("td", {}, text(item)),
        h("td", {}, text(card.prefix[state.server])),
        h("td", {}, text(state
            .rawCharacters[card.characterId]
            .characterName[state.server]
        )),
        h("td", {}, [
            h("input", {
                type: "checkbox",
                checked: state.selectedCard.has(item) ? "checked" : "",
                class: "form-check-input",
                onchange: [SelectCardCheckBox, { id: item }]
            })
        ])
    ])
}

const tableBody = state => h("tbody", {},
    state.tableData.length == 0
        ? [h("th", { colspan: "4" }, text(state.language.waitRecognize))]
        : state.tableData
            .slice(state.page * state.itemPerPage, (state.page + 1) * state.itemPerPage)
            .map((v) => tr(state, v))
)

const tableCompoent = state => h("div", {}, [
    h("table", { class: "table align-middle" }, [
        h("thead", {}, [
            h("tr", {},
                state.head
                    .map(v => h("th", {}, text(state.language[v])))
            )
        ]),
        tableBody(state)
    ]),
    h("div", { class: "input-group justify-content-md-center" }, [
        h("button",
            { class: "btn btn-outline-primary", onclick: [ImageShowStatus] },
            text(state.showImage ? state.language.hideImage : state.language.showImage)
        ),
        h("button", { class: "btn btn-outline-primary", onclick: [prevPage] }, text(state.language.prevPage)),
        h("button", { class: "btn btn-outline-primary", onclick: [nextPage] }, text(state.language.nextPage)),
        h("button", { class: "btn btn-outline-primary", onclick: [SelectAll] }, text(state.language.selectAll)),
        h("button", { class: "btn btn-primary", onclick: [GenerateResult] }, text(state.language.generate))
    ])
])

const screenshotShow = state => h("div", { class: "row p-1 align-items-start" }, [
    h("p", {}, text(state.language.hintText1)),
    h("img", { id: "show-img", src: state.screenshot, hidden: true, onload: [DrawCanvas] }),
    h("canvas", { id: "data-canvas", hidden: true }),
    h("canvas", { id: "show-canvas", class: "col-md-8 p-1", onclick: SelectCard }),
    h("div", { class: "col-md-4 p-1" }, [tableCompoent(state)]),
    h("p", {}, text(state.language.hintText2)),
    h("p", {}, text(state.language.hintText3))
])

const resultView = state => h("div", { class: "row p-1" }, [
    state.result.length != 0 && h("div", { class: "col" }, [
        h("textarea", {
            class: "form-control",
            value: `{"name":"generated-${Date.now()}","server":${state.server},"compression":"1","data":"${state.result}",
"items":{"Menu":[5,5,5,5],"Plaza":[5,5,5,5],"Roselia":[5,5,5,5,5,5,5],"Everyone":[5,5,5,5,5,5,5],"Magazine":[5,5,5],
"Afterglow":[5,5,5,5,5,5,5],"PoppinParty":[5,5,5,5,5,5,5],"PastelPalettes":[5,5,5,5,5,5,5],"HelloHappyWorld":[5,5,5,5,5,5,5]}}`
        })
    ])
])

app({
    init: [
        {
            screenshot: "", // Raw screenshot(Base64 string)
            language: translates[getCurrLangNo()], // Language dict
            server: 0,
            tableData: [], // Table stuff
            head: ["cardImage", "id", "cardName", "character", "selected"],
            page: 0,
            itemPerPage: 10,
            showImage: false, // Show image in table or not
            selectedCard: new Set(), // selected card for further use of generate result
            result: "", // Final result, Bestdori user profile
            rawCharacters: null, // Bestdori's raw data
            rawHashes: null,
            rawCards: null,
            mod: null
        },
        jsonFetcher("data/characters.json", GotCharacterData),
        jsonFetcher("data/hashes.json", GotHashesData),
        jsonFetcher("data/cards.json", GotCardsData),
        [initModule, { action: GotMod }]
    ],
    view: state => h("div", {}, [
        navBar(state),
        h("div", { class: "container" }, [
            serverSelect(state),
            screenshotSelect(state),
            screenshotShow(state),
            resultView(state)
        ])
    ]),
    node: document.getElementById("app")
})