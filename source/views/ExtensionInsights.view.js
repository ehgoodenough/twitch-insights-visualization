import Preact from "preact"
import * as Precharts from "precharts"
import Numeral from "numeral"

import "views/ExtensionInsights.view.less"

export default class ExtensionInsights {
    render() {
        return (
            <div class="ExtensionInsights">
                <title>
                    {this.props.insight["Extension Name"]} -
                    Twitch Insights Visualization
                </title>
                <header>
                    <div class="Brand">
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
                        "label": "Unique Clickers",
                        "value": toCount(this.props.insight["Unique Interactors Last 30 Days"]),
                    }}/>
                    <Box box={{
                        "label": "Unique Click Rate",
                        "value": toPercentage(this.props.insight["Interaction Rate"]),
                    }}/>
                </section>
                <section class="TimeGraphs">
                    <Graph graph={this.channelGraph}/>
                </section>
                <section class="FunnelCharts">
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
        let period = "Last 30 Days"
        return {
            "title": "Viewer Actions Funnel - " + period,
            "events": [
                {
                    "label": "Renders",
                    "value": this.props.insight["Renders" + " " + period],
                    "color": "#3d2fae",
                },
                {
                    "label": "Views",
                    "value": this.props.insight["Views" + " " + period],
                    "color": "#6642ba",
                },
                {
                    "label": "Hovers",
                    "value": this.props.insight["Mouseenters" + " " + period],
                    "color": "#8e56c5",
                },
                {
                    "label": "Clicks",
                    "value": this.props.insight["Clicks" + " " + period],
                    "color": "#b769d1",
                },
            ]
        }
    }
    get viewerCountFunnel() {
        let period = "Last 30 Days"
        return {
            "title": "Viewer Funnel - " + period,
            "events": [
                {
                    "label": "Unique Renderers",
                    "value": this.props.insight["Unique Renderers" + " " + period],
                    "color": "#3d2fae",
                },
                {
                    "label": "Unique Viewers",
                    "value": this.props.insight["Unique Viewers" + " " + period],
                    "color": "#6642ba",
                },
                {
                    "label": "Unique Hoverers",
                    "value": this.props.insight["Unique Mouseenters" + " " + period],
                    "color": "#8e56c5",
                },
                {
                    "label": "Unique Clickers",
                    "value": this.props.insight["Unique Interactors" + " " + period],
                    "color": "#b769d1",
                },
            ]
        }
    }
    get streamerActionFunnel() {
        let period = "Last 30 Days"
        return {
            "title": "Streamer Actions Funnel - " + period,
            "events": [
                {
                    "label": "Browses",
                    "value": this.props.insight["Extension Details Page Visits" + " " + period],
                    "color": "#3d2fae",
                },
                {
                    "label": "Installs",
                    "value": this.props.insight["Installs" + " " + period],
                    "color": "#7a4cc0",
                },
                {
                    "label": "Activations",
                    "value": this.props.insight["Activations" + " " + period],
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
                <Precharts.ResponsiveContainer width="100%" height="100%">
                    <Precharts.AreaChart data={this.props.graph.data}>
                        <defs>
                            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3d2fae" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#b769d1" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <Precharts.CartesianGrid stroke="#CCC" strokeDasharray="3 3"/>
                        <Precharts.XAxis dataKey="date" minTickGap={30} axisLine={false}/>
                        <Precharts.YAxis orientation="right" axisLine={false} mirror={true}/>
                        {true ||<Precharts.Legend/>}
                        <Precharts.Tooltip animationDuration={100}/>
                        {Object.keys(this.props.graph.data[0]).filter((key) => key !== "date").map((key) => (
                            <Precharts.Area dataKey={key} stroke="#3d2fae" fillOpacity={1} fill="url(#gradient)" type="monotone"/>
                        ))}
                    </Precharts.AreaChart>
                </Precharts.ResponsiveContainer>
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

function toPercentage(value) {
    return Math.round(value * 100) + "%"
}

function toCount(value) {
    if(value < 1000) {
        return value
    } else {
        // value like "1.00k, 3.29m, 5.67b"
        return new Numeral(value).format("0a")
    }
}

// Colors were generated and selected from:
// https://www.colorhexa.com/3d2fae-to-b769d1
