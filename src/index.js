import { h, app, text } from "hyperapp"
import { translates } from "./languages.js"
import { getCurrLangNo, navBar } from "./utils.js"

const about = state => h("div", { class: "container" }, [
    h("h3", { class: "row p-1 justify-content-center" }, text(state.language.aboutText1)),
    h("div", { class: "row p-1 justify-content-center" }, [
        h("div", { class: "col-md-8" }, [
            h("p", {}, text(state.language.frontPage)),
            h("a", { href: "https://github.com/chenx6/wasmdori" }, text("chenx6/wasmdori"))
        ])
    ]),
    h("div", { class: "row p-1 justify-content-center" }, [
        h("div", { class: "col-md-8" }, [
            h("p", {}, text(state.language.subProject)),
            h("ul", {}, [
                h("li", {}, [
                    h("a", { href: "https://github.com/chenx6/bgp-team-builder" }, text("bgp-team-builder"))
                ]),
                h("li", {}, [
                    h("a", { href: "https://github.com/chenx6/bgp-card-recognize" }, text("bgp-card-recognize"))
                ])
            ])
        ])
    ]),
    h("div", { class: "row p-1 justify-content-center" }, [
        h("div", { class: "col-md-8" }, [
            h("p", {}, text(state.language.helpProject)),
            h("ul", {}, [
                h("li", {}, [
                    h("a", { href: "https://github.com/jorgebucaran/hyperapp" }, text("Hyperapp"))
                ]),
                h("li", {}, [
                    h("a", { href: "https://getbootstrap.com/" }, text("Bootstrap"))
                ]),
                h("li", {}, [
                    h("a", { href: "https://bestdori.com/" }, text("Bestdori"))
                ]),
                h("li", {}, text("..."))
            ])
        ])
    ])
])

app({
    init: {
        language: translates[getCurrLangNo()]
    },
    view: state => h("div", {}, [
        navBar(state),
        about(state)
    ]),
    node: document.getElementById("app")
})