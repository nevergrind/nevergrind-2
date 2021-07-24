var broadcast;
(function() {
	broadcast = {
		route
	}
	//////////////////////////////////////
	function route(data, obj) {
		data = router.normalizeInput(data, obj)
		if (data.route === 'chat->log') {
			if (my.accountId === 136 || location.href.includes('localhost/ng2')) {
				if (data.class === 'chat-broadcast') {
					chat.log('SYSTEM BROADCAST: ' + data.msg, data.class)
				}
				else if (data.class === 'chat-camp') {
					chat.log('SYSTEM BROADCAST: Server is going down for maintenance. Camp and close Nevergrind Online to ensure that no data is lost.', 'chat-broadcast')
					setTimeout(() => {
						bar.appReset()
					}, 15000)
				}
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