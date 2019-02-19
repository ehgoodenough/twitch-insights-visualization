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

        this.isExample = that.isExample
    }
}
