var guild;
(function($) {
	guild = {
		hasFocus: 0,
		throttleTime: 1,
		ranks: [
			'Leader',
			'Officer',
			'Member'
		],
		memberList: [],
		Guild,
		listen,
		route,
		format,
		create,
		invite,
		inviteAccepted,
		hasJoined,
		disband,
		hasDisbanded,
		boot,
		wasBooted,
		promote,
		wasPromoted,
		demote,
		demoteReceived,
		leader,
		wasLeader,
		motdParse,
		motd,
		zmqMotd,
		loadGuildMsg,
		getMembers,
		setGuildList,
		setGuildData,
	}
	var html
	/////////////////////////////////////////////
	function listen() {
		// subscribe to test guild for now
		// console.info('my.guild', my.guild);
		if (my.guild.id) {
			my.guild.motd && chat.log('Guild Message of the day: ' + my.guild.motd, 'chat-guild');
			socket.subscribe('guild' + my.guild.id, guild.route);
		}
	}
	function route(data, obj) {
		data = router.normalizeInput(data, obj);
		if (!my.guild.name) return;
		// console.info('rx ', data);
		if (data.route === 'chat->log') {
			router.toTown(data, data.route);
		}
		else {
			router.toGuild(data, data.route);
		}
	}
	function Guild() {
		return {
			id: 0,
			rank: 0,
			motd: '',
			name: ''
		}
	}
	function format(guild) {
		return guild ? (' &lt;' + guild + '&gt;') : '';
	}
	function create() {
		// console.info('guild create')
		if (ng.locked) return;
		var name = $("#guild-input").val().replace(/ +/g, " ").trim();
		// console.info("Name: ", name);
		ng.lock();
		$.post(app.url + 'guild/create.php', {
			// replace
			name: name.replace(/ +/g, " ").trim()
		}).done(function(data) {
			// console.info('create', data.guild);
			guild.setGuildData(data);
			chat.log('Valeska says, "By the powers vested in me, I hereby declare you supreme sovereign leader of a new guild: ' + data.guild.name +'."');
			ng.msg('You created a new guild: ' + data.guild.name, 5)
			chat.log('Type /help to view guild commands', CSS.CHAT_WARNING);
			guild.listen();
			// redraw the #various-wrap with new option
			town.updateVariousDOM();
			guild.getMembers();
		}).fail(function(data){
			// console.info(data);
			$("#guild-input").focus();
			ng.msg(data.responseText);
		}).always(function(){
			ng.unlock();
		});
	}
	function invite(name) {
		if (my.name === name) {
			chat.log("You can't invite yourself to a guild. Go to the Guild Hall to create a guild.", CSS.CHAT_WARNING);
		}
		else if (!my.guild.id) {
			chat.log("You're not in a guild.", CSS.CHAT_WARNING);
		}
		else if (my.guild.rank > 1) {
			chat.log("Only the guild leader or officers may send guild invites.", CSS.CHAT_WARNING);
		}
		else {
			if (name) {
				chat.log('Sent guild invite to '+ name +'.', CSS.CHAT_WARNING);
				socket.publish('name' + name, {
					row: my.guild.id,
					msg: my.name + ' has invited you to join the guild: ' + my.guild.name.split(' ').join('&nbsp;'),
					name: my.name,
					guildName: my.guild.name,
					action: 'guild-invite',
				})
			}
			else {
				chat.log("Syntax: /invite [player_name]", CSS.CHAT_WARNING)
			}
		}
	}
	function inviteAccepted(z) {
		if (my.guild.id) return
		// clicked CONFIRM
		$.post(app.url + 'guild/invite-accepted.php', {
			guildName: z.guildName,
			guildId: z.row
		}).done(function(data){
			guild.setGuildData(data);
			chat.log('You have joined the guild: '+ data.guild.name, CSS.CHAT_WARNING)
			delayedCall(.5, guild.listen)
		}).fail(function(data){
			chat.log(data.responseText, CSS.CHAT_WARNING)
		});
	}
	function hasJoined(z) {
		chat.log(z.msg, CSS.CHAT_WARNING);
	}
	function disband() {
		if (!my.guild.id) return;
		// console.info("Quitting guild!");
		var o = my.guild;
		$.get(app.url + 'guild/disband.php').done(function(data){
			my.guild = guild.Guild(); // nice!
			// console.info("guild.disband() response ", data);
			chat.log("You have disbanded the guild: "+ o.name, CSS.CHAT_WARNING);
			socket.unsubscribe('guild'+ o.id);
		}).fail(function(data){
			chat.log(data.responseText, CSS.CHAT_WARNING);
		});
	}
	function hasDisbanded(r) {
		chat.log(r.msg, CSS.CHAT_WARNING)
	}
	function boot(name) {
		if (my.guild.rank > 1) {
			chat.log("Only the guild leader or officers can boot people from the guild", CSS.CHAT_WARNING);
		}
		else {
			$.post(app.url + 'guild/boot.php', {
				name: _.capitalize(name)
			}).fail(function (data) {
				chat.log(data.responseText, CSS.CHAT_WARNING);
			});
		}
	}
	function wasBooted(data) {
		if (!my.guild.id) return;
		// console.info("Booting! ", data);
		chat.log(data.msg, CSS.CHAT_WARNING);
		if (data.name === my.name) {
			$.post(app.url + 'guild/disband.php', {
				action: 'boot'
			}).done(function(){
				socket.unsubscribe('guild'+ my.guild.id);
				my.guild = guild.Guild(); // nice!
			}).fail(function(data){
				chat.log(data.responseText, CSS.CHAT_WARNING);
			});
		}
	}
	function promote(name) {
		if (my.guild.rank > 1) {
			chat.log("Only the guild leader or officers can promote members.", CSS.CHAT_WARNING);
		}
		else {
			$.post(app.url + 'guild/promote.php', {
				name: _.capitalize(name)
			}).fail(function (data) {
				chat.log(data.responseText, CSS.CHAT_WARNING);
			});
		}
	}
	function wasPromoted(data) {
		if (!my.guild.id) return;
		chat.log(data.msg, CSS.CHAT_WARNING);
		updateSession(data);
	}
	function demote(name) {
		if (my.guild.rank > 0) {
			chat.log("Only the guild leader can demote members.", CSS.CHAT_WARNING);
		}
		else {
			$.post(app.url + 'guild/demote.php', {
				name: _.capitalize(name)
			}).fail(data => {
				chat.log(data.responseText, CSS.CHAT_WARNING);
			});
		}
	}
	function demoteReceived(data) {
		chat.log(data.msg, CSS.CHAT_WARNING);
		updateSession(data);
	}
	function leader(name) {
		if (my.guild.rank > 0) {
			chat.log("Only the guild leader can assign a new leader.", CSS.CHAT_WARNING);
		}
		if (my.name === name) {
			chat.log("You're already the guild leader!", CSS.CHAT_WARNING);
		}
		else {
			$.post(app.url + 'guild/leader.php', {
				name: _.capitalize(name)
			}).done(function (data) {
				// console.info('leader: ', data);
				my.guild.rank = 1;
				updateSession(data, true);
				// nothing
			}).fail(function (data) {
				chat.log(data.responseText, CSS.CHAT_WARNING);
			});
		}
	}
	function wasLeader(data) {
		chat.log(data.msg, CSS.CHAT_WARNING);
		updateSession(data);
	}
	function updateSession(data, bypass) {
		if (data.name === my.name || bypass) {
			$.get(app.url + 'guild/update-session.php').done(function (data) {
				// console.info('update-session: ', data);
				guild.setGuildData(data);
				// nothing
			}).fail(function (data) {
				chat.log(data.responseText, CSS.CHAT_WARNING);
			});
		}
	}
	function motdParse(msg) {
		var a = msg.replace(/ +/g, " ").split(" ");
		a.shift();
		return a.join(" ");
	}
	function motd(msg) {
		if (my.guild.rank > 1) return;
		$.post(app.url + 'guild/motd.php', {
			msg: msg
		}).fail(function (data) {
			chat.log(data.responseText, CSS.CHAT_WARNING);
		});
	}
	function zmqMotd(data) {
		my.guild.motd = data.msg;
		chat.log(data.prefix + data.msg, 'chat-guild');
	}
	function loadGuildMsg() {
		$("#aside-guild-members").html(ng.loadMsg);
		var arr = ['Loading'];
		for (var i=1; i<4; i++) {
			(function(i) {
				delayedCall(.25 * i, () => {
					arr.push('.');
					getElementById('load-msg').textContent = arr.join('');
				});
			})(i);
		}
	}
	function getMembers(throttleTime) {
		if (!my.guild.id) return;
		throttleTime = throttleTime || 0
		ng.lock(1)
		$.get(app.url + 'guild/get-member-list.php').done(data => {
			// console.info(data);
			delayedCall(throttleTime, () => {
				setGuildList(data)
			});
			// nothing
		}).fail(data => {
			chat.log(data.responseText, CSS.CHAT_WARNING);
		}).always(() => {
			delayedCall(throttleTime, ng.unlock);
		});
	}
	function setGuildList(data) {
		html = ''
		guild.memberList = data.memberList;
		html += '<tbody>';
		guild.memberList.forEach(getGuildRow);
		html += '</tbody>'
		$("#aside-guild-members").html(html)
		getElementById('guild-member-count').textContent = guild.memberList.length
	}
	function getGuildRow(v) {
		html += '<tr class="guild-member-row">' +
			'<td>' + getGuildStar(v.rank) + '</td>' +
			'<td>' + v.level + '</td>' +
			'<td style="width: 40%">' + v.name + '</td>' +
			'<td style="width: 20%">' + v.race + '</td>' +
			'<td class="chat-'+ v.job +'">' + ng.toJobLong(v.job) + '</td>' +
		'</tr>'
	}
	function getGuildStar(rank) {
		return rank === 0 ?
			'<i class="ra ra-crown guild-leader"></i>' :
			'<i class="ra ra-castle-flag guild-leader"></i>'
	}
	function setGuildData(data) {
		my.guild = data.guild;
		// console.warn('setGuildData', data);
	}

})($);