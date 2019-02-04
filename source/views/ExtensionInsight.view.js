import Preact from "preact"

import "views/ExtensionInsight.view.less"

// Colors were generated and selected from:
// https://www.colorhexa.com/3d2fae-to-b769d1

export default class ExtensionInsight {
    render() {
        return (
            <div class="ExtensionInsight">
                <title>
                    {this.props.insight.data[0]["Extension Name"]} -
                    Twitch Insights Visualization
                </title>
                <header>
                    <div class="Context">
                        Twitch Extension Insights
                    </div>
                    <div class="Name">
                        {this.props.insight.data[0]["Extension Name"]}
                    </div>
                    <div class="Date">
                        as of {this.props.insight.data[0]["Date"]}
                    </div>
                </header>
                <section class="Visualizations">
                    <Funnel funnel={this.streamerActionFunnel}/>
                    <Funnel funnel={this.viewerActionFunnel}/>
                    <Funnel funnel={this.viewerCountFunnel}/>
                </section>
                <footer>
                    <a class="Link" href={this.url} target="_blank">
                        See extension on Twitch
                    </a>
                </footer>
            </div>
        )
    }
    get url() {
        return "https://www.twitch.tv/ext/" + this.props.insight.data[0]["Extension Client ID"]
    }
    get viewerActionFunnel() {
        let data = this.props.insight.data[0]
        return {
            "title": "Viewer Actions Funnel - Today",
            "peak": data["Renders"],
            "events": [
                {
                    "label": "Renders",
                    "value": data["Renders"],
                    "color": "#3d2fae",
                },
                {
                    "label": "Views",
                    "value": data["Views"],
                    "color": "#6642ba",
                },
                {
                    "label": "Hovers",
                    "value": data["Mouseenters"],
                    "color": "#8e56c5",
                },
                {
                    "label": "Interactions",
                    "value": data["Clicks"],
                    "color": "#b769d1",
                },
            ]
        }
    }
    get viewerCountFunnel() {
        let data = this.props.insight.data[0]
        let period = " Last 30 Days"
        return {
            "title": "Viewer Funnel -" + (period || " Today"),
            "peak": data["Unique Renderers" + period],
            "events": [
                {
                    "label": "Unique Renderers",
                    "value": data["Unique Renderers" + period],
                    "color": "#3d2fae",
                },
                {
                    "label": "Unique Viewers",
                    "value": data["Unique Viewers" + period],
                    "color": "#6642ba",
                },
                {
                    "label": "Unique Hoverers",
                    "value": data["Unique Mouseenters" + period],
                    "color": "#8e56c5",
                },
                {
                    "label": "Unique Interactors",
                    "value": data["Unique Interactors" + period],
                    "color": "#b769d1",
                },
            ]
        }
    }
    get streamerActionFunnel() {
        let data = this.props.insight.data[0]
        return {
            "title": "Streamer Funnel - Today",
            "peak": data["Extension Details Page Visits"],
            "events": [
                {
                    "label": "Detail Page Visits",
                    "value": data["Extension Details Page Visits"],
                    "color": "#3d2fae",
                },
                {
                    "label": "Installs",
                    "value": data["Installs"],
                    "color": "#7a4cc0",
                },
                {
                    "label": "Activations",
                    "value": data["Activations"],
                    "color": "#b769d1",
                },
            ]
        }
    }
}

class Funnel {
    render() {
        return (
            <div class="Funnel Visualization">
                <div class="Title">{this.props.funnel.title}</div>
                <div class="Events">
                    {this.props.funnel.events.map((event) => (
                        <FunnelEvent event={event} peak={this.props.funnel.peak}/>
                    ))}
                </div>
            </div>
        )
    }
}

class FunnelEvent {
    render() {
        return (
            <div class="Event">
                <div class="Bar">
                    <div class="Fill" style={{
                        "height": this.height,
                        "background-color": this.color
                    }}/>
                </div>
                <div class="Value" title={this.props.event.value}>
                    {this.value}
                </div>
                <div class="Label">
                    {this.label}
                </div>
            </div>
        )
    }
    get color() {
        return this.props.event.color
    }
    get height() {
        return (this.props.event.value / this.props.peak) * 10 + "em"
    }
    get value() {
        if(this.props.event.value < 1000) {
            return this.props.event.value
        }

        return Math.round(this.props.event.value / 1000) + "k"
    }
    get label() {
        return this.props.event.label
    }
}
