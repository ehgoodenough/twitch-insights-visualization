import csvparse from "csv-parse/lib/sync"

export default class Collection {
    constructor(that) {
        this.filename = that.filename
        this.filesize = that.filesize

        this.insights = that.insights

        try {
            this.insights = this.insights.toString("utf8")
            this.insights = csvparse(this.insights, {"cast": true, "columns": true})
        } catch(error) {
            console.error("Could not parse file.")
            console.error(error)
            return
        }

        if(!!this.insights[0]["Extension Name"]) {
            this.type = "Extension"
        }

        this.aggregate("Extension Details Page Visits")
        this.aggregate("Installs")
        this.aggregate("Activations")
        this.aggregate("Renders")
        this.aggregate("Views")
        this.aggregate("Mouseenters")
        this.aggregate("Clicks")
        this.normalize("Unique Renderers")
        this.normalize("Unique Viewers")
        this.normalize("Unique Mouseenters")
        this.normalize("Unique Interactors")

        this.isExample = that.isExample
    }
    normalize(key) {
        this.insights[0][key + " Today"] = this.insights[0][key]
    }
    aggregate(key) {
        this.insights[0][key + " Today"] = this.insights[0][key]
        this.insights[0][key + " Last 7 Days"] = this.insights.slice(0, 7).map(a => a[key]).reduce((a, b) => a + b)
        this.insights[0][key + " Last 30 Days"] = this.insights.slice(0, 30).map(a => a[key]).reduce((a, b) => a + b)
    }
}
