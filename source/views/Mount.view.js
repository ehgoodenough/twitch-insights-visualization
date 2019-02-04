import Preact from "preact"
import csvparse from "csv-parse/lib/sync"
import dragdrop from "drag-drop/buffer"

import view from "views/.js"

import ExtensionInsights from "views/ExtensionInsights.view.js"
// import GameInsights from "views/GameInsights.view.js"

import "views/Mount.view.less"

const CSV_PARSE_OPTIONS = {"cast": true, "columns": true}
const EXAMPLE_CSV = `Date,Extension Name,Extension Client ID,Extension Details Page Visits,Unique Extension Details Page Visits,Installs,Uninstalls,Activations,Unique Active Channels,Unique Active Channels Last 7 Days,Unique Active Channels Last 30 Days,Unique Identity Links,Unique Identity Unlinks,Renders,Unique Renderers,Unique Renderers Last 7 Days,Unique Renderers Last 30 Days,Views,Unique Viewers,Unique Viewers Last 7 Days,Unique Viewers Last 30 Days,Mouseenters,Unique Mouseenters,Unique Mouseenters Last 7 Days,Unique Mouseenters Last 30 Days,Mouseenters Per Viewer,Mouseenter Rate,Clicks,Unique Interactors,Unique Interactors Last 7 Days,Unique Interactors Last 30 Days,Clicks Per Interactor,Interaction Rate,Minimizations,Unique Minimizers,Minimization Rate,Unminimizations,Unique Unminimizers,Unminimization Rate,Bits Revenue USD,Bits Used,Bits Transactions,Bits Per Transaction,Unique Bits Users,Unique Bits Users Last 7 Days,Unique Bits Users Last 30 Days,Bits Used Per User
5/31/2018,Example Extension,hs5z3fh5dxhshfhazhk4hq38g9hz51,42,13,18,5,9,164,462,756,51,8,23954,13084,80730,168982,23954,13084,80730,168982,51796,7564,40166,79960,3.9587,0.5781,6512,1365,6848,15464,4.7707,0.1043,410,369,0.0282,12,10,0.0009,1.08,540,32,16.875,30,132,417,18
6/1/2018,Example Extension,hs5z3fh5dxhshfhazhk4hq38g9hz52,30,11,14,5,5,124,434,714,37,5,17286,9308,79066,163978,17286,9308,79066,163978,40010,5462,39166,77026,4.2985,0.5868,4412,1182,6926,14972,3.7327,0.127,292,273,0.0293,10,8,0.0011,0.87,435,38,11.4474,15,117,402,29
6/2/2018,Example Extension,hs5z3fh5dxhshfhazhk4hq38g9hz53,21,8,14,5,5,128,440,694,15,2,7930,5220,84282,163124,7930,5220,84282,163124,10516,2208,42176,75940,2.0146,0.423,1700,411,7636,14716,4.1363,0.0787,60,51,0.0098,4,4,0.0008,0.06,30,4,7.5,6,117,396,5
6/3/2018,Example Extension,hs5z3fh5dxhshfhazhk4hq38g9hz54,30,11,11,6,5,132,438,678,27,2,28412,21270,87358,165508,28412,21270,87358,165508,33464,7638,44426,76154,1.5733,0.3591,5356,1290,8760,14664,4.1519,0.0606,250,312,0.0147,4,4,0.0002,0.69,345,8,43.125,9,129,405,38.3333
6/4/2018,Example Extension,hs5z3fh5dxhshfhazhk4hq38g9hz55,31,10,16,4,8,184,442,654,51,6.5,31360,18238,80720,152212,31360,18238,80720,152212,62222,9678,44510,72208,3.4117,0.5307,7754,1986,10142,14124,3.9043,0.1089,466,477,0.0262,18,18,0.001,1.14,570,36,15.8333,33,162,408,17.2727
6/5/2018,Example Extension,hs5z3fh5dxhshfhazhk4hq38g9hz56,29,11,19,4,7,130,412,616,31,3.5,25562,14628,75620,147288,25562,14628,75620,147288,53390,7916,41896,69244,3.6498,0.5412,6670,1620,9414,13428,4.1173,0.1107,410,405,0.0277,2,2,0.0001,1.08,540,12,45,9,153,405,60
6/6/2018,Example Extension,hs5z3fh5dxhshfhazhk4hq38g9hz57,35,12,15,4,7,162,388,592,39,5,29130,18574,72038,144320,29130,18574,72038,144320,59696,10256,39912,66560,3.214,0.5522,7512,1884,8876,12836,3.9873,0.1014,458,507,0.0273,26,16,0.0014,1.32,660,58,11.3793,30,165,420,22
6/7/2018,Example Extension,hs5z3fh5dxhshfhazhk4hq38g9hz58,26,8,12,3,5,124,348,554,31,5,24184,14830,62452,138678,24184,14830,62452,138678,50960,7926,34506,61998,3.4363,0.5345,8434,1860,8056,12108,4.5344,0.1254,552,504,0.034,30,18,0.002,0.72,360,10,36,12,144,411,30
6/8/2018,Example Extension,hs5z3fh5dxhshfhazhk4hq38g9hz59,20,7,12,4,6,120,330,542,43,6.5,19732,12308,58580,133930,19732,12308,58580,133930,39890,6588,31670,59152,3.241,0.5353,7256,1560,7294,11356,4.6513,0.1267,436,468,0.038,14,14,0.0011,0.81,405,28,14.4643,18,150,411,22.5
6/9/2018,Example Extension,hs5z3fh5dxhshfhazhk4hq38g9hz60,24,8,12,3,7,134,324,538,41,6.5,30622,17092,56124,129834,30622,17092,56124,129834,63590,9626,29608,56998,3.7205,0.5632,11176,2493,6692,10768,4.483,0.1459,726,624,0.0365,16,14,0.0009,1.89,945,14,67.5,15,141,429,63`

let collections = [
    {
        "type": "Extension",
        "insights": csvparse(EXAMPLE_CSV, CSV_PARSE_OPTIONS),
        "isExample": true,
    }
]

export default class Mount {
    render() {
        return (
            <div id="mount">
                <DragZone/>
                {this.content}
            </div>
        )
    }
    get content() {
        if(collections.length > 0
        && collections[0].type === "Extension") {
            return (
                <ExtensionInsights
                    collection={collections[0]}
                    insight={collections[0].insights[0]}/>
            )
        }
        return (
            <div>
                We couldn't parse that file! Sorry!
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
                    collection.insights = csvparse(collection.insights, CSV_PARSE_OPTIONS)
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
                view.render()
            })
        })
    }
}

class DragZone {
    render() {
        return (
            <div class={"DragZone" + (collections[0].isExample ? " isExample" : "")}>
                <div class="Prompt">Drag-and-drop a Twitch Insights CSV here!!</div>
            </div>
        )
    }
}
