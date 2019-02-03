import Preact from "preact"

import csvparse from "csv-parse/lib/sync"
import dragdrop from "drag-drop/buffer"

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
        dragdrop("#mount", (files) => {
            files.forEach((file) => {
                try {
                    let contents = files[0].toString("utf8")
                    contents = csvparse(contents, {
                        "cast": true,
                        "columns": true,
                    })
                    console.log(contents[0])
                    console.log(contents[1])
                    console.log(contents[2])
                } catch(error) {
                    console.error(`Could not parse "${file.name}"`)
                }
            })
        })
    }
}
