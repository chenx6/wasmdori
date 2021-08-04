import { h, text, app } from "hyperapp"
import {
    jsonFetcher,
    GotBandsData,
    GotCardsData,
    navBar,
    getResURL,
    getCurrLangNo,
    serverSelect,
    selectedProfileLoader
} from "./utils.js"
import { translates } from "./languages.js"
import init, { gene_score } from '../libs/bgp_team_builder';

// Without argument will cause a error by rollup
// (Can't handle import.meta.url)...
init("./bgp_team_builder_bg.wasm");

// Actions && Effects

const ParameterChanged = (state, event) => ({
    ...state,
    parameter: event.target.value
})

const PropertyChanged = (state, event) => ({
    ...state,
    prop: event.target.value
})

const CheckboxChanged = (state, idStr) => {
    let origin = state.selectedCharacters;
    let id = parseInt(idStr);
    let newSelected = origin.includes(id)
        ? origin.filter((v) => v != id)
        : origin.push(id) && origin;
    return {
        ...state,
        selectedCharacters: newSelected
    }
}

// Turn raw character data into the data in array
const GotCharacterData = (state, data) => {
    let characters = [];
    for (const k of Object.keys(data)) {
        characters.push({ ...data[k], id: k });
    }
    return {
        ...state,
        characters: characters,
        rawCharacters: data
    }
}

const GotSongData = (state, data) => ({
    ...state, selectedSong: songNotes(data)
})

const GotSkillData = (state, data) => ({
    ...state, rawSkills: data
})

const PropBonusChanged = (state, event) => ({
    ...state,
    propBonus: parseFloat(event.target.value) / 100
})

const CharacterBonusChanged = (state, event) => ({
    ...state,
    characterBonus: parseFloat(event.target.value) / 100
})

const AllFitBonusChanged = (state, event) => ({
    ...state,
    allFitBonus: parseFloat(event.target.value) / 100
})

const EventTypeChanged = (state, event) => ({
    ...state,
    eventType: parseInt(event.target.value)
})

// A Shim aims to fit Bestdori's new song format
const songNotes = (apiChart) => {
    let notes = [];
    let timePerBeat = 0;
    let prevBeat = 0;
    let currTime = 0;
    apiChart
        .filter(t => 'BPM' === t.type)
        .sort((t, e) => t.beat - e.beat)
        .forEach(s => {
            currTime += (s.beat - prevBeat) * timePerBeat;
            prevBeat = s.beat;
            timePerBeat = 60 / s.bpm;
            notes.unshift({
                beat: prevBeat,
                time: currTime,
                timePerBeat: timePerBeat
            });
        });
    const calcTime = e => {
        for (let its = 0; its < notes.length; its++) {
            let s = notes[its];
            if (e >= s.beat)
                return s.time + (e - s.beat) * s.timePerBeat
        }
        return 0;
    };
    const feverStartNote = apiChart.find(t => 'System' === t.type && 'cmd_fever_start.wav' === t.data);
    const feverEndNote = apiChart.find(t => 'System' === t.type && 'cmd_fever_end.wav' === t.data);
    const feverStart = feverStartNote ? feverStartNote.beat : -1;
    const feverEnd = feverEndNote ? feverEndNote.beat : -1;
    let oldList = [];
    apiChart.forEach(t => {
        switch (t.type) {
            case 'Single':
            case 'Directional':
                oldList.push({
                    time: calcTime(t.beat),
                    fever: t.beat >= feverStart && t.beat <= feverEnd,
                    skill: t.skill
                });
                break;
            case 'Slide':
            case 'Long':
                t.connections.forEach(t => {
                    t.hidden || oldList.push({
                        time: calcTime(t.beat),
                        fever: t.beat >= feverStart && t.beat <= feverEnd,
                        skill: t.skill
                    })
                });
                break;
        }
    });
    oldList.sort((t, e) => t.time - e.time || !!e.skill - !!t.skill);
    return oldList;
}

const BuildTeam = state => {
    // Input validation
    if (state.selectedCharacters.length != 5 || state.selectedProfile === null) {
        return state;
    }
    let event_bonus = {
        prop: state.prop,
        parameter: state.parameter,
        characters: state.selectedCharacters,
        prop_bonus: state.propBonus,
        character_bonus: state.characterBonus,
        all_fit_bonus: state.allFitBonus,
    };
    const begin = Date.now();
    let result = gene_score(event_bonus,
        state.rawCards,
        state.selectedProfile,
        state.rawCharacters,
        state.rawBands,
        state.selectedSong,
        state.rawSkills,
        state.eventType);
    console.log("Time: %d", Date.now() - begin);
    return {
        ...state,
        bestTeam: result
    }
}

// Views

// Character select box
const characterInputBox = (state, character) =>
    character.characterName[state.server] && h("div", { class: "p-1" }, [
        h("label", { for: character.id, class: "form-check-label" }, text(character.characterName[state.server])),
        h("input", { type: "checkbox", name: character.id, class: "form-check-input", onclick: [CheckboxChanged, character.id] })
    ])

// Character input group
const characterInputGroup = state => h("div", { class: "row p-1" }, [
    h("div", { class: "col" }, [
        h("label", {}, text(state.language.selectCharacter)),
        h("div", { class: "col input-group" },
            state.characters
                .map(character => characterInputBox(state, character))
        )
    ])
])

const selectParaBox = state => h("div", { class: "col" }, [
    h("label", { for: "prop" }, text(state.language.selectProperty)),
    h("select", { name: "prop", id: "prop", class: "form-select", onchange: PropertyChanged }, [
        h("option", { value: "happy" }, text("Happy")),
        h("option", { value: "pure" }, text("Pure")),
        h("option", { value: "cool" }, text("Cool")),
        h("option", { value: "powerful" }, text("Powerful")),
    ])
])

const selectPropBox = state => h("div", { class: "col" }, [
    h("label", { for: "parameter" }, text(state.language.selectParameter)),
    h("select", { name: "parameter", id: "parameter", class: "form-select", onchange: ParameterChanged }, [
        h("option", { value: "performance" }, text(state.language.performance)),
        h("option", { value: "technique" }, text(state.language.technique)),
        h("option", { value: "visual" }, text(state.language.visual)),
    ])
])

const bonusInput = state => h("div", { class: "row p-1" }, [
    h("div", { class: "col" }, [
        h("label", { class: "form-label" }, text(state.language.propBonus)),
        h("div", { class: "input-group" }, [
            h("input", { type: "number", step: "10", min: "0", max: "100", class: "form-control", onchange: PropBonusChanged }),
            h("span", { class: "input-group-text" }, text("%"))
        ]),
    ]),
    h("div", { class: "col" }, [
        h("label", { class: "form-label" }, text(state.language.characterBonus)),
        h("div", { class: "input-group" }, [
            h("input", { type: "number", step: "10", min: "0", max: "100", class: "form-control", onchange: CharacterBonusChanged }),
            h("span", { class: "input-group-text" }, text("%"))
        ]),
    ]),
    h("div", { class: "col" }, [
        h("label", { class: "form-label" }, text(state.language.allFitBonus)),
        h("div", { class: "input-group" }, [
            h("input", { type: "number", step: "10", min: "0", max: "100", class: "form-control", onchange: AllFitBonusChanged }),
            h("span", { class: "input-group-text" }, text("%"))
        ])
    ]),
])

const eventTypeInput = state => h("div", { class: "row p-1" }, [
    h("div", { class: "col" }, [
        h("label", { class: "form-label" }, text(state.language.selectMode)),
        h("select", { class: "form-select", onchange: EventTypeChanged }, [
            ...[state.language.freePlay, state.language.multiPlay, state.language.vsPlay]
                .map((v, idx) => h("option", { value: idx.toString() }, text(v)))
        ])
    ])
])

const resultTeamView = state => h("div", { class: "row justify-content-md-center p-1" },
    Object.values(state.bestTeam).map((v) => h("div", { class: "card col" }, [
        // Use getResURL to get card's image
        h("img", { src: getResURL(state.rawCards[v.card_id], v.card_id), width: "64", class: "card-img-top" }),
        h("ul", { class: "list-group list-group-flush" }, [
            h("li", { class: "list-group-item text-truncate" }, text(state.rawCards[v.card_id].prefix[state.server]))
        ])
    ]))
)

// App

app({
    init: [{
        characters: [], // Characters data (names, id...)
        selectedCharacters: [], // Selected bonus character
        server: 0,
        language: translates[getCurrLangNo()],
        prop: "happy", // Bonus properity
        parameter: "happy", // Bonus parameter
        propBonus: 0,
        characterBonus: 0,
        allFitBonus: 0,
        eventType: 0,
        bestTeam: [], // Calculated result
        rawCharacters: {}, // Bestdori's raw data
        rawBands: null,
        rawCards: null,
        rawSkills: null,
        profiles: [], // All profiles
        selectedProfile: {}, // Primary profile,
        selectedSong: {} // Song data from bestdori
    },
    jsonFetcher("data/characters.json", GotCharacterData),
    jsonFetcher("data/bands.json", GotBandsData),
    jsonFetcher("data/cards.json", GotCardsData),
    jsonFetcher("data/125.expert.json", GotSongData), // TODO: REPLACE A to Z！A to Z！天下を, A to Z！A to Z！取ります！
    jsonFetcher("data/skills.json", GotSkillData),
    selectedProfileLoader()
    ],
    view: state => h("div", {}, [
        navBar(state),
        h("div", { class: "container" }, [
            serverSelect(state),
            characterInputGroup(state),
            h("div", { class: "row p-1" }, [
                selectPropBox(state),
                selectParaBox(state),
            ]),
            bonusInput(state),
            eventTypeInput(state),
            h("div", { class: "row p-1" }, [
                h("div", { claas: "col" }, [
                    h("button", { class: "btn btn-primary", onclick: [BuildTeam] }, text(state.language.generate))
                ])
            ]),
            state.bestTeam.length != 0 && resultTeamView(state)
        ])
    ]),
    node: document.getElementById("app"),
})
