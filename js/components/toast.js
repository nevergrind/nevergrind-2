var toast;
(function() {
	toast = {
		data: {},
		getHtml: getHtml,
		timer: new delayedCall(0, ''),
		expired: 15,
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
			console.info('prompt.add', data)
			var el = createElement('div')
			el.id = 'toast-wrap'
			el.className = 'stag-blue text-shadow no-select'
			el.innerHTML = getHtml(data)
			dom.body.appendChild(el)
			toast.data = data
			toast.timer = delayedCall(toast.expired, removeToast)
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
		toast.timer.kill()
		toast.data = {}
		var el = getById('toast-wrap')
		el !== null && dom.body.removeChild(el)
	}
	function accept() {
		// join party by player id?
		data = toast.data
		console.info('accept: ', data)
		if (data.action === 'party-invite') party.inviteAccepted(data)
		else if (toast.data.action === 'guild-invite') guild.inviteAccepted(data)
		else if (toast.data.action === 'destroy-item') item.destroy()
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