import Preact from "preact"
import Mount from "views/Mount.view.js"

function render(delta) {
    this.mount = Preact.render(<Mount/>, document.body, this.mount)
}

export default {render}
