var trade;
!function($, _, TweenMax, undefined) {
	trade = {
		startEq: [],
		startInv: [],
		timer: new delayedCall(0, ''),
		data: {},
		gold: 0,
		initiator: false,
		confirmed: false,
		MAX_GOLD: 4294967295,
		droppedItem,
		init,
		canTrade,
		handleRequest,
		rejectTradeBusy,
		declineTrade,
		tradeStart,
		tradeStartResp,
		tradeExpired,
		openTradeWindow,
		getBodyHtml,
		txCloseTradeWindow,
		rxTradeClosedReceived,
		getTradeAvatar,
		rxTradeUpdate,
		rxUpdateGold,
		rxProcessing,
	}
	var str, i, val, el, count, len, key, msg

	let max = 0
	let tradeData = {}
	let rule = {
		confirmed: 'box-shadow: inset 0 9999px #050; border: .1rem ridge #0a0;',
	}

	$('#root-various')
		.on('change', '#trade-gold', goldChange)
		.on('click', '#trade-confirm', tradeConfirm)
		.on('click', '#trade-cancel', tradeCancelled)
	///////////////////////////////////////////
	function droppedItem() {
		warn('trade dropToOtherSlots ', item.dropType, ' is client side only. Skipping update-item.php')

		info('trade drag', item.dragType, item.dragSlot, item.dragData)

		info('trade drop', item.dropType, item.dropSlot, item.dropData)
		querySelector('#' + item.dropType + '-name-' + item.dropSlot).innerHTML = item.getItemNameString(item.dragData, item.dragData.baseName, true)
		// broadcast to tradeFrom

		updateTrade({
			tradeTo: item.dragData,
		}, item.dropSlot)

		// update my client
		items.tradeFrom[item.dropSlot] = _.cloneDeep(item.dragData)
		items[item.dragType][item.dragSlot].isTrading = true
		bar.updateItemSwapDOM()
		item.resetDrop()
		warn('lastDragEvent', item.lastDragEvent)
		if (item.isContextClick) tooltip.handleItemEnter(item.lastDragEvent)
		else tooltip.handleItemEnter(item.lastDropEvent)
	}
	function updateTrade(data, slot) {
		tradeData = {
			action: 'trade-update',
			data: data
		}
		if (typeof slot !== 'undefined') tradeData.slot = slot
		socket.publish('name' + trade.data.name, tradeData);
	}
	function updateToItem(obj) {
		warn('tradeTo', obj)
		items.tradeTo[obj.slot] = obj.data.tradeTo
		bar.updateItemSlotDOM('tradeTo', obj.slot)
		querySelector('#tradeTo-name-' + obj.slot).innerHTML = item.getItemNameString(obj.data.tradeTo, obj.data.tradeTo.baseName, true)
	}
	function rxTradeUpdate(obj) {
		info('trade rxTradeUpdate', obj.data)
		if (trade.data.name) {
			for (key in obj.data) {
				if (key === 'tradeTo') {
					updateToItem(obj)
				}
				else {
					trade.data[key] = obj.data[key]
					if (key === 'gold') {
						querySelector('#trade-gold-from').textContent = obj.data[key]
					}

					// should be last
					if (key === 'confirmed') {
						if (obj.data[key]) {
							querySelector('#trade-column-to').setAttribute('style', rule.confirmed)
							if (trade.confirmed && trade.data.confirmed) tradeCompleted()
						}
						else querySelector('#trade-column-to').setAttribute('style', '')
					}
				}
			}
		}
	}
	function tradeChanged() {
		trade.confirmed = false
		el = querySelector('#trade-column-from')
		el.setAttribute('style', '')
		el.classList.remove('no-pointer')
	}
	function tradeConfirm() {
		info('tradeConfirm tradeTo', items.tradeTo)
		info('tradeConfirm tradeFrom', items.tradeFrom)
		info('valid?', isTradeValid())
		if (my.gold - trade.gold + trade.data.gold > trade.MAX_GOLD) {
			ng.msg('This trade would put you over the gold limit! It is illegal to have that much gold!')
			return
		}
		trade.confirmed = true
		updateTrade({
			confirmed: true,
		})
		if (trade.confirmed && trade.data.confirmed) {
			info('availableInvSlots', availableInvSlots())
			info('trade.data.availableSlots', trade.data.availableSlots)
			info('countToItems', countToItems())
			info('countFromItems', countFromItems())

			warn('/////////////////////////////')
			info('compare 1', countToItems(), availableInvSlots() + countFromItems())
			info('compare 2', countFromItems(), trade.data.availableSlots + countToItems())

			if (countToItems() > availableInvSlots() + countFromItems()) {
				msg = my.name + ' does not have enough inventory space to facilitate this trade.'
				chat.log(msg, 'chat-warning')
				txCloseTradeWindow(msg)
			}
			else if (countFromItems() > trade.data.availableSlots + countToItems()) {
				msg = trade.data.name + ' does not have enough inventory space to facilitate this trade.'
				chat.log(msg, 'chat-warning')
				txCloseTradeWindow(msg)
			}
			else tradeCompleted()
		}

		el = querySelector('#trade-column-from')
		if (el !== null) {
			el.setAttribute('style', rule.confirmed)
			el.classList.add('no-pointer')
		}
	}
	function tradeCancelled() {
		tradeChanged()
		updateTrade({
			confirmed: false
		})
	}
	function goldChange() {
		el = $(this)
		val = el.val() * 1
		max = maxGoldSend()
		info('val', val)
		if (val < 0) {
			val = 0
			el.val(val)
			ng.msg('It\'s not possible to send a negative amount of gold. What kind of financial system do you think this is?', 8)
		}
		else if (val > max) {
			val = max
			el.val(max)
			ng.msg('The maximum amount of gold you can send is ' + max + '. This value may change based on trade conditions.', 8)
		}
		if (val > my.gold) val = my.gold
		trade.gold = val
		info('final val', val)
		tradeChanged()

		updateTrade({
			gold: trade.gold,
			confirmed: false,
		})
	}
	function countFromItems() {
		// Rhys
		count = 0
		items.tradeFrom.map(item => {
			if (item.name) count++
		})
		return count
	}
	function countToItems() {
		// Tigole
		count = 0
		items.tradeTo.map(item => {
			if (item.name) count++
		})
		return count
	}
	function availableInvSlots() {
		count = 0
		items.inv.map(item => {
			if (!item.name) count++
		})
		return count
	}
	function tradeCompleted() {
		info('tradeCompleted gold', trade.gold)
		info('tradeCompleted tradeTo', items.tradeTo)
		info('tradeCompleted gold 2', trade.data.gold)
		info('tradeCompleted tradeFrom', items.tradeFrom)
		if (trade.initiator) {
			warn("Initiating trade as " + my.name)
			var fromGold = my.gold - trade.gold + trade.data.gold
			var toGold = trade.data.goldTotal - trade.data.gold + trade.gold
			info('trade fromGold', fromGold)
			info('trade toGold', toGold)
			chat.log('Trade processing... please wait.')
			socket.publish('name' + trade.data.name, {
				action: 'trade-processing',
			})

			return
			$.post(app.url + 'item/trade-item.php', {
				fromGold: fromGold,
				toGold: toGold,
				toRow: trade.data.row,
			}).done(() => {
				warn('trade done my gold:', fromGold)
				town.setMyGold(fromGold)
				if (trade.data.goldTotal !== toGold) {
					socket.publish('name' + trade.data.name, {
						action: 'trade-update-gold',
						gold: toGold,
					})
				}
				closeTradeWindow()
			}).fail(data => {
				warn('fail', data)
			})
		}
	}
	function rxProcessing() {
		chat.log('Trade processing... please wait.')
	}
	function rxUpdateGold(data) {
		info('trade rxUpdateGold gold set to ', data.gold)
		town.setMyGold(data.gold)
		closeTradeWindow()
	}
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
			goldTotal: my.gold,
			availableSlots: availableInvSlots(),
		});
		trade.timer = delayedCall(toast.expired, tradeExpired, [trade.data.name])
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
	function tradeStart() {
		// 2nd player confirms with Accept toast
		trade.timer.kill()
		if (canTrade()) {
			initTradeActions('You have accepted opening a trade window with ' + toast.data.name, {
				initiator: false,
				confirmed: false,
				gold: 0,
				row: toast.data.row,
				name: toast.data.name,
				race: toast.data.race,
				face: toast.data.face,
				gender: toast.data.gender,
				goldTotal: toast.data.goldTotal,
				availableSlots: toast.data.availableSlots,
			})
			socket.publish('name' + toast.data.name, {
				action: 'trade-start',
				name: my.name,
				race: my.race,
				face: my.face,
				gender: my.gender,
				goldTotal: my.gold,
				availableSlots: availableInvSlots(),
			})
		}
	}
	function tradeStartResp(data) {
		// 1st player receives trade Accept
		trade.timer.kill()
		if (ng.view === 'town') {
			trade.initiator = true
			initTradeActions(data.name + ' accepted opening a trade window with you.', {
				...trade.data,
				initiator: true,
				confirmed: false,
				gold: 0,
				race: data.race,
				face: data.face,
				gender: data.gender,
				goldTotal: data.goldTotal,
				availableSlots: data.availableSlots,
			})
			// must update my goldTotal in case I bought something while waiting...
			updateTrade({
				goldTotal: my.gold
			})
		}
	}
	function totalItems(key) {
		count = 0
		i = 0
		len = items[key].length
		for (; i<len; i++) {
			if (items[key][i].name) count++
		}
		return count
	}
	function isTradeValid() {
		return Boolean(trade.gold || trade.data.gold || totalItems('tradeTo') || totalItems('tradeFrom'))
	}
	function maxGoldSend() {
		return trade.MAX_GOLD - trade.data.goldTotal + trade.data.gold
	}
	function tradeExpired(name) {
		chat.log('Your trade request with ' + name + ' expired.', 'chat-warning')
		trade.data = {}
	}
	function initTradeActions(msg, data) {
		chat.log(msg)
		trade.data = data
		trade.startEq = _.cloneDeep(items.eq)
		trade.startInv = _.cloneDeep(items.inv)
		town.closeVarious()
		openTradeWindow()
	}
	function initTradeData(type) {
		for (i = 0; i<item.MAX_SLOTS[type]; i++) {
			items[type][i] = {}
		}
	}
	function openTradeWindow() {
		initTradeData('tradeTo')
		initTradeData('tradeFrom')
		town.openVariousConfirmed({
			currentTarget: {
				dataset: {
					id: 'Trade'
				}
			}
		})
		console.info('openTradeWindow', trade.data)
	}
	function txCloseTradeWindow(msg) {
		info('trade txCloseTradeWindow', 'name' + trade.data.name)
		socket.publish('name' + trade.data.name, {
			action: 'trade-close-received',
			msg: msg
		})
		closeTradeWindow()
	}
	function rxTradeClosedReceived(data) {
		info('trade tradeClosedReceived')
		msg = data.msg || trade.data.name + ' closed the chat window.'
		if (trade.data.name) {
			chat.log(msg, 'chat-warning')
			closeTradeWindow()
		}
	}
	function closeTradeWindow() {
		trade.data = {}
		town.closeVarious()
		items.inv = items.inv.map(item => {
			delete item.isTrading
			return item;
		})
		bar.updateInventoryDOM()
	}

	function rejectTradeBusy(data) {
		info('rejectTradeBusy', data)
		trade.data = {}
		trade.timer.kill()
		chat.log(data.name + ' is busy right now.')
	}
	function declineTrade(data) {
		info('sendDecline', data)
		trade.timer.kill()
		trade.data = {}
		chat.log(data.name + ' rejected your trade request.')
	}
	function canTrade() {
		return !my.quest.id && ng.view === 'town' && !trade.data.name
	}
	function getTradeAvatar() {
		return _.kebabCase(trade.data.race) +
			'-' + (!trade.data.gender ? 'male' : 'female') +
			'-' + trade.data.face
	}
	function noItem() {
		return '<span class="chat-emote">No Item</span>'
	}
	function getTradeRow(type, slot) {
		return '<div class="trade-row">' +
			bar.getItemSlotHtml(type, slot) +
			'<div id="'+ type +'-name-'+ slot +'" class="trade-item-names">' + noItem() + '</div>'+
		'</div>'
	}
	function getBodyHtml() {
		str =
		'<div id="various-body" class="flex-column flex-max">' +
			// column 1
			'<div class="flex-row flex-max">' +
				'<div id="trade-column-from" class="trade-column">' +
					'<div class="trade-name-wrap">'+
						'<img class="trade-avatars" src="'+ my.avatar +'">' +
						'<div class="trade-names ellipsis">'+ my.name +'</div>' +
					'</div>' +
					'<div class="trade-gold-row">' +
						'<i class="ra ra-gold-bar gold-img"></i>' +
						'<input id="trade-gold" type="number" min="0" max="'+ my.gold +'" value="0">' +
					'</div>' +
					'<div class="trade-item-wrap">'
						for (i=0; i<item.MAX_SLOTS.tradeFrom; i++) {
							str += getTradeRow('tradeFrom', i)
						}
					str += '</div>' +
				'</div>' +
				// column 2
				'<div id="trade-column-to" class="trade-column">' +
					'<div class="trade-name-wrap">' +
						'<img class="trade-avatars" src="images/avatars/'+ getTradeAvatar() +'.png">' +
						'<div class="trade-names ellipsis">'+ trade.data.name +'</div>' +
					'</div>' +
					'<div class="trade-gold-row">' +
						'<i class="ra ra-gold-bar gold-img"></i>' +
						'<div id="trade-gold-from" class="flex-row" style="justify-content: flex-end">0</div>' +
					'</div>' +
					'<div class="trade-item-wrap">'
						for (i=0; i<item.MAX_SLOTS.tradeTo; i++) {
							str += getTradeRow('tradeTo', i)
						}
					str += '</div>' +
				'</div>' +
			'</div>' +
			'<div id="trade-options" class="flex-row flex-center">'+
				'<div id="trade-confirm" class="ng-btn">Confirm</div>' +
				'<div id="trade-cancel" class="ng-btn">Cancel</div>' +
			'</div>' +
		'</div>'
		return str
	}
}($, _, TweenMax);