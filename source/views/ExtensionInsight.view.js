import Preact from "preact"

import "views/ExtensionInsight.view.less"

// Colors were generated and selected from:
// https://www.colorhexa.com/3d2fae-to-b769d1

export default class ExtensionInsight {
    render() {
        return (
            <div class="ExtensionInsight">
                <title>
                    {this.props.insight["Extension Name"]} -
                    Twitch Insights Visualization
                </title>
                <header>
                    <div class="Context">
                        Twitch Extension Insights
                    </div>
                    <div class="Name">
                        {this.props.insight["Extension Name"]}
                    </div>
                    <div class="Date">
                        as of {this.props.insight["Date"]}
                    </div>
                </header>
                <section class="Boxes">
                    <div class="Box">
                        <div class="Label">Unique Channels</div>
                        <div class="Value">{this.props.insight["Unique Active Channels Last 30 Days"]}</div>
                    </div>
                </section>
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
        return "https://www.twitch.tv/ext/" + this.props.insight["Extension Client ID"]
    }
    get viewerActionFunnel() {
        return {
            "title": "Viewer Actions Funnel - Today",
            "events": [
                {
                    "label": "Renders",
                    "value": this.props.insight["Renders"],
                    "color": "#3d2fae",
                },
                {
                    "label": "Views",
                    "value": this.props.insight["Views"],
                    "color": "#6642ba",
                },
                {
                    "label": "Hovers",
                    "value": this.props.insight["Mouseenters"],
                    "color": "#8e56c5",
                },
                {
                    "label": "Interactions",
                    "value": this.props.insight["Clicks"],
                    "color": "#b769d1",
                },
            ]
        }
    }
    get viewerCountFunnel() {
        let period = " Last 30 Days"
        return {
            "title": "Viewer Funnel -" + (period || " Today"),
            "events": [
                {
                    "label": "Unique Renderers",
                    "value": this.props.insight["Unique Renderers" + period],
                    "color": "#3d2fae",
                },
                {
                    "label": "Unique Viewers",
                    "value": this.props.insight["Unique Viewers" + period],
                    "color": "#6642ba",
                },
                {
                    "label": "Unique Hoverers",
                    "value": this.props.insight["Unique Mouseenters" + period],
                    "color": "#8e56c5",
                },
                {
                    "label": "Unique Interactors",
                    "value": this.props.insight["Unique Interactors" + period],
                    "color": "#b769d1",
                },
            ]
        }
    }
    get streamerActionFunnel() {
        return {
            "title": "Streamer Funnel - Today",
            "events": [
                {
                    "label": "Detail Page Visits",
                    "value": this.props.insight["Extension Details Page Visits"],
                    "color": "#3d2fae",
                },
                {
                    "label": "Installs",
                    "value": this.props.insight["Installs"],
                    "color": "#7a4cc0",
                },
                {
                    "label": "Activations",
                    "value": this.props.insight["Activations"],
                    "color": "#b769d1",
                },
            ]
        }
    }
}

class Funnel {
    render() {
        let peak = Math.max(...this.props.funnel.events.map((event) => event.value))
        return (
            <div class="Funnel Visualization">
                <div class="Title">{this.props.funnel.title}</div>
                <div class="Events">
                    {this.props.funnel.events.map((event) => (
                        <FunnelEvent event={event} peak={peak}/>
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
