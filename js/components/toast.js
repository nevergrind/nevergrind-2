var toast;
(function() {
	toast = {
		data: {},
		getHtml: getHtml,
		timer: 0,
		expired: 1500000000,
		add,
		accept,
		decline,
	}
	var data = {}
	////////////////////////////////////////////////
	function add(data) {
		if (toast.data.action) {
			socket.publish('name' + data.name, {
				name: my.name,
				action: 'toast-busy',
			})
		}
		else {
			console.clear()
			console.info('prompt.add', data)
			var el = createElement('div')
			el.id = 'toast-wrap'
			el.className = 'stag-blue text-shadow no-select'
			el.innerHTML = getHtml(data)
			dom.body.appendChild(el)
			toast.data = data
			toast.timer = setTimeout(removeToast, toast.expired)
		}
	}

	/**
	 * Generate html for the toast based on data provided
	 * @param data
	 */
	function getHtml(data) {
		console.info('data', data);
		return '<div id="toast-msg">' + data.msg + '</div>' +
			'<div id="toast-btn-row">' +
				'<div id="toast-accept" class="toast-btn">Accept</div>' +
				'<div id="toast-decline" class="toast-btn">Decline</div>' +
			'</div>'
	}
	function removeToast() {
		clearTimeout(toast.timer)
		var el = getById('toast-wrap')
		el !== null && dom.body.removeChild(el)
		toast.data = {}
	}
	function accept() {
		// join party by player id?
		data = toast.data
		console.info('accept: ', data)
		if (data.action === 'party-invite') {
			party.inviteAccepted(data)
		}
		else if (toast.data.action === 'guild-invite') {
			guild.inviteAccepted(data)
		}
		removeToast()
	}
	function decline() {
		data = toast.data
		console.info('decline: ', data)
		socket.publish('name' + data.name, {
			name: my.name,
			action: data.action + '-decline',
		})
		removeToast()
	}
})();