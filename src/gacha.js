import { app, h, text } from "hyperapp"
import { translates } from "./languages.js"
import {
    navBar,
    getCurrLangNo,
    jsonFetcher,
    GotCardsData,
    getResURL,
    serverSelect,
    getBannerUrl
} from "./utils"

const dataIndex = 0; // JP Server
const nameIndex = 1; // English translation
// permanent gacha and special gacha type will disturb table
const permanentGachas = [
    "★３以上確定チケットガチャ",
    "スタートダッシュガチャ",
    "初心者限定★4ミラクルチケットセットガチャ"
];
const excludeGachaType = ["birthday", "special"];

// Effects

const GotEvents = (state, data) => {
    return { ...state, events: Object.values(data) }
}

const GotGachas = (state, data) => {
    return { ...state, gachas: data }
}

const GotCharactersData = (state, data) => ({
    ...state, characters: data
})

const GotSkillData = (state, data) => ({
    ...state, rawSkills: data
})

// Find the gacha that matches the event time
const PairEventGacha = state => {
    let pairs = [];
    let lastEventTime = 0;
    for (let event of state.events) {
        // If event data in selected server doesn't have start date, we just add a time offset to previous event's date
        let serverEventStart = event.startAt[state.server];
        if (serverEventStart !== null && lastEventTime === 0) {
            lastEventTime = parseInt(serverEventStart);
        } else {
            lastEventTime += 604800 * 1000; // Add a Week
            event.startAt[state.server] = lastEventTime.toString();
        }
        const startAt = parseInt(event.startAt[dataIndex]);
        const endAt = parseInt(event.endAt[dataIndex]);
        let gachas = [];
        for (const gacha of Object.values(state.gachas)) {
            const publishAt = parseInt(gacha.publishedAt[dataIndex]);
            const closedAt = parseInt(gacha.closedAt[dataIndex]);
            // Find the gacha that closed to event's data
            if (publishAt <= endAt && startAt <= closedAt // publishAt <= startAt && endAt <= closedAt
                && !excludeGachaType.includes(gacha.type)
                && !permanentGachas.includes(gacha.gachaName[dataIndex])) {
                gachas.push(gacha);
            }
        }
        gachas.sort((a, b) => a.publishedAt[dataIndex] - b.publishedAt[dataIndex]);
        pairs.push({ event, gachas });
    }
    return { ...state, eventGachaPair: pairs };
}

// Sort event based on state.server time, then dataIndex time
const sortEvent = (server, a, b) => {
    const aStartData = a.startAt[dataIndex];
    const bStartData = b.startAt[dataIndex];
    const aStartServer = a.startAt[server];
    const bStartServer = b.startAt[server];
    // If event a and event b has been held before, compare their start time
    if (aStartServer !== null && bStartServer !== null) {
        return aStartServer - bStartServer;
        // If event a or event b has not been held, push it to the back of the array
    } else if (aStartServer === null && bStartServer !== null) {
        return 1;
    } else if (aStartServer !== null && bStartServer === null) {
        return -1;
    } else {
        return aStartData - bStartData;
    }
}

const ServerChange = (state, event) => {
    state.server = parseInt(event.target.value);
    const sort = (...args) => sortEvent(state.server, ...args);
    state.events.sort(sort);
    state = PairEventGacha(state);
    return { ...state }
}

// turn UNIX timestrap to data string
const dataStr = data => new Intl
    .DateTimeFormat('zh-CN', { dateStyle: 'full' })
    .format(new Date(parseInt(data)))

const ChangeStartEvent = (state, event) => ({ ...state, startEvent: parseInt(event.target.value) })

const SetPageCount = (state, event) => ({ ...state, pageCount: parseInt(event.target.value) })

// Views

// Card thumb in game
const gameCard = (card, cardId, character, stars, trained = false) => h("div", { class: "col-auto p-2" }, [
    h("div", { class: "game-card-container" }, [
        h("img", { src: getResURL(card, cardId, trained), class: "game-card", loading: "lazy" }),
        h("div", { class: `game-card-border game-card-border-${card.rarity}` }),
        h("div", { class: `game-card-band game-card-band-${character.bandId}` }),
        h("div", { class: `game-card-prop game-card-prop-${card.attribute}` }),
        ...stars
    ])
])

// Card's information
const horizonCard = (state, cardId) => {
    const card = state.rawCards[cardId];
    const character = state.characters[card.characterId];
    const skill = state.rawSkills[card.skillId];
    let stars = [], trainedStar = [];  // Add star element
    for (let i = 1; i <= card.rarity; i++) {
        stars.push(h("div", { class: `game-card-star game-card-star-p${i}` }));
        trainedStar.push(h("div", { class: `game-card-star-trained game-card-star-p${i}` }));
    }
    return h("div", { class: "card mb-3" }, [
        h("div", { class: "row g-0 align-items-center" }, [
            gameCard(card, cardId, character, stars),
            // Add padding when card's rarity <= 2
            card.rarity > 2
                ? gameCard(card, cardId, character, trainedStar, true)
                : h("div", { class: "col-auto p-2" }, [h("img", { width: "68" })]),
            h("div", { class: "col-md-8 p-2" }, [
                h("div", { class: "card-text" }, text(character.characterName[state.server])),
                h("div", { class: "card-text" }, text(card.prefix[nameIndex])),
                h("div", { class: "card-text" }, text(skill.simpleDescription[state.server]))
            ])
        ])
    ])
}

// Event-Gacha item
const eventGachaItem = (state, { event, gachas }) => h("div", { class: "row p-1" }, [
    h("div", { class: "col-md-6" }, [
        h("div", { class: "card" }, [
            h("img", { src: getBannerUrl("jp", event.bannerAssetBundleName), alt: state.language.loading, loading: "lazy", class: "banner" }),
            h("div", { class: "card-body" }, [
                h("b", { class: "card-title" }, text(event.eventName[nameIndex])),
                h("div", {}, text(dataStr(event.startAt[state.server]))),
                ...event.rewardCards.map(cardId => horizonCard(state, cardId))
            ])
        ])
    ]),
    h("div", { class: "col-md-6" }, [
        h("div", { class: "card" },
            gachas.map(gacha => [
                h("img", { src: getBannerUrl("jp", gacha.bannerAssetBundleName), alt: state.language.loading, loading: "lazy", class: "banner" }),
                h("div", { class: "card-body" }, [
                    h("b", { class: "card-title" }, text(gacha.gachaName[nameIndex])),
                    h("div", {}, text(dataStr(gacha.publishedAt[dataIndex]))),
                    ...gacha.newCards.map(cardId => horizonCard(state, cardId))
                ])]).flat()
        )
    ])
])

const eventGachaList = state => h("div", {},
    state.eventGachaPair
        .slice(state.startEvent, state.startEvent + state.pageCount)
        .map(pair => eventGachaItem(state, pair)))

const filterView = state => h("div", { class: "row p-1" }, [
    h("div", { class: "col" }, [
        h("label", {}, text(state.language.startEvent)),
        h("select", { class: "form-select", onchange: ChangeStartEvent }, [
            ...state.events.map(
                (v, idx) => h("option", { value: idx.toString() },
                    text(v.eventName[state.server]
                        ? v.eventName[state.server]
                        : v.eventName[dataIndex])))
        ])
    ])
])

const pageCountSelector = state => h("div", { class: "row p-1" }, [
    h("div", { class: "col" }, [
        h("label", {}, text(state.language.pageCount)),
        h("select", { class: "form-control", onchange: SetPageCount }, [
            ...[3, 5, 7, 10].map(v => h("option", { value: v.toString() }, text(v.toString())))
        ])
    ])
])

// App

app({
    init: [{
        gachas: null,
        events: null,
        rawCards: null,
        characters: null,
        rawSkills: null,
        server: 0,
        startEvent: 0,
        pageCount: 3,
        language: translates[getCurrLangNo()],
        eventGachaPair: [],
    },
    jsonFetcher("data/events.json", GotEvents),
    jsonFetcher("data/gachas.json", GotGachas),
    jsonFetcher("data/cards.json", GotCardsData),
    jsonFetcher("data/characters.json", GotCharactersData),
    jsonFetcher("data/skills.json", GotSkillData),
    ],
    view: state => h("div", {}, [
        navBar(state),
        h("div", { class: "container" }, [
            serverSelect(state, ServerChange),
            state.events && filterView(state),
            pageCountSelector(state),
            (state.gachas
                && state.events
                && state.rawCards
                && state.characters
                && state.rawSkills
                && state.eventGachaPair.length !== 0
            ) && eventGachaList(state),
        ])
    ]),
    node: document.getElementById("app")
})