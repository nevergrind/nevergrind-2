var friend;
(function(_, $) {
	friend = {
		listThrottled: false,
		listThrottleExpire: 15,
		listId: 0,
		parse,
		init,
		list,
		listReceived,
		presenceReceived,
		add,
		remove,
		notify,
	}
	let countedSelf = 0
	//////////////////////////////////////////
	function parse(o) {
		// returns lower case friend name
		return _.capitalize(
			o.replace(/ +/g, " ")
			.split(" ")[2]
			.trim()
		)
	}
	function init() {
		ng.friends = ng.friends || [];
		$.get(Config.url + 'chat/friend-get.php').done(data => {
			ng.friends = _.map(data, _.capitalize);
		});
	}
	function list() {
		if (friend.listThrottled) {
			chat.log('Your friend list command is still recharging!', CHAT.WARNING)
			return
		}
		chat.log('<div class="chat-warning">Checking friends list...</div>')
		if (ng.friends.length){
			friend.listThrottled = true;
			friend.listId++;
			delayedCall(friend.listThrottleExpire, () => {
				friend.listThrottled = false;
			});

			// request response from friends
			ng.friends.forEach(name => {
				socket.publish('name' + name, {
					name: my.name,
					action: 'friend->getPresence',
				})
			})

			var str = chat.divider +
				'<div>Friend List ('+ ng.friends.length +')</div>'

			ng.friends.forEach((name) => {
				str += '<div id="friend-list-' + friend.listId + '-' + name + '" class="chat-emote">[Offline] ' + name +'</div>';
			})
			chat.log(str)
		}
		else {
			chat.log("<div>You don't have any friends!</div>", CHAT.WARNING);
			chat.log("<div class='chat-emote'>Use /friend add [name] to add a new friend.</div>", CHAT.WARNING);
		}
	}
	function listReceived(data) {
		// console.warn('listReceived', data);
		socket.publish('name' + data.name, {
			name: my.name,
			level: my.level,
			race: my.race,
			job: my.job,
			guild: my.guild.name,
			action: 'friend->sendPresence',
		})
	}
	function presenceReceived(data) {
		// console.warn('presenceReceived', data);
		var el = getElementById('friend-list-' + friend.listId + '-' + data.name);
		el.className = 'chat-whisper'
		el.innerHTML = '[' +
			data.level +' '+ ng.jobLong[data.job] +'] '+ data.name + ' ('+ data.race +
			')' + guild.format(data.guild)
	}
	function add(name) {
		// console.info(name, my.name)
		if (ng.friends.includes(name)) {
			chat.log(o + " is already your friend.", CHAT.WARNING);
		}
		else if (name === my.name) {
			chat.log("You can't be your own friend!", CHAT.WARNING);
		}
		else if (name.length < 2) {
			chat.log("Names must be at least two characters long.", CHAT.WARNING);
		}
		else {
			$.post(Config.url + 'chat/friend-add.php', {
				friend: name
			}).done(function(data){
				if (data.error) {
					chat.log(data.error, CHAT.WARNING);
				}
				else {
					chat.log('You have added ' + name + ' to your friend list.', CHAT.WARNING);
					socket.subscribe('friend' + name, friend.notify);
					socket.publish('name' + name, {
						name: my.name,
						gender: my.gender,
						action: "friend>addedMe"
					});
					ng.friends.push(name);
				}
			});
		}
	}
	function remove(name) {
		if (name.length > 1 &&
			name !== my.name &&
			ng.friends.includes(name)) {
			$.post(Config.url + 'chat/friend-remove.php', {
				friend: name
			}).done(data => {
				if (data.error) {
					chat.log(data.error, CHAT.WARNING);
				}
				else {
					chat.log('You have removed ' + name + ' from your friend list.', CHAT.WARNING);
					while (ng.friends.includes(name)) {
						var index = ng.friends.indexOf(name);
						ng.friends.splice(index, 1);
					}
					socket.unsubscribe('friend' + name);
				}
			});
		}
	}
	function notify(data, obj) {
		data = router.normalizeInput(data, obj)
		if (data.route === 'on') {
			if (data.name === my.name) {
				countedSelf++
				if (countedSelf > 1) {
					// boot self
					bar.appReset()
				}
			}
			else {
				chat.log(data.name + ' has come online.', CHAT.WARNING)
			}
		}
		else {
			if (data.name !== my.name) {
				chat.log(data.name + ' has gone offline.', CHAT.WARNING)
			}
		}
	}
})(_, $);