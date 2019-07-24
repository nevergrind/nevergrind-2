var guild;
(function() {
	guild = {
		hasFocus: 0,
		ranks: [
			'Leader',
			'Officer',
			'Member'
		],
		memberList: [],
		Guild: Guild,
		format: format,
		create: create,
		invite: invite,
		join: join,
		hasJoined: hasJoined,
		quit: quit,
		hasQuit: hasQuit,
		boot: boot,
		wasBooted: wasBooted,
		promote: promote,
		wasPromoted: wasPromoted,
		leader: leader,
		wasLeader: wasLeader,
		updateSession: updateSession,
		motdParse: motdParse,
		motd: motd,
		zmqMotd: zmqMotd,
		getMembers: getMembers,
		setGuildList: setGuildList,
	}
	/////////////////////////////////////////////
	function Guild() {
		return {
			id: 0,
			rank: 0,
			memberNumber: 0,
			motd: '',
			members: 0,
			name: '',
			memberList: []
		}
	}
	function format(s) {
		return s.guild ? (' &lt;' + s.guild + '&gt;') : '';
	}
	function create() {
		if (ng.locked) return;
		var name = $("#guild-input").val().replace(/ +/g, " ").trim();
		console.info("Name: ", name);
		ng.lock();
		$.ajax({
			url: app.url + 'server/guild/create.php',
			data: {
				// replace
				name: name.replace(/ +/g, " ").trim()
			}
		}).done(function(data) {
			console.info('create', data.guild);
			my.guild = data.guild;
			chat.log('Valeska Windcrest says, "By the powers vested in me, I hereby declare you supreme sovereign Leader of a new guild: ' + data.guild.name +'."');
			chat.log('Type /help to view guild commands', 'chat-emote');
			socket.listenGuild();
			// redraw the #aside-menu with new option
			town.aside.update('town-guild');
			guild.getMembers();
		}).fail(function(data){
			console.info(data);
			$("#guild-input").focus();
			ng.msg(data.responseText);
		}).always(function(){
			ng.unlock();
		});
	}
	function invite(name) {
		if (my.name === name) {
			chat.log("You can't invite yourself to a guild. Go to the Guild Hall to create a guild.", "chat-warning");
		}
		else if (!my.guild.id) {
			chat.log("You're not in a guild.", "chat-warning");
		}
		else if (my.guild.rank > 1) {
			chat.log("Only the guild Leader and Officers may send guild invites.", "chat-warning");
		}
		else {
			if (name) {
				chat.log('Sent guild invite to '+ name +'.', 'chat-warning');
				$.ajax({
					url: app.url + 'server/guild/invite.php',
					data: {
						player: name
					}
				}).done(function(r){
					// nothing
				}).fail(function(r){
					chat.log(r.responseText, 'chat-warning');
				});
			}
			else {
				chat.log("Syntax: /invite [player_name]", "chat-warning");
			}
		}
	}
	function join(z) {
		if (my.guild.id) return;
		console.info("JOINING GUILD!", z);
		// clicked CONFIRM
		$.ajax({
			url: app.url + 'server/guild/join.php',
			data: {
				row: z.row,
				guildName: z.guildName
			}
		}).done(function(data){
			my.guild = data.guild;
			chat.log("You have joined the guild: "+ data.guild.name, "chat-warning");
			socket.listenGuild();
		}).fail(function(data){
			console.info("Oh no", data);
			chat.log(data.responseText, 'chat-warning');
		});
	}
	function hasJoined(z) {
		chat.log(z.msg, 'chat-warning');
	}
	function quit() {
		if (!my.guild.id) return;
		console.info("Quitting guild!");
		var o = my.guild;
		$.ajax({
			url: app.url + 'server/guild/quit.php'
		}).done(function(data){
			my.guild = guild.Guild(); // nice!
			console.info("guild.quit() response ", data);
			chat.log("You have quit the guild: "+ o.name, "chat-warning");
			socket.unsubscribe('guild'+ o.id);
		}).fail(function(data){
			chat.log(data.responseText, 'chat-warning');
		});
	}
	function hasQuit(r) {
		chat.log(r.msg, 'chat-warning')
	}
	function boot(name) {
		if (my.guild.rank > 1) {
			chat.log("Only the guild Leader and Officers can boot people from the guild", 'chat-warning');
		}
		else {
			$.ajax({
				url: app.url + 'server/guild/boot.php',
				data: {
					name: name
				}
			}).done(function () {
				// nothing
			}).fail(function (data) {
				chat.log(data.responseText, 'chat-warning');
			});
		}
	}
	function wasBooted(data) {
		if (!my.guild.id) return;
		console.info("Booting! ", data);
		chat.log(data.msg, 'chat-warning');
		if (data.name === my.name) {
			$.ajax({
				url: app.url + 'server/guild/quit.php',
				data: {
					action: 'boot'
				}
			}).done(function(){
				socket.unsubscribe('guild'+ my.guild.id);
				my.guild = guild.Guild(); // nice!
			}).fail(function(data){
				chat.log(data.responseText, 'chat-warning');
			});
		}
	}
	function promote(name) {
		if (my.guild.rank > 1) {
			chat.log("Only the guild Leader and Officers can promote members.", 'chat-warning');
		}
		else {
			$.ajax({
				url: app.url + 'server/guild/promote.php',
				data: {
					name: name
				}
			}).done(function () {
				// nothing
			}).fail(function (data) {
				chat.log(data.responseText, 'chat-warning');
			});
		}
	}
	function wasPromoted(data) {
		if (!my.guild.id) return;
		chat.log(data.msg, 'chat-warning');
		guild.updateSession(data);
	}
	function leader(name) {
		if (my.guild.rank > 0) {
			chat.log("Only the guild Leader can assign a new leader.", 'chat-warning');
		}
		else {
			$.ajax({
				url: app.url + 'server/guild/leader.php',
				data: {
					name: name
				}
			}).done(function (data) {
				console.info('leader: ', data);
				my.guild.rank = 1;
				// nothing
			}).fail(function (data) {
				chat.log(data.responseText, 'chat-warning');
			});
		}
	}
	function wasLeader(data) {
		if (!my.guild.id) return;
		chat.log(data.msg, 'chat-warning');
		guild.updateSession(data);
	}
	function updateSession(data) {
		if (data.name === my.name) {
			$.ajax({
				type: 'GET',
				url: app.url + 'server/guild/update-session.php'
			}).done(function (data) {
				console.info('update-session: ', data);
				my.guild = data.guild;
				// nothing
			}).fail(function (data) {
				chat.log(data.responseText, 'chat-warning');
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
		$.ajax({
			url: app.url + 'server/guild/motd.php',
			data: {
				msg: msg
			}
		}).done(function (data) {
			// nothing
		}).fail(function (data) {
			chat.log(data.responseText, 'chat-warning');
		});
	}
	function zmqMotd(data) {
		chat.log(data.msg, 'chat-guild');
	}
	function getMembers(throttleTime) {
		if (!my.guild.id) return;
		ng.lock(1);
		$.ajax({
			type: 'GET',
			url: app.url + 'server/guild/get-member-list.php'
		}).done(function (data) {
			console.info(data);
			setTimeout(function(){
				guild.setGuildList(data);
			}, throttleTime);
			// nothing
		}).fail(function (data) {
			chat.log(data.responseText, 'chat-warning');
		}).always(function(){
			setTimeout(function(){
				ng.unlock();
			}, throttleTime);
		});
	}
	function setGuildList(data) {
		var s = '';
		guild.memberList = data.memberList;
		guild.memberList.forEach(function(v){
			s += '<div>' + v.level +' '+ v.name +' '+ v.race +' <span class="chat-'+ v.job +'">'+ ng.toJobLong(v.job) +'</span></div>';
		});
		$("#aside-guild-members").html(s);
	}
})();