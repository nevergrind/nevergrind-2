var create;
(function($, TweenMax, _, undefined) {
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
			Bard: 'Utility',
			Cleric: 'Healer',
			Druid: 'Healer',
			Enchanter: 'Utility',
			Summoner: 'Magical DPS',
			Monk: 'Physical DPS',
			Necromancer: 'Magical DPS',
			Crusader: 'Tank',
			Ranger: 'Physical DPS',
			Rogue: 'Physical DPS',
			'Shadow Knight': 'Tank',
			Shaman: 'Healer',
			Warrior: 'Tank',
			Wizard: 'Magical DPS'
		},
		info: {
			gender: {
				Male: "Males have strong ice and arcane resistance.",
				Female: "Females receive a boost to bleed and poison resistance."
			},
			race: {
				Barbarian: 'Barbarians are a hardy race that benefit from high strength and stamina. Living through harsh winters in Fenwoven has given them very strong ice resistance. Furthermore, their shaman enjoy a bonus to their ice spells. Barbarians are highly resistant to all freeze effects and have a strong bonus to blunt weapon skills.',
				'Dark Elf': 'Dark Elves are an evil race from Vedria that excel in a variety of roles. They boast strong blood and arcane resistance. Their leech health from all melee attacks and have a bonus to blood spell damage.',
				Dwarf: 'Dwarves hail from Dunhoven, a mountainous region of Vandamor. They are a stout, loyal race with strong resistances to arcane and poison magic. Dwarves also have a bonus to defense and alteration.',
				Seraph: 'Hailing from the remote island city of Wexxen, the Seraphim live to serve and glorify Yentus, the God of Light. Generations of intense academic pursuit has made their bodies weak, but their minds strong. As a result, they have very strong resistance against arcane magic. Naturally gifted at spellcasting, Seraphs have a modest bonus to all passive casting skills.',
				Gnome: 'Gnomes hail from Brindomir, a mountainous city on the eastern outskirts of Vandamor. Due to their extensive tinkering and scientific experimentation, they have high lightning resistance and are highly resistant to silence.',
				'Half Elf': 'Half Elves possess an admixture of Humans and Wood Elf blood. They primarily dwell in Prentia, a city in western Vandamor. Half Elves share a strong resemblence to their both of their ancestors, though their distinct qualities are clear on the battlefield. Half Elves enjoy a modest boost to all passive non-casting skills, making them a capable, balanced race ready for most situations.',
				Halfling: 'Halflings dwell in Aspen Grove, a hamlet on the southern coast of Vandamor. They are a race of nimble pranksters with high agility and dexterity. Deft and nimble, Halflings enjoy a passive bonus to offense, dodge, and piercing weapons.',
				'High Elf': 'High Elves live in Kaedorn, a walled kingdom ruled by a monarchy for thousands of years. Despite their resemblance to Wood Elves, their strengths are in spellcasting due to their diligent study of magic. They regenerate magic faster than any other race and have a strong bonus to evocation spells.',
				Human: 'Humans are an fearless, intrepid race hailing from Edenberg, the imperial capital of Vandamor. Despite their balanced attributes, their fearless leadership is legendary throughout Vandamor. Humans are highly resistant to fear, strong spirit regeneration, and a bonus to slashing weapons.',
				Orc: 'Orcs hail from Gorgek, a city on an isolated peninsula of southern Vandamor. A brutish and fierce race, orcs have the highest strength and stamina among all races. They are highly resistant to stuns which makes them powerful allies in any party. Orcs also enjoy a healthy bonus to using two-handed weapons.',
				Troll: 'Trolls are a savage race from the swaps of Slagnon. Their strength and stamina is second only to Ogres. They uniquely regenerate health faster than any other race, but they are weak to fire magic. Trolls also have a strong bonus to conjuration spells.',
				'Wood Elf': 'Wood Elves are a race from the city of Artremia. Their knowledge of the great outdoors is unmatched, giving them strong archery, ice resistance, fire resistance, and lightning resistance. They also have a bonus to all fire, ice, and lightning magic spells.'
			},
			job: {
				Bard: 'Bards are a utility class that can wear plate armor. They can fill in almost any role in a pinch, but their true strength lies in making everyone in their party better. Their charm and crowd control skills make them a boon to any party. They also have very strong all-around dungeon skills.',
				Cleric: "Clerics are a healing class that can wear plate armor. They specialize in directly healing their allies in combat. They boast powerful support spells that buff their party's health and armor. They also have strong magic-based stuns and they can do modest magic damage in a pinch.",
				Druid: 'Druids are a healing class that can wear leather armor. They have strong direct healing skills and HoT spells. Druids also have powerful elemental spells that make them highly adaptive. Their strong support spells and exception dungeon skills make them an asset to any party.',
				Enchanter: 'Enchanters are a utility class that can only wear cloth armor. Among the cloth-wearing casters, their magic does the least amount of damage, but they have the strongest support spells in the game. Their ability to crowd control is unmatched, and they have the ability to charm mobs when you really need to turn the tables.',
				Summoner: 'Summoners are a magical DPS class that can only wear cloth armor. They boast the strongest pets in the game due to their ability to summon four types of pets. They also wield powerful elemental magic and some of the most useful support spells in the game.',
				Monk: "Monks are a physical DPS class that can wear leather armor. Monks practice martial arts to deliver powerful punches and kicks. Monks deliver top-tier physical DPS with hand-to-hand or blunt weapons. They have solid dungeon skills and the best pulling ability among all classes.",
				Necromancer: 'Necromancers are a magical DPS class that can only wear cloth armor. They have powerful skeleton pets that make quick work of their enemies. Powerful DoT spells, fear, and life tap make them a formidable addition to any party.',
				Crusader: 'Crusaders are a tank class that can wear plate armor. Crusaders have the unique ability to lay hands, healing themselves when they need it most. Crusaders also have strong stuns and healing spells which make them very difficult to kill.',
				Ranger: "Rangers are a physical DPS class that can wear mail armor. They're the only class that can use bows, which help them inflict massive damage. A diverse arsenal of magic also aids them in battle. Notably, Rangers have the strongest overall dungeon skills, including the best scouting skills.",
				Rogue: 'Rogues are a physical DPS class that can wear mail armor. Their combination of stealth and bursts of damage make them deadly on the battlefield. Rogues have unparalleled disarm trap skills, along with very strong treasure and scouting skills.',
				'Shadow Knight': 'Shadow Knights are a tank class that can wear plate armor. They have the unique ability to harm touch a mob, dealing a large amount of damage to a single target. They have the strongest offensive potential among all tanks along with deadly abilities like fear and life tap.',
				Shaman: 'Shaman are a healing class that can wear mail armor. Their ability to buff their party and debuff mobs is capable of shifting the odds with ease. Their poison and frost spells make them both versatile and deadly in combat.',
				Warrior: 'Warriors are a tank class that can wear plate armor. Warriors have the strongest physical defense and the highest hit points in the game. They can also dish out a solid amount of physical DPS. Their exceptional pulling skills help keep their party out of trouble.',
				Wizard: 'Wizards are a magical DPS class that can only wear cloth armor. Instead of opting for trickery or pets, they focus on raw magical power. Wizards have a powerful and diverse arsenal of spells at their disposal that make quick work of their prey.'
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
	}
	function selectRace() {
		var race = $(this).text();
		if (race === create.form.race) return
		$('.select-race').removeClass('active');
		$(this).addClass('active');
		create.setRandomClass(race);
		create.set('race', race);
		setFace()
	}
	function selectClass() {
		if (!$(this).get(0).className.includes('disabled')){
			var job = $(this).text();
			if (job === create.form.job) return
			$('.select-class').removeClass('active');
			$(this).addClass('active');
			create.set('job', job)
		}
	}
	function selectGender() {
		console.info(this);
		var gender = $(this).data('gender');
		$(".select-gender").removeClass('active');
		$('#' + gender).addClass('active');
		create.set('gender', gender);
		setFace()
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
		}
	}
	function addAttribute() {
		var attr = $(this).data('id');
		if (create.form.left){
			getElementById('create-points-' + attr).innerHTML = ++create.form[attr];
			getElementById('create-points-remaining').innerHTML = --create.form.left;
		}
	}
	function goCreateToTitle() {
		ng.lock(1);
		ng.initGame();
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
					startAt: { x: -20, filter: 'brightness(10)' },
					x: 0,
					filter: 'brightness(1)',
					opacity: 1,
					onComplete: ng.flashNgoLogo,
				})
				TweenMax.to('.ngo-logos', .6, {
					startAt: { y: -20 },
					y: 0,
					opacity: 1
				})
				TweenMax.to('#ngo-logo', .6, {
					startAt: { filter: 'brightness(10)' },
					filter: 'brightness(1)',
				})
			}
		});
		TweenMax.to('#title-gwen', .6, {
			startAt: { x: 0, filter: 'brightness(1)' },
			x: -20,
			filter: 'brightness(10)',
			opacity: 0
		})
		TweenMax.to('#ngo-logo', .6, {
			startAt: { filter: 'brightness(1)' },
			filter: 'brightness(10)',
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

		ng.lock(1);
		var f = create.form;
		var err = '';
		f.name = getCleanName(f.name);
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
			ng.msg(err);
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
			}).done(function(r){
				ng.msg(r.hero.name + ' has been created!');
				$("#create-character-back").trigger('click');
			}).fail(function(r){
				ng.msg(r.responseText, 8);
				ng.unlock();
			});
		}
	}
	function deleteCharacter() {
		// send to server
		if (ng.locked) return;
		ng.lock();
		$.post(app.url + 'create/delete-character.php', {
			row: create.selected
		}).done(function(r){
			console.info('Deleted character: ', r);
			ng.msg(create.name + ' has been deleted!');
			modal.hide();
			ng.initGame();
		}).fail(function(r){
			ng.msg(r.responseText, 8);
			ng.unlock();
		});
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
		if (key === 'job'){
			//getElementById('type-value').innerHTML = create.types[val];
		}
		// resists
		ng.resists.forEach(function(v){
			//getElementById(_.kebabCase(v) + '-value').innerHTML = create.getResist(v, create.form)
		});
		// dungeon
		ng.dungeon.forEach(function(v){
			//getElementById(v + '-value').innerHTML = create.getDungeon(v);
		});
		// reset attr
		if (key !== 'gender' && create.form.race){
			var raceAttr = _.cloneDeep(create.getRaceAttrs(create.form.race));
			var jobAttr = _.cloneDeep(create.getJobAttrs(create.form.job));
			jobAttr.forEach(function(v, i){
				raceAttr[i] += v;
			});
			// set initial attr values
			$(".create-attr-value").removeClass('active');
			ng.attrs.forEach(function(v, i){
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
		var v = 15
		var {gender, race} = obj
		if (typeof gender === 'number') gender = gender ? 'Female' : 'Male' // normalize to string

		console.info('obj gender', gender, race)
		if (type === 'resistBlood'){
			if (gender === 'Female'){
				v += 5;
			}
			if (race === 'Dark Elf'){
				v += 10;
			}
		}
		else if (type === 'resistPoison'){
			if (gender === 'Female'){
				v += 5;
			}
			if (race === 'Dwarf'){
				v += 10;
			}
		}
		else if (type === 'resistArcane'){
			if (gender === 'Male'){
				v += 5;
			}
			if (race === 'Seraph'){
				v += 25;
			}
			else if (race === 'Dark Elf' || race === 'Dwarf'){
				v += 10;
			}
		}
		else if (type === 'resistLightning'){
			if (race === 'Gnome'){
				v += 20;
			}
			else if (race === 'Wood Elf'){
				v += 10;
			}
		}
		else if (type === 'resistFire'){
			if (race === 'Troll'){
				v -= 10;
			}
			else if (race === 'Wood Elf'){
				v += 10;
			}
		}
		else if (type === 'resistIce'){
			if (gender === 'Male'){
				v += 5;
			}
			if (race === 'Barbarian'){
				v += 25;
			}
			else if (race === 'Wood Elf'){
				v += 10;
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
			if (f.race === 'Dark Elf'){
				v += 5;
			}
			else if (f.race === 'Halfling' || f.race === 'Wood Elf'){
				v += 10;
			}
			else if (f.race === 'Half Elf'){
				v += 7;
			}
			// class
			if (f.job === 'Shadow Knight' ||
				f.job === 'Shaman' ||
				f.job === 'Wizard' ||
				f.job === 'Cleric'){
				v += 5;
			}
			else if (f.job === 'Druid' ||
				f.job === 'Enchanter' ||
				f.job === 'Crusader' ||
				f.job === 'Warrior'){
				v += 10;
			}
			else if (f.job === 'Monk'){
				v += 20;
			}
			else if (f.job === 'Bard' ||
				f.job === 'Ranger'){
				v += 30;
			}
			else if (f.job === 'Rogue'){
				v += 50;
			}
		}
		else if (type === 'treasure'){
			// treasure
			if (f.race === 'Gnome'){
				v += 5;
			}
			else if (f.race === 'Dwarf' || f.race === 'Human'){
				v += 10;
			}
			else if (f.race === 'Halfling'){
				v += 20;
			}
			else if (f.race === 'Half Elf'){
				v += 7;
			}
			// class
			if (f.job === 'Summoner' ||
				f.job === 'Necromancer' ||
				f.job === 'Crusader' ||
				f.job === 'Shaman'){
				v += 5;
			}
			else if (f.job === 'Enchanter' ||
				f.job === 'Monk' ||
				f.job === 'Warrior' ||
				f.job === 'Shadow Knight'){
				v += 10;
			}
			else if (f.job === 'Bard' ||
				f.job === 'Druid'){
				v += 20;
			}
			else if (f.job === 'Rogue' ||
				f.job === 'Ranger'){
				v += 30;
			}
		}
		else if (type === 'scout'){
			// scout
			if (f.race === 'Wood Elf'){
				v += 15;
			}
			else if (f.race === 'Dark Elf'){
				v += 8;
			}
			else if (f.race === 'Half Elf'){
				v += 7;
			}
			else if (f.race === 'Barbarian'){
				v += 5;
			}
			// class
			if (f.job === 'Cleric' ||
				f.job === 'Shadow Knight' ||
				f.job === 'Warrior' ||
				f.job === 'Wizard'){
				v += 5;
			}
			else if (f.job === 'Enchanter' ||
				f.job === 'Crusader' ||
				f.job === 'Shaman'){
				v += 10;
			}
			else if (f.job === 'Bard' ||
				f.job === 'Monk'){
				v += 20;
			}
			else if (f.job === 'Rogue' ||
				f.job === 'Druid'){
				v += 25;
			}
			else if (f.job === 'Ranger'){
				v += 50;
			}
		}
		else if (type === 'pulling'){
			// pulling
			if (f.race === 'Human'){
				v += 20;
			}
			else if (f.race === 'Halfling'){
				v += 10;
			}
			else if (f.race === 'Half Elf'){
				v += 7;
			}
			else if (f.race === 'Seraph'){
				v += 5;
			}
			// class
			if (f.job === 'Summoner' ||
				f.job === 'Necromancer' ||
				f.job === 'Shaman'){
				v += 5;
			}
			else if (f.job === 'Enchanter' ||
				f.job === 'Rogue' ||
				f.job === 'Shadow Knight' ||
				f.job === 'Crusader'){
				v += 10;
			}
			else if (f.job === 'Druid'){
				v += 15;
			}
			else if (f.job === 'Bard'){
				v += 20;
			}
			else if (f.job === 'Ranger'){
				v += 30;
			}
			else if (f.job === 'Warrior'){
				v += 40;
			}
			else if (f.job === 'Monk'){
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
		jobs.forEach(function(v, i){
			ids += '#create-' + v.split(' ').join('-');
			if (i < len-1){
				ids += ', ';
			}
		});
		$(ids).removeClass('disabled');
		// add active to selection
		var e = $(".select-class:not(.disabled)"),
			len = e.length;
		e = e.eq(~~(rand() * len));
		e.length && e.trigger('click');
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
		var obj = _.pick(create.form, [
			'gender', 'race', 'face'
		])
		obj.gender = obj.gender === 'Male' ? 0 : 1
		getElementById('create-portrait').src = my.getAvatarUrl(obj)
	}
	// private /////////////////////////////////////////////////
	function getCleanName(name) {
		return _.capitalize(_.map(name, char => create.whitelist.includes(char) ? char : '').join(''));
	}
})($, TweenMax, _);
