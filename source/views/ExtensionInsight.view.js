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
                    <div class="StreamerFunnel">
                    </div>
                    <div class="ViewerFunnel">
                    </div>
                </section>
                <a class="Link" href={this.url} target="_blank">
                    link
                </a>
            </div>
        )
    }
    get url() {
        return "https://www.twitch.tv/ext/" + this.props.insight.data[0]["Extension Client ID"]
    }
}
