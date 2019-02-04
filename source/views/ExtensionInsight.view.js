import Preact from "preact"
import * as Recharts from "recharts"
// TODO: Consider precharts vs recharts
// TODO: Consider babel-plugin-recharts

import "views/ExtensionInsight.view.less"
// Colors were generated and selected from:
// https://www.colorhexa.com/3d2fae-to-b769d1

function toPercentage(value) {
    return Math.round(value * 100) + "%"
}

function toCount(value) {
    if(value < 1000) {
        return value
    }

    return Math.round(value / 1000) + "k"
}

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
                        for {this.props.insight["Date"]}
                    </div>
                </header>
                <section class="Boxes">
                    <Box box={{
                        "label": "Unique Active Channels",
                        "value": toCount(this.props.insight["Unique Active Channels Last 30 Days"]),
                    }}/>
                    <Box box={{"label": "Unique Viewers", "value": toCount(this.props.insight["Unique Viewers Last 30 Days"]),
                    }}/>
                    <Box box={{
                        "label": "Unique Interactors",
                        "value": toCount(this.props.insight["Unique Interactors Last 30 Days"]),
                    }}/>
                    <Box box={{
                        "label": "Unique Interaction Rate",
                        "value": toPercentage(this.props.insight["Interaction Rate"]),
                    }}/>
                </section>
                <section class="Graphs">
                    <Graph graph={this.channelGraph}/>
                </section>
                <section class="Visualizations">
                    <Funnel funnel={this.viewerCountFunnel}/>
                    <Funnel funnel={this.streamerActionFunnel}/>
                    <Funnel funnel={this.viewerActionFunnel}/>
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
    // get viewerGraph() {
    //     return {
    //         "title": "Unique Active Channels Over Time",
    //         "data": this.props.collection.insights.slice(0, 30).map((insight, index) => {
    //             return {
    //                 "date": insight["Date"],
    //                 "click-rate": insight["Interaction Rate"],
    //                 "hover-rate": insight["Mouseenter Rate"],
    //             }
    //         }).reverse()
    //     }
    // }
    get channelGraph() {
        return {
            "title": "Unique Active Channels Over Time",
            "data": this.props.collection.insights.slice(0, 1000).filter((insight) => {
                return insight["Unique Active Channels"] > 0
            }).map((insight) => {
                return {
                    "date": insight["Date"],
                    "unique-active-channels": insight["Unique Active Channels"],
                }
            }).reverse()
        }
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
            "title": "Streamer Actions Funnel - Today",
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

class Box {
    render() {
        return (
            <div class="Box">
                <div class="Value">{this.props.box.value}</div>
                <div class="Label">{this.props.box.label}</div>
            </div>
        )
    }
}

class Graph {
    render() {
        return (
            <div class="Graph Visualization">
                <div class="Title">{this.props.graph.title}</div>
                <Recharts.ResponsiveContainer width="99%" height="99%">
                    <Recharts.LineChart data={this.props.graph.data}>
                        <Recharts.CartesianGrid stroke="#CCC"/>
                        <Recharts.XAxis dataKey="date" minTickGap={30} axisLine={false}/>
                        <Recharts.YAxis orientation="right" axisLine={false} mirror={true}/>
                        {true ||<Recharts.Legend/>}
                        <Recharts.Tooltip animationDuration={100}/>
                        {Object.keys(this.props.graph.data[0]).filter((key) => key !== "date").map((key) => (
                            <Recharts.Line dataKey={key} stroke="#3d2fae" dot={false} type="monotone"/>
                        ))}
                    </Recharts.LineChart>
                </Recharts.ResponsiveContainer>
            </div>
        )
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
        return toCount(this.props.event.value)
    }
    get label() {
        return this.props.event.label
    }
}