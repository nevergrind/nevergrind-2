var toast;
(function(TweenMax) {
	toast = {
		data: {},
		timer: new delayedCall(0, ''),
		expired: 15,
		add,
		accept,
		destroyItem,
		removeToast,
		hideDestroyToast,
	}
	var destroyData = {}
	var el

	// events
	$('#toast-window')
		.on('click', '#toast-accept', accept)
		.on('click', '#toast-decline', decline)
		.on('click', '#toast-accept-destroy', acceptDestroy)
		.on('click', '#toast-decline-destroy', declineDestroy)
	////////////////////////////////////////////////
	function add(data) {
		if (toast.data.action) {
			socket.publish('name' + data.name, {
				name: my.name,
				action: 'toast-busy',
			})
		}
		else {
			// received toast request - display toast & start timer
			// console.info('prompt.add', data)
			var el = createElement('div')
			el.id = 'toast-wrap'
			el.className = 'stag-blue text-shadow no-select'
			el.innerHTML = getToastHtml(data)
			querySelector('#toast-window').appendChild(el)
			toast.data = data
			toast.timer = delayedCall(toast.expired, removeToast)
			if (data.action === 'trade-request') {
				trade.timer = delayedCall(toast.expired, trade.tradeExpired, [ data.name ])
				if (Config.autoAcceptPartyInvites) {
					// console.info('toast data', _.cloneDeep(toast.data))
					setTimeout(toast.accept, 100)
				}
			}
			else if (data.action === 'party-invite') {
				if (Config.autoAcceptPartyInvites) {
					// auto accept party invites for testing
					setTimeout(toast.accept, 100)
				}
			}
		}
	}

	/**
	 * Generate html for the toast based on data provided
	 * @param data
	 */
	function getToastHtml(data) {
		return '<div id="toast-msg">' + data.msg + '</div>' +
			'<div id="toast-btn-row">' +
				'<div id="'+ (data.accept === 'destroy-item' ? 'toast-accept-destroy' : 'toast-accept') +'" class="toast-btn">Accept</div>' +
				'<div id="'+ (data.accept === 'destroy-item' ? 'toast-decline-destroy' : 'toast-decline') +'" class="toast-btn">Decline</div>' +
			'</div>'
	}
	function removeToast() {
		toast.timer.kill()
		toast.data = {}
		var el = getElementById('toast-wrap')
		el !== null && querySelector('#toast-window').removeChild(el)
	}
	function accept() {
		// join party by player id?
		// console.info('accept: ', toast.data)

		if (toast.data.action === 'trade-request') {
			// 2nd player confirms
			trade.tradeStart()
			removeToast()
		}
		else {
			if (toast.data.action === 'party-invite') party.inviteAccepted(toast.data)
			else if (toast.data.action === 'guild-invite') guild.inviteAccepted(toast.data)
			removeToast()
		}
		audio.playSound('click-7')
	}
	function decline() {
		// console.info('decline: ', toast.data)
		chat.log('You declined ' + toast.data.name + '\'s request.')
		trade.data = {}
		trade.timer.kill()
		socket.publish('name' + toast.data.name, {
			name: my.name,
			action: toast.data.action + '-decline',
		})
		removeToast()
		audio.playSound('beep-3')
	}
	function acceptDestroy() {
		if (destroyData.accept === 'destroy-item') {
			item.destroy()
			hideDestroyToast()
			audio.playSound('click-5')
		}
	}
	function declineDestroy() {
		if (destroyData.accept === 'destroy-item') {
			audio.playSound('beep-3')
			hideDestroyToast()
		}
	}
	function destroyItem(data) {
		// console.info('destroyItem', destroyData)
		if (!destroyData.msg) {
			el = createElement('div')
			el.id = 'toast-destroy-wrap'
			el.className = 'stag-blue text-shadow no-select'
			el.innerHTML = getToastHtml(data)
			querySelector('#toast-window').appendChild(el)
		}
		destroyData = data
	}

	/**
	 * Great function for getting rid of the stupid toast without breaking shit
	 */
	function hideDestroyToast() {
		if (destroyData.msg) {
			el = querySelector('#toast-destroy-wrap')
			el.parentNode.removeChild(el)
		}
		destroyData = {}
	}
})(TweenMax);