import Preact from "preact"

import "views/ExtensionInsight.view.less"

export default class ExtensionInsight {
    render() {
        return (
            <div class="ExtensionInsight">
                <header>
                    <div class="Context">
                        Twitch Extension Insights
                    </div>
                    <div class="Name">
                        {this.props.insight.data[0]["Extension Name"]}
                    </div>
                </header>
                <section class="Funnels">
                    <Funnel funnel={this.viewerFunnel}/>
                    <div class="Funnel"></div>
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
    get viewerFunnel() {
        let data = this.props.insight.data[0]
        let period = "Last 30 Days"
        return {
            "title": `Viewer Funnel - ${period}`,
            "peak": data[`Unique Renderers ${period}`],
            "events": [
                {
                    "label": "Unique Renderers",
                    "value": data[`Unique Renderers ${period}`],
                },
                {
                    "label": "Unique Viewers",
                    "value": data[`Unique Viewers ${period}`],
                },
                {
                    "label": "Unique Hoverers",
                    "value": data[`Unique Mouseenters ${period}`],
                },
                {
                    "label": "Unique Interactors",
                    "value": data[`Unique Interactors ${period}`],
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
                        <div class="Event">
                            <div class="Bar">
                                <div class="Fill" style={{
                                    "height": 10 * (event.value / this.props.funnel.peak) + "em"
                                }}/>
                            </div>
                            <div class="Value">
                                {event.value}
                            </div>
                            <div class="Label">
                                {event.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }
}
