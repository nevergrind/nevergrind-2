var trade;
!function($, _, TweenMax, undefined) {
	trade = {
		timer: new delayedCall(0, ''),
		data: {},
		init,
		canTrade,
		handleRequest,
		rejectTradeBusy,
		declineTrade,
		tradeStart,
		tradeStartResp,
		tradeExpired,
		openTradeWindow,
		closeTradeWindow,
		getBodyHtml,
	}
	var str
	///////////////////////////////////////////
	function init() {
		// 1st player initiates trade with 2nd
		trade.data = _.cloneDeep(context.player)
		chat.log('Sent trade request to '+ context.player.name +'.', 'chat-warning')
		socket.publish('name' + context.player.name, {
			action: 'trade-request',
			row: my.row,
			name: my.name,
			race: my.race,
			face: my.face,
			gender: my.gender,
		});
		trade.timer = delayedCall(toast.expired, tradeExpired, [trade.data.name])
	}
	function tradeExpired(name) {
		chat.log('Your trade request with ' + name + ' expired.', 'chat-warning')
		trade.data = {}
	}
	function getBodyHtml() {
		str =
		'<div id="various-body" class="flex-row flex-max">' +
			'<div class="flex-column flex-max" style="margin: .1rem .2rem">' +
				'Trade Html' +
			'</div>' +
		'</div>'
		return str
	}
	function tradeStart() {
		// 2nd player confirms with Accept
		trade.timer.kill()
		if (canTrade()) {
			trade.data = {
				row: toast.data.row,
				name: toast.data.name,
				race: toast.data.race,
				face: toast.data.face,
				gender: toast.data.gender,
			}
			chat.log('You have accepted opening a trade window with ' + toast.data.name)
			socket.publish('name' + toast.data.name, {
				action: 'trade-start',
				name: my.name,
				race: my.race,
				face: my.face,
				gender: my.gender,
			})
			town.closeVarious()
			openTradeWindow()
		}
	}
	function tradeStartResp(data) {
		// 1st player receives trade Accept
		trade.timer.kill()
		if (ng.view === 'town') {
			trade.data = {
				...trade.data,
				race: data.race,
				face: data.face,
				gender: data.gender,
			}
			chat.log(data.name + ' accepted opening a trade window with you.')
			town.closeVarious()
			openTradeWindow()
		}
	}
	function openTradeWindow() {
		town.openVariousConfirmed({
			currentTarget: {
				dataset: {
					id: 'Trade'
				}
			}
		})
		console.info('openTradeWindow', trade.data)
	}
	function closeTradeWindow() {
		trade.data = {}
	}
	function rejectTradeBusy(data) {
		info('rejectTradeBusy', data)
		trade.timer.kill()
		chat.log(data.name + ' is busy right now.')
	}
	function declineTrade(data) {
		info('sendDecline', data)
		trade.timer.kill()
		trade.data = {}
		chat.log(data.name + ' rejected your trade request.')
	}
	function handleRequest(data) {
		info('trade handleRequest', data)
		if (toast.data.action || trade.data.name) {
			socket.publish('name' + data.name, {
				action: 'trade-reject-busy',
				name: my.name
			})
		}
		else {
			data.msg = data.name + ' has requested a trade.'
			chat.log(data.msg, 'chat-warning')
			// check if busy with windows, check if in town, check no mission, has a party request toast
			toast.add(data)
		}
	}
	function canTrade() {
		return !my.quest.id && ng.view === 'town' && !trade.data.name
	}
}($, _, TweenMax);