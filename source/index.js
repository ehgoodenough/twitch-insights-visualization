if(__STAGE__ === "DEVELOPMENT") {
    require("statgrab/do")
    console.clear()
}

import Yaafloop from "yaafloop"

import model from "models/.js"
import view from "views/.js"

let loop = new Yaafloop((delta) => {
    model.update(delta)
    view.update(delta)
})
