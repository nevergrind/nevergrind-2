var broadcast;
(function() {
	broadcast = {
		route
	}
	//////////////////////////////////////
	function route(data, obj) {
		data = router.normalizeInput(data, obj)
		if (data.route === 'chat->log') {
			if (my.accountId === 136) {
				chat.log('SYSTEM BROADCAST: ' + data.msg, data.class)
			}
		}
		else if (data.route === 'all->who') {
			who.allRequest(data)
		}
		else if (data.route === 'all->byFilter') {
			who.byFilterRequest(data)
		}
	}
})()