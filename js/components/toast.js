var toast;
(function() {
	toast = {
		add,
		confirm,
		deny,
	};
	////////////////////////////////////////////////
	function add(data) {
		var s = '',
			e = createElement('div'),
			id = ng.getId();

		console.info('prompt.add', data);
		e.id = data.action +'-'+ data.row;
		e.className = 'prompt-row prompt-row-' + id + ' ' + data.css;
		// write innerHTML
		s +=
			'<div class="chat-prompt-msg stag-blue">'+ data.msg +'</div>' + // col 1
			'<div class="chat-prompt-options stag-blue">'+ // col 2
				'<span data-row="'+ data.row +'" '+
					'data-id="'+ id +'" '+
					'data-action="'+ data.action +'" '+
					'data-c-id="'+ data.row +'" '+
					'data-guild-name="'+ (data.guildName ? data.guildName : "") +'" '+
					'class="chat-prompt-btn chat-prompt-yes">'+
					'<i class="fa fa-check chat-prompt-yes-icon"></i>&thinsp;Confirm'+
				'</span>' +
				'<span data-row="'+ data.row +'" '+
					'data-id="'+ id +'" '+
					'data-name="'+ data.name +'"'+
					'data-action="'+ data.action +'" '+
					'class="chat-prompt-btn chat-prompt-no">'+
					'<i class="fa fa-times chat-prompt-no-icon"></i>&thinsp;Deny'+
				'</span>' +
			'</div>';

		e.innerHTML = s;
		// remove double invites?
		$('#'+ data.action +'-' + data.row).remove();
		chat.dom.chatPrompt.appendChild(e);
		setTimeout(function() {
			$("#" + e.id).remove();
		}, 30000);

		chat.log(data.msg, 'chat-warning');
	}
	function confirm(data) {
		// join party by player id?
		$("#"+ data.action +"-"+ data.row).remove();
		/*
		route: "party-invite"
		id: 2
		row: 188
		 */
		// use data.row to join ng2parties
		// actually add me to the party and ZMQ msg on callback success
		// and call a method to draw the whole party including hp, mp, names etc
		// party table needs extra values... hp, mp, buffs, etc
		console.info('Prompt confirmed: ', data.action, data.row, data);
		if (data.action === 'party-invite') {
			party.inviteReceived(data);
		}
		else if (data.action === 'guild-invite') {
			guild.join(data);
		}
	}
	function deny(data) {
		console.info('deny ', data);
		$("#"+ data.action +"-"+ data.row).remove();
		socket.publish("name"+ data.name, {
			action: data.action + '-deny',
			name: my.name
		});
	}
})();