import Preact from "preact"

import csvparse from "csv-parse/lib/sync"
import dragdrop from "drag-drop/buffer"

import "views/Mount.view.less"

let insights = []

export default class Mount {
    render() {
        return (
            <div id="mount">
                {this.content}
            </div>
        )
    }
    get content() {
        if(insights.length === 0) {
            return (
                <div>
                    Drag-and-drop your Twitch Insights CSV.
                </div>
            )
        }
        if(insights[0].type === "Extension") {
            return (
                <ExtensionInsight insight={insights[0]}/>
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
                let insight = {
                    "filename": file.name,
                    "filesize": file.size,
                }

                // Attempt to parse the insights data.
                try {
                    insight.data = file.toString("utf8")
                    insight.data = csvparse(insight.data, {
                        "cast": true, "columns": true
                    })
                } catch(error) {
                    console.error(`Could not parse "${file.name}"`)
                    console.error(error)
                    return
                }

                // Recognize the insights type.
                if(!!insight.data[0]["Extension Name"]) {
                    insight.type = "Extension"
                }

                // Add the insights to the store.
                insights.unshift(insight)
            })
        })
    }
}

class ExtensionInsight {
    render() {
        return (
            <div class="Insight">
                <h1>{this.props.insight.data[0]["Extension Name"]}</h1>
                <h3>{this.props.insight.data[0]["Extension Client ID"]}</h3>
            </div>
        )
    }
}
