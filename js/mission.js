var mission;
(function() {
	mission = {
		data: {},
		loaded: 0,
		delegated: 0,
		zones: [
			{
				name: 'Ashenflow Peak',
				level: 35,
				id: 14,
				isOpen: 0
			},
			{
				name: 'Galeblast Fortress',
				level: 35,
				id: 13,
				isOpen: 0
			},
			{
				name: 'Anuran Ruins',
				level: 32,
				id: 12,
				isOpen: 0
			},
			{
				name: 'Fahlnir Citadel',
				level: 28,
				id: 11,
				isOpen: 0
			},
			{
				name: 'Temple of Prenssor',
				level: 24,
				id: 10,
				isOpen: 0
			},
			{
				name: "Arcturin's Crypt",
				level: 20,
				id: 9,
				isOpen: 0
			},
			{
				name: 'Sylong Mausoleum',
				level: 16,
				id: 8,
				isOpen: 0
			},
			{
				name: 'Kordata Cove',
				level: 12,
				id: 7,
				isOpen: 0
			},
			{
				name: "Babel's Bastille",
				level: 8,
				id: 6,
				isOpen: 0
			},
			{
				name: 'Lanfeld Refuge',
				level: 5,
				id: 5,
				isOpen: 0
			},
			{
				name: 'Riven Grotto',
				level: 5,
				id: 4,
				isOpen: 0
			},
			{
				name: 'Greenthorn Cavern',
				level: 5,
				id: 3,
				isOpen: 0
			},
			{
				name: 'Tendolin Hollow',
				level: 1,
				id: 2,
				isOpen: 0
			},
			{
				name: 'Salubrin Den',
				level: 1,
				id: 1,
				isOpen: 0
			}
		],
		quests: [],
		resetMissionLists,
		getDiffClass,
		init,
		showEmbark,
		updateTitle,
		asideHtmlHead,
		asideHtml,
		asideFooter,
		questHtml,
		show,
		updateTitle,
		loadQuests,
		toggleZone,
		findIndexById,
		clickQuest,
		embark,
		initQuest,
		setQuest,
		abandon,
		abort,
		openFirstTwoZones,
	}
	///////////////////////////////////////////////
	function resetMissionLists() {
		mission.zones.forEach(function(v) {
			v.isOpen = 0;
		});
	}
	function getDiffClass(minQuestLvl) {
		var resp = 'mission-grey';
		if (minQuestLvl >= my.level + 3) {
			resp = 'mission-red';
		}
		else if (minQuestLvl > my.level) {
			resp = 'mission-yellow';
		}
		else if (minQuestLvl === my.level) {
			resp = 'mission-white';
		}
		else if (minQuestLvl >= ~~(my.level * .88) ) {
			resp = 'mission-high-blue';
		}
		else if (minQuestLvl >= ~~(my.level * .77) ) {
			resp = 'mission-low-blue';
		}
		else if (minQuestLvl >= ~~(my.level * .66) ) {
			resp = 'mission-green';
		}
		return resp;
	}
	function init() {
		ng.lock(1);
		$.get(app.url + 'mission/load-mission-data.php').done(function(data) {
			console.info('load-mission-data', data.mission);
			mission.loaded = 1;
			mission.data = data.mission;
			mission.show();
			mission.openFirstTwoZones();
			ng.unlock();
		}).fail(function(data){
			chat.log(data.responseText, 'chat-alert');
			ng.unlock();
		});
		// delegation
		if (!mission.delegated) {
			mission.delegated = 1;
			$("#scene-town").on('click', '.mission-zone', function() {
				console.info(".mission-zone CLICK");
				mission.toggleZone($(this));
			}).on('click', '.mission-quest-item', function() {
				mission.clickQuest($(this));
			}).on('click', '#mission-embark', function(){
				mission.embark();
			}).on('click', '#mission-abandon', function() {
				mission.abandon();
			});
		}
	}
	function showEmbark() {
		$("#mission-help").css('display', 'none');
		$("#mission-embark").css('display', 'block');
	}
	function updateTitle() {
		$("#mission-title").html(mission.quests[my.selectedQuest].title);
	}
	function asideHtmlHead() {
		var headMsg = 'Mission Counter',
			helpMsg = 'The party leader must select a zone and embark to begin!',
			embarkClass = 'none',
			helpClass = 'block';

		if (party.presence[0].isLeader) {
			// is solo or a leader
			headMsg = 'Select A Mission';
			helpMsg = 'Select a quest from any zone and embark to venture forth!';
		}
		if (my.quest.level) {
			headMsg = my.quest.title;
			embarkClass = 'block';
			helpClass = 'none';
		}

		var s =
		'<div id="mission-wrap" class="aside-frame text-center">' +
			'<div id="mission-title">'+ headMsg +'</div>' +
			'<div id="mission-embark" class="ng-btn '+ embarkClass +'">Embark!</div>' +
			'<div id="mission-help" class=" '+ helpClass +'">'+ helpMsg +'</div>' +
		'</div>';
		return s;
	}
	function asideHtml() {
		var s = '';
		mission.zones.forEach(function(v) {
			if (my.level >= v.level) {
				s +=
				'<div class="mission-zone" '+
				'data-id="'+ v.id +'">'+
					'<div class="fa-stack fa fa-mission-stack">'+
						'<i class="fa fa-square fa-stack-1x mission-plus-bg text-shadow"></i>'+
						'<i class="fa fa-plus fa-stack-1x mission-plus text-shadow"></i>'+
					'</div>' +
					'<div>' + v.name + '</div>' +
				'</div>' +
				'<div id="mission-zone-'+ v.id +'" class="mission-quest-list">'+
					ng.loadMsg +
				'</div>'
			}
		});
		return s;
	}
	function asideFooter() {
		var s = '';
		if (party.party.presence[0].isLeader) {
			s +=
			'<div id="mission-footer" class="aside-frame text-shadow">' +
				'<div id="mission-abandon" class="ng-btn ng-btn-alert">Abandon Mission</div>' +
			'</div>';
		}
		return s;
	}
	function questHtml(data) {
		console.info('load-zone-missions', data);
		var str = '';
		data.quests !== undefined &&
		data.quests.forEach(function(v){
			str +=
				'<div class="mission-quest-item ellipsis '+ mission.getDiffClass(v.level) +'" '+
					'data-id="'+ v.row +'" ' +
					'data-zone="'+ v.zone +'" ' +
					'data-level="'+ v.level +'">' +
					v.title +
				'</div>';
		});
		if (!str) str = '<div class="mission-quest-item">No missions found.</div>';
		$("#mission-zone-" + data.id).html(str);
	}
	function show() {
		$('#mission-counter').html(mission.asideHtml());
	}
	function updateTitle() {
		$("#mission-title").html(my.quest.title);
	}
	function updateAll() {
		$("#aside-menu").html(town.aside.menu.townMission());
	}
	function loadQuests(id) {
		// get quests from server side
		// start with salubrin den
		// store in session... return session if it's set for that zone
		console.info("LOADING QUESTS: ", id);
		ng.lock(1);
		$.post(app.url + 'mission/load-zone-missions.php', {
			id: id
		}).done(function(data) {
			data.id = id;
			ng.unlock();
			console.info('load-zone-missions', data);
			data.quests.forEach(function(v){
				mission.quests[v.row] = v;
			});
			mission.questHtml(data);
		}).fail(function(data){
			ng.msg(data.responseText);
			ng.unlock();
		});
	}
	function toggleZone(that) {
		 console.info("toggleZone: ", that.data('id'));
		var index = mission.findIndexById(that.data('id') * 1),
			id = mission.zones[index].id,
			o = mission.zones[index];
		console.info('JSON ', JSON.parse(JSON.stringify(o)));
		console.info(index, "isOpen: ", o.isOpen);
		if (o.isOpen) {
			// close menu
			var e = that.find('.mission-minus');
			console.info('CLOSE MENU: ', e);
			e.removeClass('fa-minus mission-minus').addClass('fa-plus mission-plus');
			$("#mission-zone-" + id).css('display', 'none');
			o.isOpen = 0;
		}
		else {
			// open menu
			var e = that.find('.mission-plus');
			console.info('OPEN MENU: ', e);
			e.removeClass('fa-plus mission-plus').addClass('fa-minus mission-minus');
			$("#mission-zone-" + id).css('display', 'block');
			o.isOpen = 1;
			mission.loadQuests(id);
		}
	}
	function findIndexById(id) {
		var resp = 0;
		mission.zones.forEach(function(v, i) {
			if (id === v.id) {
				resp = i;
			}
		});
		return resp;
	}
	function clickQuest(that) {
		var id = that.data('id') * 1;
		if (id && party.party.presence[0].isLeader) {
			my.selectedQuest = id;
			console.info("QUEST SELECTED: ", id);
			mission.showEmbark();
			mission.updateTitle();
		}
		else {
			// TODO: non-party member needs to see something... EMBARK?
		}
	}
	function embark() {
		if (party.party.presence[0].isLeader) {
			ng.lock(1);
			$.post(app.url + 'mission/embark-quest.php', {
				quest: mission.quests[my.selectedQuest]
			}).done(function(data) {
				console.info('embark isLeader! ', data);
				mission.setQuest(mission.quests[my.selectedQuest]);
				my.zoneMobs = data.zoneMobs;
				TweenMax.to('#scene-town', 3, {
					startAt: { opacity: 1 },
					opacity: 0,
					ease: Power4.easeOut
				});
				setTimeout(function() {
					dungeon.go();
				}, game.questDelay);
			}).fail(function(data){
				ng.msg(data.responseText);
			}).always(function() {
				ng.unlock();
			});
		}
		else {
			// joining
			if (my.quest.level) {
				dungeon.go();
				/*$.get(app.url + 'mission/notify-party-embarked.php').done(function(data) {
					console.info(data);
				});*/
			}
			else {
				chat.log("Quest data not found.", "chat-alert")
			}
		}
		$(".close-aside").trigger('click');
	}
	function initQuest() {
		my.selectedQuest = '';
		my.quest = {};
		updateAll();
	}
	function setQuest(quest) {
		console.info("SETTING QUEST", quest);
		my.selectedQuest = quest.row;
		my.quest = quest;
	}
	function abandon() {
		// clicked flag
		if (!my.quest.level) {
			chat.log("You have not started a mission!", "chat-warning");
		}
		else if (!party.presence[0].isLeader) {
			chat.log("Only party leaders can abandon missions, but you can /disband the party to quit.", "chat-warning");
		}
		else if (ng.view === 'battle') {
			chat.log("You cannot abandon missions while in combat!", "chat-warning");
		}
		else {
			ng.lock(1);
			$.get(app.url + 'mission/abandon-quest.php').done(function (data) {
				console.info('abandon ', data);
			}).fail(function (data) {
				chat.log(data.responseText, 'chat-alert');
			}).always(function () {
				setTimeout(function() {
					ng.unlock();
				}, game.questDelay);
			});
		}
	}
	function abort() {
		button.hide();
		chat.log('Mission abandoned!', 'chat-warning');
		if (ng.view === 'dungeon') {
			chat.log('Returning to town...', 'chat-warning');
			ng.lock(1);

			// init client and transition back to town
			//game.heartbeatEnabled = false;
			mission.initQuest();
			// rejoin main chat
			chat.joinChannel('town', 1);
			TweenMax.to('#scene-dungeon', 2, {
				delay: 1,
				opacity: 0
			});

			town.go();
			game.getPresence();
			chat.modeChange({
				mode: '/say'
			});
			// this must be in place to prevent heartbeat updates while going back to town
			game.heartbeatEnabled = true;
			setTimeout(function() {
				ng.unlock();
			}, 1000);
		}
	}
	function openFirstTwoZones() {
		for (var i=0; i<2; i++) {
			var e = $(".mission-zone").eq(i).get(0);
			if (e !== undefined) {
				e.click();
			}
		}
	}
})();