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
 * @param cardId card id
 * @param trained card is trained or not
 * @returns {string} url
 */
const getResURL = (card, cardId, trained=true) => {
    let partNum = Math.floor(parseInt(cardId) / 50);
    let part = partNum.toString().padStart(5, '0');
    let suffix = card.rarity <= 2 || !trained ? "normal" : "after_training"; // Card(rarity < 2) only has normal card image
    return `https://bestdori.com/assets/cn/thumb/chara/card${part}_rip/${card.resourceSetName}_${suffix}.png`;
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
        h("button", {
            class: "navbar-toggler collapsed",
            type: "button",
            "data-bs-toggle": "collapse",
            "data-bs-target": "#navbarNavAltMarkup",
            "aria-controls": "navbarNavAltMarkup",
            "aria-expanded": "false",
            "aria-label": "Toggle navigation"
        }, [
            h("span", { class: "navbar-toggler-icon" })
        ]),
        h("div", { id: "navbarNavAltMarkup", class: "collapse navbar-collapse" }, [
            h("div", { class: "navbar-nav" }, [
                h("a", { class: "nav-link", href: "./card_recognize.html" }, text(state.language.cardRecognize)),
                h("a", { class: "nav-link", href: "./team_builder.html" }, text(state.language.teamBuilder)),
                h("a", { class: "nav-link", href: "./profile.html" }, text(state.language.profile)),
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

/**
 * Load profiles data from localStorage
 * @param {*} dispatch dispatch function
 * @param {*} param1 action
 */
const loadProfile = (dispatch, { action }) => {
    const profileStr = localStorage.getItem("profiles");
    let profiles = [];
    if (profileStr !== null && profileStr.length !== 0) {
        profiles = JSON.parse(profileStr);
    }
    dispatch(action, profiles);
}

/**
 * Got profile and set it to state
 * @param {*} state app's state
 * @param {*} data profiles data
 * @returns new state
 */
const GotProfile = (state, data) => ({
    ...state,
    profiles: data
})

/**
 * Got selected profile and set it to state
 * @param {*} state app's state
 * @param {*} data profiles data
 * @returns new state
 */
const GotSelectedProfile = (state, data) => {
    // Get primaryProfileS
    let primaryProfileS = localStorage.getItem("primaryProfile");
    let primaryProfile = 0;
    if (primaryProfileS !== null) {
        primaryProfile = parseInt(primaryProfileS);
    }
    // Get selectedProfile
    let selectedProfile = data[primaryProfile];
    if (data.length <= primaryProfile) {
        selectedProfile = null;
    }
    return {
        ...state,
        profiles: data,
        selectedProfile: selectedProfile
    }
}

const selectedProfileLoader = () => [loadProfile, { action: GotSelectedProfile }]

const profileLoader = () => [loadProfile, { action: GotProfile }]

/**
 * Remove duplicated card in profile's data
 * @param {string} data origin data 
 * @returns cleaned data
 */
const RemoveDuplicatedCard = (data) => {
    let set = new Set();
    for (let i = 0; i < data.length; i += 5) {
        set.add(data.slice(i, i + 5));
    }
    let cleaned = "";
    for (const card of set) {
        cleaned += card;
    }
    return cleaned;
}

/**
 * Select server option box
 * @param {*} state 
 * @returns 
 */
const serverSelect = (state, handleFunc=ServerChange) => h("div", { class: "row p-1" }, [
    h("div", { class: "col" }, [
        h("label", { for: "server" }, text(state.language.selectServer)),
        h("select", { name: "server", id: "server", class: "form-select", onchange: handleFunc }, [
            h("option", { value: "0" }, text("日本")),
            h("option", { value: "1" }, text("International")),
            h("option", { value: "2" }, text("繁体中文")),
            h("option", { value: "3" }, text("简体中文")),
        ])
    ])
])

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
    ServerChange,
    profileLoader,
    selectedProfileLoader,
    RemoveDuplicatedCard,
    serverSelect
}