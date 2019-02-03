import Preact from "preact"
import Dragdrop from "drag-drop/buffer"

import "views/Mount.view.less"

export default class Mount {
    render() {
        return (
            <div id="mount">
                Hello World!!
            </div>
        )
    }
    componentDidMount() {
        Dragdrop("#mount", (files) => {
            files.forEach((file) => {
                const contents = files[0].toString("utf8")
                console.log(contents)
            })
        })
    }
}
