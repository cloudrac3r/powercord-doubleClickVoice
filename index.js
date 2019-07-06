const { Plugin } = require("powercord/entities")
const webpack = require("powercord/webpack")
const { getModuleByDisplayName } = webpack
const { inject, uninject } = require("powercord/injector")

module.exports = class DoubleClickVoice extends Plugin {
	constructor () {
		super()
	}

	async startPlugin () {
		this._patchChannelList()
	}

	pluginWillUnload () {
		uninject("cadence-doubleclickvoice-channelitem")
	}

	async _patchChannelList() {
		const ChannelItem = await getModuleByDisplayName("ChannelItem")
		inject("cadence-doubleclickvoice-channelitem", ChannelItem.prototype, "render", function(_, res) {
			let channelType = res.props.children[1]._owner.pendingProps.channel.type
			if (channelType == 2) {
				res.props.onDoubleClick = res.props.onClick
				res.props.onClick = undefined
			}
			return res
		})
	}
}