var town;
(function() {
	town = {
		initialized: 0,
		lastAside: {},
		delegated: 0,
		aside: {
			selected: '',
			html: {
				close: '<i class="close-aside fa fa-times text-danger"></i>',
				sleeve: '<div class="stag-blue sleeve"></div>',
				townMerchant: htmlTownMerchant,
				townTrainer: htmlTownTrainer,
				townGuild: htmlTownGuild,
				townMission: htmlTownMission,
			},
			menu: {
				townMerchant: menuTownTrainer,
				townTrainer: menuTownMerchant,
				townGuild: menuTownGuild,
				townMission: menuTownMission,
			},
			init: asideInit,
		},
		data: {
		'town-merchant': {
			msg: merchantMsg,
			bg: {
				// don't exceed 25-75 range
				x: '-75%',
				y: '-60%',
			},
			aside: {
				x: 112,
				y: 30
			}
		},
		'town-trainer': {
			msg: trainerMsg,
			bg: {
				x: '-75%',
				y: '-25%',
			},
			aside: {
				x: 112,
				y: -10
			}
		},
		'town-guild': {
			msg: guildMsg,
			bg: {
				x: '-25%',
				y: '-25%',
			},
			aside: {
				x: -30,
				y: -30
			}
		},
		'town-mission': {
			msg: missionMsg,
			bg: {
				x: '-67%',
				y: '-60%',
			},
			aside: {
				x: 75,
				y: 24
			}
		}
	},
		go,
		html,
		update,
		events,
		init,
		preload,
	}
	////////////////////////////////////////////
	function go() {
		if (ng.view === 'town') return;
		if (create.selected) {
			game.emptyScenesExcept('scene-town');
			ng.lock(1);
			chat.sizeLarge();
			$.post(app.url + 'character/load-character.php', {
				row: create.selected
			}).done(function(data) {
				console.info('load-character: ', data);
				var z = data.characterData;
				my.name = z.name;
				my.job = z.job;
				my.race = z.race;
				my.level = z.level;
				my.row = z.row;
				my.party[0] = z;
				my.party[0].isLeader = 0;
				my.resetClientPartyValues(0);
				my.guild = data.guild;
				if (data.quest.level) {
					// quest still active
					mission.setQuest(data.quest);
					my.zoneMobs = data.zoneMobs;
				}

				// init party member values
				for (var i=1; i<game.maxPlayers; i++) {
					my.party[i] = my.Party();
				}
				console.info('my.party[0]: ', my.party[0]);
				ng.setScene('town');
				chat.init();
				socket.init();
				friend.init();
				ignore.init();
				// things that only happen once
				chat.log("There are currently " + data.count + " players exploring Vandamor.", 'chat-emote');
				// init town ?
				getById('scene-town').innerHTML = town.html();
				town.events();
				$("#scene-title").remove();
				town.init();
				bar.init();
				// I'm in a party!
				if (data.party !== undefined && data.party.id) {
					// reload entire party state
					data.party.id *= 1;
					my.p_id = data.party.id;
				}
				// await socket connect
				(function repeat() {
					if (socket.enabled) {
						// stuff to do after the socket wakes up
						socket.listenParty(my.p_id);
						bar.getParty();
						chat.sendMsg('/join');
						// town
						TweenMax.to('#scene-town', .5, {
							delay: .5,
							opacity: 1,
							onComplete: ng.unlock
						});
						bar.setAjaxPing();
					}
					else {
						setTimeout(repeat, 100);
					}
				})();

				// route to battle in local mode
				if (!app.isApp) {
					if (data.quest.level) {
						if (location.hash === '#battle') {
							battle.go();
						}
						else if (location.hash === '#dungeon') {
							dungeon.go();
						}
					}
				}
				ng.unlock();
			}).fail(function(data){
				ng.disconnect(data.responseText);
			});
		}
	}
	function html() {
		var s =
			'<img id="town-bg" class="img-bg" src="images/town2.jpg">'+
			'<div id="town-menu" class="text-shadow">'+
				'<div id="town-merchant" class="ng-btn town-action">Merchant</div>' +
				'<div id="town-trainer" class="ng-btn town-action">Skill Trainer</div>' +
				'<div id="town-guild" class="ng-btn town-action">Guild Hall</div>' +
			'</div>' +
			'<div id="town-footer" class="text-shadow2">' +
				'<hr id="town-footer-hr1" class="footer-hr">' +
				'<div id="town-footer-flex">' +
					'<span id="town-mission" class="ng-btn town-action center">Mission Counter</span>' +
				'</div>' +
				'<hr id="town-footer-hr2"  class="footer-hr">' +
			'</div>';

		return s;
	}
	function htmlTownMerchant() {
		var s =
		'<img class="aside-bg" src="images/town/halas.jpg">' +
		'<img class="aside-npc" src="images/town/rendo-surefoot.png">' +
		'<div class="aside-text">' +
			'<div class="aside-title-wrap stag-blue">' +
				'<div class="aside-title">Merchant</div>' +
				town.aside.html.close +
			'</div>' +
		'</div>';
		return s;
	}
	function htmlTownTrainer() {
		var s =
		'<img class="aside-bg" src="images/town/surefall.jpg">' +
		'<img class="aside-npc" src="images/town/arwen-reinhardt.png">' +
		'<div class="aside-text">' +
			'<div class="aside-title-wrap stag-blue">' +
				'<div class="aside-title">Skill Trainer</div>' +
				town.aside.html.close +
			'</div>' +
		'</div>';
		return s;
	}
	function htmlTownGuild() {
		var s =
		'<img class="aside-bg" src="images/town/poh.jpg">' +
		'<img class="aside-npc" src="images/town/valeska-windcrest.png">' +
		'<div class="aside-text">' +
			'<div class="aside-title-wrap stag-blue">' +
				'<div class="aside-title">Guild Hall</div>' +
				town.aside.html.close +
			'</div>' +
			'<div id="aside-menu">' +
				town.aside.menu.townGuild() +
			'</div>' +
		'</div>';
		return s;
	}
	function htmlTownMission() {
		var s =
		'<img class="aside-bg" src="images/town/neriak.jpg">' +
		'<img class="aside-npc" src="images/town/miranda-crossheart.png">' +
		'<div class="aside-text">' +
			'<div class="aside-title-wrap stag-blue">' +
				'<div class="aside-title">Mission Counter</div>' +
				town.aside.html.close +
			'</div>' +
			'<div id="aside-menu">' +
				town.aside.menu.townMission() +
			'</div>' +
		'</div>';
		return s;
	}
	function menuTownTrainer() {
		var s = '';
		return s;
	}
	function menuTownMerchant() {
		var s = '';
		return s;
	}
	function menuTownGuild() {
		var s = '';
		if (my.guild.name) {
			s +=
				'<div class="aside-frame">' +
					'<div>Guild: '+ my.guild.name +'</div> ' +
					'<div>Title: '+ guild.ranks[my.guild.rank] +'</div> ' +
					'<div>Total Members: '+ my.guild.members +'</div> ' +
					'<div>Member Number: '+ my.guild.memberNumber +'</div> ' +
				'</div>' +
				'<div id="guild-member-wrap" class="aside-frame">' +
					'<div id="guild-member-flex">'+
						'<div id="guild-member-label">Guild Members:</div>'+
						'<div id="guild-member-refresh-icon"><i class="fa fa-refresh refresh"></i></div>'+
					'</div>'+
					'<div id="aside-guild-members"></div>'+
				'</div>';

				s += '</div>';
		}
		else {
			s +=
			'<input id="guild-input" class="text-shadow" type="text" maxlength="30" autocomplete="off" spellcheck="false">' +
			'<div id="guild-create" class="ng-btn">Create Guild</div> ' +
			'<div class="aside-frame">Only letters A through Z and apostrophes are accepted in guild names. Standarized capitalization will be automatically applied. The guild name must be between 4 and 30 characters. All guild names are subject to the royal statutes regarding common decency in Vandamor.</div>';
		}
		return s;
	}
	function menuTownMission() {
		var s = mission.asideHtmlHead();
		if (mission.loaded) {
			// subsequent loads
			s +=
			'<div id="mission-counter" class="aside-frame text-shadow">';
				s += mission.asideHtml();
			s += '</div>';
			setTimeout(function() {
				mission.openFirstTwoZones();
			}, 100);
		}
		else {
			// first load
			s +=
				'<div id="mission-counter" class="aside-frame">' +
					ng.loadMsg +
				'</div>';
			mission.init();
		}
		if (my.quest.level) {
			s += mission.asideFooter();
		}
		return s;
	}
	function asideInit(id) {
		if (id === town.aside.selected) return;
		// remove old aside
		var z = $(".town-aside");
		TweenMax.to(z, .2, {
			scale: 0,
			x: town.lastAside.x + '%',
			y: town.lastAside.y + '%',
			onComplete: function(){
				z.remove();
			}
		});
		town.lastAside = town.data[id].aside;
		// animate town BG
		TweenMax.to('#town-bg', 1.25, {
			scale: 1.5,
			x: town.data[id].bg.x,
			y: town.data[id].bg.y
		});
		if (id === 'town-mission') {
			mission.resetMissionLists();
		}
		// create aside
		var e = createElement('div');
		e.className = 'town-aside text-shadow';
		// set aside HTML
		var type = _.camelCase(id);
		var html;
		if (type === 'townTrainer') {
			html = town.aside.html.townTrainer(id);
		}
		else if (type === 'townMerchant') {
			html = town.aside.html.townMerchant(id);
		}
		else if (type === 'townGuild') {
			html = town.aside.html.townGuild(id);
		}
		else if (type === 'townMission') {
			html = town.aside.html.townMission(id);
		}
		e.innerHTML = html;
		getById('scene-town').appendChild(e);
		// animate aside things
		setTimeout(function() {
			TweenMax.set('.now-loading', {
				alpha: 0
			});
			TweenMax.to(e, .5, {
				startAt: {
					display: 'block',
					alpha: 1,
					scale: 0,
					x: town.data[id].aside.x + '%',
					y: town.data[id].aside.y + '%'
				},
				x: '2%',
				y: '2%',
				scale: 1,
				onComplete: function() {
					TweenMax.to('.now-loading', .3, {
						alpha: 1
					});
				}
			});
			setTimeout(function () {
				TweenMax.to('.aside-bg', 1, {
					startAt: {
						left: '60%'
					},
					left: '50%'
				}, 100);
			});
			TweenMax.to('.aside-npc', 1, {
				left: '-5%'
			});
			setTimeout(function() {
				$(".town-aside:last-child").find("input").focus();
				town.data[id].msg();
			}, 100);
		}, town.aside.selected ? 0 : 500);
		// set aside id
		town.aside.selected = id;
		// AJAX calls if necessary
		if (id === 'town-guild'){
			if (guild.memberList.length) {
				guild.setGuildList(guild);
			}
			else {
				$("#aside-guild-members").html('Loading...');
				guild.getMembers(0);
			}
		}
	}
	function update(id) {
		var type = _.camelCase(id);
		var html;
		if (type === 'townTrainer') {
			html = town.aside.menu.townTrainer();
		}
		else if (type === 'townMerchant') {
			html = town.aside.menu.townMerchant();
		}
		else if (type === 'townGuild') {
			html = town.aside.menu.townGuild();
		}
		else if (type === 'townMission') {
			html = town.aside.menu.townMission();
		}
		$("#aside-menu").html(html);
	}
	function events() {
		if (!town.delegated) {
			town.delegated = 1;
			$("#scene-town").on('click', '.close-aside', function(){
				// close town asides
				town.aside.selected = '';
				var e = $(".town-aside");
				TweenMax.to(e, .3, {
					scale: 0,
					onComplete: function(){
						e.remove();
					}
				});
				TweenMax.to('#town-bg', .5, {
					scale: 1,
					x: '-50%',
					y: '-50%'
				});
			}).on('click', '#guild-create', function(){
				// create a guild
				guild.create();
			}).on('click' + ' focus', '#guild-input', function() {
				guild.hasFocus = 1;
			}).on('blur', '#guild-input', function() {
				guild.hasFocus = 0;
			}).on('click', '#guild-member-refresh-icon', function() {
				$("#aside-guild-members").html(ng.loadMsg);
				guild.getMembers(1500);
			}).on('click', '.town-action', function(){
				town.aside.init($(this).attr('id'));
			});
		}
	}
	function merchantMsg() {
		chat.log('Rendo Surefoot says, "Hello, '+ my.name +'. I have got a once-in-a-lifetime smokin\' deal for you, my friend! Today, we just received a limited edition Lanfeld champion sword from our supply chain!"')
	}
	function trainerMsg() {
		chat.log('Arwen Reinhardt says, "Hail to thee, '+ my.name +'. You had better sharpen up your skills, kiddo, or you\'ll be dead meat out there. Take it from me—a battle-hardened warrior that has seen more than his fair share of death and despair."')
	}
	function guildMsg() {
		chat.log('Valeska Windcrest says, "Good day, '+ my.name +'. What would you ask of me?"')
	}
	function missionMsg() {
		chat.log('Miranda Crossheart says, "Hey, sunshine! Are you itching for a bit of action?! There\'s no shortage of miscreants to dispatch around these parts!"')
	}
	function init() {
		if (!town.initialized) {
			town.initialized = 1;
			if (!sessionStorage.getItem('startTime')) {
				sessionStorage.setItem('startTime', JSON.stringify(Date.now()));
			}
			town.preload();
		}
	}
	function preload() {
		var p = 'images/town/';
		cache.preloadImages([
			p + 'arwen-reinhardt.png',
			p + 'halas.jpg',
			p + 'miranda-crossheart.png',
			p + 'neriak.jpg',
			p + 'poh.jpg',
			p + 'rendo-surefoot.png',
			p + 'surefall.jpg',
			p + 'valeska-windcrest.png',
			'images/dungeon/braxxen1.jpg',
			'images/skills/' + my.job + '.png'
		])
	}
})();