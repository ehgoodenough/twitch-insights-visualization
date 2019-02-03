import Preact from "preact"

import "views/ExtensionInsight.view.less"

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
                <section class="Funnels">
                    <Funnel funnel={this.viewerfunnel}/>
                    <Funnel funnel={this.streamerfunnel}/>
                </section>
                <section class="Links">
                    <a class="Link" href={this.url} target="_blank">
                        See extension on Twitch
                    </a>
                </section>
            </div>
        )
    }
    get url() {
        return "https://www.twitch.tv/ext/" + this.props.insight.data[0]["Extension Client ID"]
    }
    get viewerfunnel() {
        let data = this.props.insight.data[0]
        let period = " Last 30 Days"
        return {
            "title": "Viewer Funnel -" + (period || " Today"),
            "peak": data["Unique Renderers" + period],
            "events": [
                {
                    "label": "Unique Renderers",
                    "value": data["Unique Renderers" + period],
                },
                {
                    "label": "Unique Viewers",
                    "value": data["Unique Viewers" + period],
                },
                {
                    "label": "Unique Hoverers",
                    "value": data["Unique Mouseenters" + period],
                },
                {
                    "label": "Unique Interactors",
                    "value": data["Unique Interactors" + period],
                },
            ]
        }
    }
    get streamerfunnel() {
        let data = this.props.insight.data[0]
        return {
            "title": "Streamer Funnel - Today",
            "peak": data["Extension Details Page Visits"],
            "events": [
                {
                    "label": "Detail Page Visits",
                    "value": data["Extension Details Page Visits"],
                },
                {
                    "label": "Installs",
                    "value": data["Installs"],
                },
                {
                    "label": "Activations",
                    "value": data["Activations"],
                },
            ]
        }
    }
}

class Funnel {
    render() {
        return (
            <div class="Funnel">
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
        return "orange"
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
