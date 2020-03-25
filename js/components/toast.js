var toast;
(function(TweenMax) {
	toast = {
		data: {},
		getToastHtml: getToastHtml,
		timer: new TweenMax.delayedCall(0, ''),
		expired: 15,
		add,
		accept,
		decline,
		acceptDestroy,
		declineDestroy,
		destroyItem,
		hideDestroyToast,
	}
	var destroyData = {}
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
			el.innerHTML = getToastHtml(data)
			querySelector('#toast-window').appendChild(el)
			toast.data = data
			toast.timer = TweenMax.delayedCall(toast.expired, removeToast)
		}
	}

	/**
	 * Generate html for the toast based on data provided
	 * @param data
	 */
	function getToastHtml(data) {
		console.info('data', data);
		return '<div id="toast-msg">' + data.msg + '</div>' +
			'<div id="toast-btn-row">' +
				'<div id="'+ (data.accept === 'destroy-item' ? 'toast-accept-destroy' : 'toast-accept') +'" class="toast-btn">Accept</div>' +
				'<div id="'+ (data.accept === 'destroy-item' ? 'toast-decline-destroy' : 'toast-decline') +'" class="toast-btn">Decline</div>' +
			'</div>'
	}
	function removeToast() {
		toast.timer.kill()
		toast.data = {}
		var el = getById('toast-wrap')
		el !== null && querySelector('#toast-window').removeChild(el)
	}
	function accept() {
		// join party by player id?
		console.info('accept: ', toast.data)
		if (toast.data.action === 'party-invite') party.inviteAccepted(toast.data)
		else if (toast.data.action === 'guild-invite') guild.inviteAccepted(toast.data)
		removeToast()
	}
	function decline() {
		console.info('decline: ', toast.data)
		socket.publish('name' + toast.data.name, {
			name: my.name,
			action: toast.data.action + '-decline',
		})
		removeToast()
	}
	function acceptDestroy() {
		if (destroyData.accept === 'destroy-item') {
			item.destroy()
			hideDestroyToast()
		}
	}
	function declineDestroy() {
		if (destroyData.accept === 'destroy-item') hideDestroyToast()
	}
	function destroyItem(data) {
		destroyData = data
		querySelector('#toast-destroy-wrap').innerHTML = getToastHtml(data)
		querySelector('#toast-destroy-wrap').style.visibility = 'visible'
	}
	function hideDestroyToast() {
		console.info('hideDestroyToast')
		destroyData = {}
		querySelector('#toast-destroy-wrap').innerHTML = ''
		querySelector('#toast-destroy-wrap').style.visibility = 'hidden'
	}
})(TweenMax);