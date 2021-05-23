import { h, text } from "hyperapp"
import { translates } from "./languages.js"

const dict = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_';

const fetchJson = (dispatch, options) => {
    fetch(options.url)
        .then(response => response.json())
        .then(data => dispatch(options.action, data))
}

const jsonFetcher = (url, action) => [fetchJson, { url, action }]

const GotBandsData = (state, data) => ({
    ...state,
    rawBands: data
})

const GotCardsData = (state, data) => ({
    ...state,
    rawCards: data
})

const GotHashesData = (state, data) => ({
    ...state,
    rawHashes: data
})

const v = (t, e) => {
    let ret = '';
    for (let i = 0; i < e; i++) {
        let a = t % 64;
        t = Math.floor(t / 64);
        ret = dict[a] + ret;
    }
    return ret;
}

/**
 * Generate Bestdori's profile data
 * @param {Array} cards Bestdori's calculated card data
 * @returns {string} encoded data string
 */
const geneEncodedStr = cards => {
    let data = '';
    for (let i = 0; i < cards.length; i++) {
        let card = cards[i];
        data += card.id >= 10000 ? v(card.id - 10000 + 3072, 2) : v(card.id, 2);
        data += v(card.level, 1);
        data += v(1 * (card.exclude ? 1 : 0) + 2 * card.art + 4 * card.train + 8 * card.ep + 24 * card.skill, 2)
    }
    return data;
}

/**
 * Generate resources url
 * @param {*} card Bestdori's card data
 * @returns {string} url
 */
const getResURL = (card, cardId) => {
    let partNum = Math.floor(parseInt(cardId) / 50);
    let part = partNum.toString().padStart(5, '0');
    return `https://bestdori.com/assets/cn/thumb/chara/card${part}_rip/${card.resourceSetName}_after_training.png`;
}

/**
 * Change the "languageNo" in localStorage and "language" in state
 * @param {*} state 
 * @param {Event} event 
 * @returns state
 */
const ChangeLanguage = (state, event) => {
    localStorage.setItem("languageNo", event.target.name)
    return {
        ...state,
        language: translates[parseInt(event.target.name)]
    };
}

/**
 * Get current languageNo
 * @returns {number}
 */
const getCurrLangNo = () => (parseInt(localStorage.getItem("languageNo")) || 0)

/**
 * Navigation bar
 * @param {*} state 
 * @returns 
 */
const navBar = state => h("nav", { class: "navbar navbar-expand-lg navbar-light bg-light" }, [
    h("div", { class: "container" }, [
        h("a", { class: "navbar-brand", href: "./" }, text("Wasmdori")),
        h("div", { class: "collapse navbar-collapse" }, [
            h("div", { class: "navbar-nav" }, [
                h("a", { class: "nav-link", href: "./card_recognize.html" }, text(state.language.cardRecognize)),
                h("a", { class: "nav-link", href: "./team_builder.html" }, text(state.language.teamBuilder)),
                h("div", { class: "nav-item dropdown" }, [
                    h("a", {
                        href: "#",
                        class: "nav-link dropdown-toggle",
                        role: "button",
                        "data-bs-toggle": "dropdown",
                        "aria-expanded": "false"
                    }, text(state.language.selectLanguage)),
                    h("ul", { class: "dropdown-menu" }, [
                        h("li", {}, [
                            h("button", { class: "dropdown-item", name: "1", onclick: ChangeLanguage }, text("English"))
                        ]),
                        h("li", {}, [
                            h("button", { class: "dropdown-item", name: "3", onclick: ChangeLanguage }, text("简体中文"))
                        ])
                    ])
                ])
            ])
        ])
    ])
])

/**
 * Server change effect
 * @param {*} state 
 * @param {Event} event 
 * @returns 
 */
const ServerChange = (state, event) => ({
    ...state,
    server: parseInt(event.target.value)
})

export {
    jsonFetcher,
    fetchJson,
    GotBandsData,
    GotCardsData,
    GotHashesData,
    geneEncodedStr,
    getResURL,
    getCurrLangNo,
    navBar,
    ServerChange
}