import Preact from "preact"

import csvparse from "csv-parse/lib/sync"
import dragdrop from "drag-drop/buffer"

import "views/Mount.view.less"
import ExtensionInsight from "views/ExtensionInsight.view.js"

let collections = [
    // {
    //     "type": "Extension",
    //     "insights": csvparse(window.localStorage.getItem("insight"), {
    //         "cast": true, "columns": true
    //     })
    // }
]

export default class Mount {
    render() {
        return (
            <div id="mount">
                {this.content}
            </div>
        )
    }
    get content() {
        if(collections.length === 0) {
            return (
                <div>
                    Drag-and-drop your Twitch Insights CSV.
                </div>
            )
        }
        if(collections[0].type === "Extension") {
            return (
                <ExtensionInsight insight={collections[0].insights[0]}/>
            )
        }
        return (
            <div>
                We don't yet support that CSV format!
            </div>
        )
    }
    componentDidMount() {
        dragdrop("#mount", (files) => {
            files.forEach((file) => {
                // Create a new insight object.
                let collection = {
                    "filename": file.name,
                    "filesize": file.size,
                }

                // Attempt to parse the insights data.
                try {
                    collection.insights = file.toString("utf8")
                    collection.insights = csvparse(collection.insights, {
                        "cast": true, "columns": true
                    })
                } catch(error) {
                    console.error(`Could not parse "${file.name}"`)
                    console.error(error)
                    return
                }

                // Recognize the insights type.
                if(!!collection.insights[0]["Extension Name"]) {
                    collection.type = "Extension"
                }

                // Add the insights to the store.
                collections.unshift(collection)
            })
        })
    }
}
