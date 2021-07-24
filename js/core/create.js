var create;
(function($, TweenMax, _, Power1, Power2, undefined) {
	create = {
		events,
		deleteCharacter,
		msg,
		getPossibleJobs,
		getRaceAttrs,
		getJobAttrs,
		set,
		getResist,
		getDungeon,
		getEmptyForm,
		setRandomGender,
		setRandomRace,
		setRandomClass,
		setFace,
		whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzBackspaceEscape',
		selected: 0,
		base: {
			str: 0,
			sta: 0,
			agi: 0,
			dex: 0,
			wis: 0,
			intel: 0,
			cha: 0
		},
		form: getEmptyForm(),
		possibleJobs: {},
		raceAttrs: {},
		jobAttrs: {},
		types: {
			[CLASS.BARD]: 'Utility',
			[CLASS.CLERIC]: 'Healer',
			[CLASS.DRUID]: 'Healer',
			[CLASS.ENCHANTER]: 'Utility',
			[CLASS.TEMPLAR]: 'Magical DPS',
			[CLASS.MONK]: 'Physical DPS',
			[CLASS.WARLOCK]: 'Magical DPS',
			[CLASS.CRUSADER]: 'Tank',
			[CLASS.RANGER]: 'Physical DPS',
			[CLASS.ROGUE]: 'Physical DPS',
			[CLASS.SHADOW_KNIGHT]: 'Tank',
			[CLASS.SHAMAN]: 'Healer',
			[CLASS.WARRIOR]: 'Tank',
			[CLASS.WIZARD]: 'Magical DPS'
		},
		info: {
			gender: {
				Male: "Males have strong ice and arcane resistance.",
				Female: "Females receive a boost to bleed and poison resistance."
			},
			race: {
				[RACE.BARBARIAN]: 'Barbarians are a hardy race that benefit from high strength and stamina. Living through harsh winters in Fenwoven has given them very strong ice resistance. Furthermore, their ice spells enjoy a solid passive bonus. Due to their strong cultural preference for clubs and mallets, they are most powerful wielding blunt weapons.',
				[RACE.DARK_ELF]: 'Dark Elves are an evil race from Vedria that excel in a variety of roles. They boast strong blood and arcane resistance. Their have the innate ability to leech health from all melee attacks and have a passive bonus to blood spell damage.',
				[RACE.DWARF]: 'Dwarves hail from Dunhoven, a mountainous region of Vandamor. They are a stout, loyal race with strong resistances to arcane and poison magic. Dwarves also have a bonus to defense and alteration.',
				[RACE.SERAPH]: 'Hailing from the remote island city of Wexxen, the Seraphim live to serve and glorify Yentus, the God of Light. Generations of mental and spiritual development have made their bodies weak, but powerful otherwise. Their rigorous spiritual training has made them very resistant against arcane magic. Naturally gifted at spellcasting, Seraphs have a modest bonus to all passive casting skills.',
				[RACE.GNOME]: 'Gnomes hail from Brindomir, a mountainous city on the eastern outskirts of Vandamor. Due to their extensive tinkering and scientific experimentation, they have high lightning resistance and are highly resistant to silence.',
				[RACE.HALF_ELF]: 'Half Elves possess an admixture of Humans and Wood Elf blood. They primarily dwell in Prentia, a city in western Vandamor. Half Elves share a strong resemblence to their both of their ancestors, though their distinct qualities are clear on the battlefield. Half Elves enjoy a modest boost to all passive non-casting skills, making them a capable, balanced race ready for most situations.',
				[RACE.HALFLING]: 'Halflings dwell in Aspen Grove, a hamlet on the southern coast of Vandamor. They are a race of nimble pranksters with high agility and dexterity. Deft and nimble, Halflings enjoy a passive bonus to offense, dodge, and piercing weapons.',
				[RACE.HIGH_ELF]: 'High Elves live in Kaedorn, a walled kingdom ruled by a monarchy for thousands of years. Despite their resemblance to Wood Elves, their strengths are in spellcasting due to their diligent study of magic. They regenerate magic faster than any other race and have a strong bonus to evocation spells.',
				[RACE.HUMAN]: 'Humans are an fearless, intrepid race hailing from Edenberg, the imperial capital of Vandamor. Despite their balanced attributes, their fearless leadership is legendary throughout Vandamor. Humans are highly resistant to fear, have strong spirit regeneration, and a bonus to slashing weapons.',
				[RACE.ORC]: 'Orcs hail from Gorgek, a city on an isolated peninsula of southern Vandamor. A brutish and fierce race, orcs have the highest strength and stamina among all races. They have a passive stun resist bonus which helps them fight back in the face of overwhelming odds. Orcs also enjoy a healthy bonus to using two-handed weapons.',
				[RACE.TROLL]: 'Trolls are a savage race from the swaps of Slagnon. Their exceptional strength and stamina makes them formidable warriors on the front-line. They uniquely regenerate health faster than any other race, but they are weak against fire magic. Trolls also have a strong bonus to conjuration spells.',
				[RACE.WOOD_ELF]: 'Wood Elves are a race from the city of Artremia. Their knowledge of the great outdoors is unmatched, giving them strong archery, ice resistance, fire resistance, and lightning resistance. They also have a bonus to all fire, ice, and lightning magic spells.'
			},
			job: {
				[CLASS.BARD]: 'Bards are a utility class that can wear plate armor. They can fill in almost any role in a pinch, but their true strength lies in making everyone in their party better. Their songs can even the most listless party spring to life to defeat a powerful foe.',
				[CLASS.CLERIC]: "Clerics are a healing class that can wear plate armor. They specialize in directly healing their allies in combat. They boast powerful support spells that buff their party's health and armor. They also have strong magic-based stuns and they can do modest magic damage in a pinch.",
				[CLASS.DRUID]: 'Druids are a healing class that can wear leather armor. They have strong direct healing skills and some of the best regenerative spells among all classes. Druids also have powerful elemental spells that make them highly adaptive against a variety of foes.',
				[CLASS.ENCHANTER]: 'Enchanters are a utility class that can only wear cloth armor. Among the cloth-wearing casters, their magic does the least amount of damage, but they have some of the strongest support spells in the game. Their ability to subvert and control the battle makes them valuable to any party.',
				[CLASS.TEMPLAR]: 'Templar are a magical DPS class that can wear leather armor. They are the most flexible casting class with a deadly assortment of spells at their disposal. They have powerful buffs and debuffs that make them particularly good companions with other spellcasters.',
				[CLASS.MONK]: "Monks are a physical DPS class that can wear leather armor. Monks discipline themselves and practice martial arts to convert their bodies into a devastating force of nature. Monks deliver top-tier physical DPS with hand-to-hand or blunt weapons. With intense spiritual training they can even heal and protect themselves in combat.",
				[CLASS.WARLOCK]: 'Warlocks are a magical DPS class that can only wear cloth armor. They have powerful damage-over-time spells that wear down foes over time. Their spells strike fear into their enemies, weakening them in combat. Their ability to transform into a lich form and steal health makes them resilient in combat and less dependent on others.',
				[CLASS.CRUSADER]: 'Crusaders are a tank class that can wear plate armor. Crusaders have the unique ability to lay hands, healing themselves when they need it most. Crusaders also have strong stuns and healing spells which make them very difficult to kill.',
				[CLASS.RANGER]: "Rangers are a physical DPS class that can wear mail armor. They're the only class that can use bows, which help them inflict massive damage from any distance. A diverse arsenal of support spells also aid them in battle.",
				[CLASS.ROGUE]: 'Rogues are a physical DPS class that can wear mail armor. They can unleash powerful bursts of damage with daggers that stuns and bleeds opponents. Their elusive combat style weaves a vicious combination of redirection, stealth, illusions, and poison to put themselves at an advantage.',
				[CLASS.SHADOW_KNIGHT]: 'Shadow Knights are a tank class that can wear plate armor. They have the unique ability to harm touch a mob, dealing a large amount of damage to a single target. They have the strongest offensive potential among all tanks along with deadly abilities like fear and life tap.',
				[CLASS.SHAMAN]: 'Shaman are a healing class that can wear mail armor. Their ability to buff their party and debuff mobs is capable of turning the tables with ease. Their spell selection makes them very versatile and deadly in combat.',
				[CLASS.WARRIOR]: 'Warriors are a tank class that can wear plate armor. Warriors have the strongest physical defense and the highest hit points in the game. Warriors are skilled with a wide variety of weapons and are capable of unleashing powerful attacks to keep the tempo of battle under control.',
				[CLASS.WIZARD]: 'Wizards are a magical DPS class that can only wear cloth armor. Instead of opting for trickery or pets, they focus on raw magical power. Wizards have a powerful and diverse arsenal of spells at their disposal that make quick work of their prey.'
			}
		},
	};
	// public //////////////////////////////////////
	function events() {
		if (!app.isApp) {
			$("#logout").on('click', ng.logout);
		}
		$("#ch-card-wrap").on('click', '.ch-card', function(){
			$('.ch-card').removeClass('ch-card-active');
			$(this).addClass('ch-card-active');
		});
		$('.ch-card:first').trigger('click');
		// create character
		$("#go-create-character").on('click', ng.goCreateCharacter);
		$("#delete-character").on('click', onClickDelete);
		$(".select-race").on('click', selectRace);
		$(".select-class").on('click', selectClass);
		$(".select-gender").on('click', selectGender);
		$("#create-character-name").on('change keydown keyup', onNameChange);
		$(".attr-minus-1").on('click', subtractAttribute);
		$(".attr-add-1").on('click', addAttribute);
		$("#create-character-back").on('click', goCreateToTitle);
		$("#create-character-btn").on('click', createCharacter);
		$('#portrait-down').on('click', faceDown)
		$('#portrait-up').on('click', faceUp)
	}
	function onClickDelete() {
		modal.show({
			key: 'delete-character'
		});
		audio.playSound('click-4')
	}
	function selectRace() {
		var race = $(this).text();
		if (race === create.form.race) return
		$('.select-race').removeClass('active');
		$(this).addClass('active');
		create.setRandomClass(race);
		create.set('race', race);
		setFace()
		audio.playSound('click-17')
	}
	function selectClass() {
		if (!this.className.includes('disabled')) {
			var job = $(this).text();
			if (job === create.form.job) return
			$('.select-class').removeClass('active');
			$(this).addClass('active');
			create.set('job', job)
			setAvatarBg()
			audio.playSound('click-17')
		}
	}
	function selectGender() {
		// console.info(this);
		var gender = $(this).data('gender');
		$(".select-gender").removeClass('active');
		$('#' + gender).addClass('active');
		create.set('gender', gender);
		setFace()
		audio.playSound('click-17')
	}
	function onNameChange(e) {
		if (create.whitelist.includes(e.key)) {
			var val = $(this).val().trim();
			create.form.name = val.replace(/[^A-z]/g, '');
		}
		else {
			return false;
		}
	}
	function subtractAttribute() {
		var attr = $(this).data('id');
		if (create.form.left < 10 &&
			(create.form[attr] - create.base[attr] > 0) ){
			getElementById('create-points-' + attr).innerHTML = --create.form[attr];
			getElementById('create-points-remaining').innerHTML = ++create.form.left;
			audio.playSound('chime-4')
		}
	}
	function addAttribute() {
		var attr = $(this).data('id');
		if (create.form.left){
			getElementById('create-points-' + attr).innerHTML = ++create.form[attr];
			getElementById('create-points-remaining').innerHTML = --create.form.left;
			audio.playSound('chime-4')
		}
	}
	function goCreateToTitle() {
		ng.lock(1);
		ng.initGame();
		audio.playSound('click-4')
		TweenMax.to('#scene-title-create-character', .6, {
			y: 20,
			opacity: 0,
			onComplete: function(){
				TweenMax.set('#scene-title-create-character', {
					display: 'none',
					opacity: 1
				});
				TweenMax.to('#scene-title-select-character', .6, {
					startAt: {
						display: 'flex',
						y: 20,
						opacity: 0
					},
					y: 0,
					opacity: 1,
					onComplete: ng.unlock
				});
				TweenMax.set('#ngo-logo-fg', {
					overwrite: 1,
					webkitMaskPositionX: '-40rem',
				});
				TweenMax.to('#title-gwen', .6, {
					startAt: { x: -20, filter: 'brightness(10) contrast(5)' },
					x: 0,
					filter: 'brightness(1) contrast(1)',
					opacity: 1,
					onComplete: ng.flashNgoLogo,
				})
				TweenMax.to('.ngo-logos', .6, {
					startAt: { y: -20 },
					y: 0,
					opacity: 1
				})
				TweenMax.to('#ngo-logo', .6, {
					startAt: { filter: 'brightness(10) contrast(5)' },
					filter: 'brightness(1) contrast(1)',
				})
			}
		});
		TweenMax.to('#title-gwen', .6, {
			startAt: { x: 0, filter: 'brightness(1) contrast(1)' },
			x: -20,
			filter: 'brightness(10) contrast(5)',
			opacity: 0
		})
		TweenMax.to('#ngo-logo', .6, {
			startAt: { filter: 'brightness(1) contrast(1)' },
			filter: 'brightness(10) contrast(5)',
		})
		TweenMax.to('.ngo-logos', .6, {
			startAt: { y: 0, },
			y: -20,
			opacity: 0
		})
	}

	function createCharacter() {
		//client-side validation
		if (ng.locked) return;

		ng.lock(1)
		var f = create.form;
		var err = '';
		f.name = getCleanName(f.name);
		audio.playSound('chime-3')
		if (!f.name){
			err = 'Your character needs a name!';
			$("#create-character-name").focus();
		}
		else if(f.name.length > 12){
			err = "Your character name must be 12 characters or less!";
		}
		else if(f.left){
			err = 'You must spend all of your ability points!';
		}
		if (err){
			ng.msg(err, undefined, COLORS.yellow);
			ng.unlock();
		}
		else {
			// final adds
			f.shortJob = ng.toJobShort(f.job);
			var finalForm = _.cloneDeep(f);
			// subtract base values so server can verify only 10 points were added
			ng.attrs.forEach(key => {
				finalForm[key] -= create.base[key];
			});
			// send to server
			$.post(app.url + 'create/create-character.php', {
				form: finalForm
			}).done(r => {
				ng.config.selectedRowIndex = r.id
				ng.msg(r.hero.name + ' has been created!')
				$("#create-character-back").trigger('click')
				audio.save()
			}).fail(r => {
				ng.msg(r.responseText, 8, undefined, COLORS.yellow)
				ng.unlock()
			});
		}
	}
	function deleteCharacter() {
		// send to server
		if (ng.locked) return;
		ng.lock();
		audio.playSound('click-4')
		$.post(app.url + 'create/delete-character.php', {
			row: create.selected
		}).done(r => {
			// console.info('Deleted character: ', r);
			ng.msg(create.name + ' has been deleted!');
			modal.hide();
			ng.initGame();
		}).fail(r => {
			ng.msg(r.responseText, 8, undefined, COLORS.yellow);
			ng.unlock();
		})
	}
	function msg(key, val) {
		return create.info[key][val];
	}
	function getPossibleJobs(race) {
		return create.possibleJobs[race];
	}
	function getRaceAttrs(race) {
		return create.raceAttrs[race];
	}
	function getJobAttrs(job) {
		return create.jobAttrs[job];
	}
	function set(key, val) {
		getElementById(key + '-value').innerHTML = create.form[key] = val;
		// details
		ng.splitText('create-details', create.msg(key, val));
		// reset attr
		if (key !== 'gender' && create.form.race) {
			var raceAttr = _.cloneDeep(create.getRaceAttrs(create.form.race));
			var jobAttr = _.cloneDeep(create.getJobAttrs(create.form.job));
			jobAttr.forEach((v, i) => {
				raceAttr[i] += v;
			});
			// set initial attr values
			$(".create-attr-value").removeClass('active');
			ng.attrs.forEach((v, i) => {
				var e = getElementById('create-points-' + v);
				e.innerHTML = create.form[v] = create.base[v] = raceAttr[i];
				if (jobAttr[i]){
					e.className = e.className + ' active';
				}
				getElementById('create-points-remaining').innerHTML = create.form.left = 10;
			});
			// reset form bonuses
		}
	}

	function getResist(type, obj) {
		// gender and race
		var v = 0
		var {gender, race} = obj
		if (typeof gender === 'number') {
			gender = gender ? 'Female' : 'Male'
		}

		if (type === PROP.RESIST_BLOOD) {
			if (gender === 'Female'){
				v += 2;
			}
			if (race === RACE.DARK_ELF) {
				v += 3;
			}
		}
		else if (type === PROP.RESIST_POISON){
			if (gender === 'Female'){
				v += 2;
			}
			if (race === RACE.DWARF){
				v += 3;
			}
		}
		else if (type === PROP.RESIST_ARCANE){
			if (gender === 'Male'){
				v += 2;
			}
			if (race === RACE.SERAPH){
				v += 6;
			}
			else if (race === RACE.DARK_ELF || race === RACE.DWARF){
				v += 3;
			}
		}
		else if (type === PROP.RESIST_LIGHTNING){
			if (race === RACE.GNOME){
				v += 5;
			}
			else if (race === RACE.WOOD_ELF){
				v += 3;
			}
		}
		else if (type === PROP.RESIST_FIRE){
			if (race === RACE.TROLL){
				v -= 5;
			}
			else if (race === RACE.WOOD_ELF){
				v += 3;
			}
		}
		else if (type === PROP.RESIST_ICE){
			if (gender === 'Male'){
				v += 2;
			}
			if (race === RACE.BARBARIAN){
				v += 6;
			}
			else if (race === RACE.WOOD_ELF){
				v += 3;
			}
		}
		return v;
	}
	function getDungeon(type) {
		// race and job
		var v = 15,
			f = create.form;

		if (type === 'traps'){
			// traps
			if (f.race === RACE.DARK_ELF){
				v += 5;
			}
			else if (f.race === RACE.HALFLING || f.race === RACE.WOOD_ELF){
				v += 10;
			}
			else if (f.race === RACE.HALF_ELF){
				v += 7;
			}
			// class
			if (f.job === CLASS.SHADOW_KNIGHT ||
				f.job === CLASS.SHAMAN ||
				f.job === CLASS.WIZARD ||
				f.job === CLASS.CLERIC){
				v += 5;
			}
			else if (f.job === CLASS.DRUID ||
				f.job === CLASS.ENCHANTER ||
				f.job === CLASS.CRUSADER ||
				f.job === CLASS.WARRIOR){
				v += 10;
			}
			else if (f.job === CLASS.MONK){
				v += 20;
			}
			else if (f.job === CLASS.BARD ||
				f.job === CLASS.RANGER){
				v += 30;
			}
			else if (f.job === CLASS.ROGUE){
				v += 50;
			}
		}
		else if (type === 'treasure'){
			// treasure
			if (f.race === RACE.GNOME){
				v += 5;
			}
			else if (f.race === RACE.DWARF || f.race === RACE.HUMAN){
				v += 10;
			}
			else if (f.race === RACE.HALFLING){
				v += 20;
			}
			else if (f.race === RACE.HALF_ELF){
				v += 7;
			}
			// class
			if (f.job === CLASS.TEMPLAR ||
				f.job === CLASS.WARLOCK ||
				f.job === CLASS.CRUSADER ||
				f.job === CLASS.SHAMAN){
				v += 5;
			}
			else if (f.job === CLASS.ENCHANTER ||
				f.job === CLASS.MONK ||
				f.job === CLASS.WARRIOR ||
				f.job === CLASS.SHADOW_KNIGHT){
				v += 10;
			}
			else if (f.job === CLASS.BARD ||
				f.job === CLASS.DRUID){
				v += 20;
			}
			else if (f.job === CLASS.ROGUE ||
				f.job === CLASS.RANGER){
				v += 30;
			}
		}
		else if (type === 'scout'){
			// scout
			if (f.race === RACE.WOOD_ELF){
				v += 15;
			}
			else if (f.race === RACE.DARK_ELF){
				v += 8;
			}
			else if (f.race === RACE.HALF_ELF){
				v += 7;
			}
			else if (f.race === RACE.BARBARIAN){
				v += 5;
			}
			// class
			if (f.job === CLASS.CLERIC ||
				f.job === CLASS.SHADOW_KNIGHT ||
				f.job === CLASS.WARRIOR ||
				f.job === CLASS.WIZARD){
				v += 5;
			}
			else if (f.job === CLASS.ENCHANTER ||
				f.job === CLASS.CRUSADER ||
				f.job === CLASS.SHAMAN){
				v += 10;
			}
			else if (f.job === CLASS.BARD ||
				f.job === CLASS.MONK){
				v += 20;
			}
			else if (f.job === CLASS.ROGUE ||
				f.job === CLASS.DRUID){
				v += 25;
			}
			else if (f.job === CLASS.RANGER){
				v += 50;
			}
		}
		else if (type === 'pulling'){
			// pulling
			if (f.race === RACE.HUMAN){
				v += 20;
			}
			else if (f.race === RACE.HALFLING){
				v += 10;
			}
			else if (f.race === RACE.HALF_ELF){
				v += 7;
			}
			else if (f.race === RACE.SERAPH){
				v += 5;
			}
			// class
			if (f.job === CLASS.TEMPLAR ||
				f.job === CLASS.WARLOCK ||
				f.job === CLASS.SHAMAN){
				v += 5;
			}
			else if (f.job === CLASS.ENCHANTER ||
				f.job === CLASS.ROGUE ||
				f.job === CLASS.SHADOW_KNIGHT ||
				f.job === CLASS.CRUSADER){
				v += 10;
			}
			else if (f.job === CLASS.DRUID){
				v += 15;
			}
			else if (f.job === CLASS.BARD){
				v += 20;
			}
			else if (f.job === CLASS.RANGER){
				v += 30;
			}
			else if (f.job === CLASS.WARRIOR){
				v += 40;
			}
			else if (f.job === CLASS.MONK){
				v += 50;
			}
		}
		return v;
	}
	function setRandomGender() {
		var e = $(".select-gender:eq("+ ~~(rand() * 2) +")");
		e.length && e.trigger('click');
	}
	function setRandomRace() {
		var e = $(".select-race:eq("+ ~~(rand() * 12) +")");
		e.length && e.trigger('click');
	}
	function setRandomClass(race) {
		// triggered by clicking race
		// back to default
		$(".select-class").removeClass().addClass('select-class disabled');
		// remove disabled from possibles
		var ids = '',
			jobs = create.getPossibleJobs(race),
			len = jobs.length;
		jobs.forEach((v, i) => {
			ids += '#create-' + v.split(' ').join('-');
			if (i < len-1){
				ids += ', ';
			}
		})
		// need to wipe so that you can click the same job again
		create.form.job = ''
		$(ids).removeClass('disabled');
		// add active to selection
		var e = $(".select-class:not(.disabled)"),
			len = e.length;
		// LMAO
		const roll = ~~(rand() * (len - 1))
		e = e.eq(roll)
		e.length && e.trigger('click')
	}
	function getEmptyForm() {
		return {
			race: '',
			job: '',
			gender: '',
			name: '',
			face: _.random(0, 3),
			bg: _.random(0, 24),
			str: 0,
			sta: 0,
			agi: 0,
			dex: 0,
			wis: 0,
			intel: 0,
			cha: 0,
			left: 10,
			maxLeft: 10
		}
	}
	function faceUp() {
		if (++create.form.face > 3) create.form.face = 0
		setFace()
	}
	function faceDown() {
		if (--create.form.face < 0) create.form.face = 3
		setFace()
	}
	function setFace() {
		var obj = _.pick(create.form, KEYS.SET_FACE)
		obj.gender = obj.gender === 'Male' ? 0 : 1
		query.el('#create-portrait').src = my.getAvatarUrl(obj)
		audio.playSound('click-17')
		TweenMax.to('#create-portrait', .25, {
			startAt: {
				filter: 'brightness(.5) contrast(3)',
				scale: 1.015,
			},
			overwrite: 1,
			scale: 1.01,
			filter: 'brightness(2) contrast(3)',
			ease: Power2.easeIn,
			onComplete: function() {
				TweenMax.to(this.target, .3, {
					filter: 'brightness(1) contrast(1)',
					scale: 1,
				})
			}
		})
	}
	function setAvatarBg() {
		query.el('#create-portrait-bg').src = 'images/avatar-bg/' + ng.toJobShort(create.form.job) + '.png'
		TweenMax.to('#create-portrait-bg', .3, {
			startAt: { opacity: .3, filter: '' },
			overwrite: 1,
			opacity: 1,
			ease: Power1.easeIn,
			onComplete: function() {
				TweenMax.to(this.target, 3, {
					startAt: { filter: 'saturate(1.2) brightness(1.1) contrast(1)' },
					filter: 'saturate(1.5) brightness(1.25) contrast(2.5)',
					repeat: -1,
					yoyo: true,
					ease: Power1.easeIn,
				})
			}
		})
	}
	function getCleanName(name) {
		return _.capitalize(_.map(name, char => create.whitelist.includes(char) ? char : '').join(''));
	}
})($, TweenMax, _, Power1, Power2);
