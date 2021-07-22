import { h, text, app } from "hyperapp"
import { translates } from "./languages.js"
import { navBar, getCurrLangNo, profileLoader } from "./utils"

const StoreProfile = (state, index) => {
    let text = document.getElementById(`text-${index}`);
    let fullData = JSON.parse(text.value);
    state.profiles[index] = fullData;
    localStorage.setItem("profiles", JSON.stringify(state.profiles));
    return { ...state };
}

const NewProfile = state => {
    let newProfile = { name: "Profile " + Date.now().toString(), server: 1, data: "" };
    state.profiles.push(newProfile);
    return { ...state, profiles: state.profiles };
}

const SetPrimary = (state, index) => {
    localStorage.setItem("primaryProfile", index.toString());
    return { ...state, primaryProfile: index }
}

const DeleteProfile = (state, index) => {
    let newProfiles = state.profiles.filter((v, idx) => idx != index);
    localStorage.setItem("profiles", JSON.stringify(newProfiles));
    return { ...state, profiles: newProfiles }
}

// Views

const profileList = state => h("div", { class: "row p-2" }, [
    ...state.profiles.map((v, idx) => profileCard(state, v, idx))
])

const profileCard = (state, cardState, cardIdx) => h("div", { class: "card col-auto p-2" }, [
    h("div", { class: "card-body" }, [
        h("div", { class: "card-text p-1" }, text(`${state.language.profileName}: ${cardState.name}`)),
        h("div", { class: "card-text p-1" }, text(`${state.language.profileServer}: ${cardState.server}`)),
        h("textarea", { id: `text-${cardIdx}`, class: "card-text form-control p-2" }, text(JSON.stringify(cardState))),
        h("div", { class: "input-group p-1" }, [
            h("button", { class: "btn btn-outline-primary", onclick: [StoreProfile, cardIdx] }, text(state.language.importProfileData)),
            h("button", { class: "btn btn-outline-primary", onclick: [SetPrimary, cardIdx] }, text(state.language.setPrimaryData)),
            h("button", { class: "btn btn-outline-primary", onclick: [DeleteProfile, cardIdx] }, text(state.language.deleteProfile))
        ])
    ])
])

const addProfile = state => h("div", { class: "row p-1" }, [
    h("div", { class: "col-auto" }, [
        h("button", { class: "btn btn-primary", onclick: [NewProfile] }, text(state.language.createNewProfile))
    ])
])

app({
    init: [{
        language: translates[getCurrLangNo()],
        profiles: [],
        primaryProfile: 0,
    },
    profileLoader()
    ],
    view: state => h("div", {}, [
        navBar(state),
        h("div", { class: "container" }, [
            profileList(state),
            addProfile(state)
        ])
    ]),
    node: document.getElementById("app")
})