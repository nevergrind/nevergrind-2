var academy;
!function($, _, TweenMax, undefined) {
	academy = {
		getBodyHtml,
		trainSkill,
		TOTAL_SKILLS: 12,
		MAX_RANK: 7,
		selected: '',
	}
	var i, el, str, row, html, obj, rank, goldEl, skillData, reqColor, reqClass, reqText

	let selected = {
		index: -1,
		rank: '',
		cost: 0
	}
	let lastCost = 0
	const trainCosts = [0, 100, 250, 625, 1500, 3750, 9000, 22500]
	const reqLevel = [0, 1, 6, 12, 18, 24, 30, 39, 49]

	$('#root-various')
		.on('click', '.academy-train', handleRankClick)
		.on('click', '#train-buy', handleTrainBuy)
	///////////////////////////////////////////
	function handleTrainBuy() {
		info('handleTrainBuy', selected)
		if (!hasLevelRequired(selected.rank)) {
			ng.splitText('various-description', 'Ummm... '+ my.name +'? Do you have a hearing problem? I said you cannot begin training until you reach level '+ reqLevel[selected.rank] +'. I would suggest not spending so much time "experimenting" with illicit substances at the apothecary.')
			return
		}
		if (my.gold < selected.cost) {
			ng.splitText('various-description', 'Sorry, '+ my.name +'. It seems that the cost of this training is rather prohibitive for someone of your station in life. Come back when you\'ve scrounged together enough of your meager wages.')
			return
		}
		// TODO: level check later

		skillData = _.cloneDeep(my.getMyData())
		skillData.skills[selected.index] = selected.rank

		ng.lock(true)
		$.post(app.url + 'character/train-skill.php', {
			gold: my.gold - selected.cost,
			data: JSON.stringify(skillData)
		}).done(trainSkillSuccess)
			.always(ng.unlock)
	}
	function trainSkillSuccess() {
		my.skills[selected.index] = selected.rank
		town.setMyGold(my.gold - selected.cost)
		selected.cost = 0
		if (town.openVariousWindow === 'Academy') {
			querySelector('#academy-skill-' + selected.index).innerHTML = getSkillRowHtml(selected.index)
			setAcademyGold()
			ng.splitText('various-description', 'Congratulations, '+ my.name +'. You have completed your training for ' + skills.skillNames[selected.index] + ', Rank '+ selected.rank +'!')
		}
	}
	function handleRankClick(e) {
		selected = {
			index: _.pick(e.currentTarget.dataset, 'index').index,
			rank: _.pick(e.currentTarget.dataset, 'rank').rank * 1,
		}
		selected.cost = trainCosts[selected.rank]

		console.info('selected', selected)

		for (el of querySelectorAll('.academy-train')) {
			el.classList.remove('active')
		}
		this.classList.add('active')
		if (hasLevelRequired(selected.rank)) {
			ng.splitText('various-description', 'Training '+ skills.skillNames[selected.index] +' to Rank '+ selected.rank +' will cost '+ selected.cost +' gold. Would you like to complete this training?')
		}
		else {
			ng.splitText('various-description', 'You do not meet the level requirements for '+ skills.skillNames[selected.index] +', Rank '+ selected.rank +'. We can begin training once you reach level '+ reqLevel[selected.rank] +'.')
		}
		setAcademyGold()
	}
	function setAcademyGold() {
		obj = {
			value: lastCost
		}
		TweenMax.to(obj, .3, {
			value: selected.cost,
			onUpdate: updateStoreGold,
			onUpdateParams: [obj]
		})
	}
	function updateStoreGold(obj) {
		goldEl = querySelector('#town-value')
		lastCost = ~~obj.value
		if (goldEl !== null) goldEl.textContent = ~~obj.value
	}
	function getBodyHtml() {
		selected = {
			index: -1,
			rank: 0,
			cost: 0
		}
		// my.skills = my.skills.map(() => _.random(0, 7))

		str = '<div id="various-body" class="flex-column flex-max">' +
			'<div id="academy-skill-wrap" class="flex-column flex-max" >' +
				'<div id="academy-body" class="flex-column flex-max">' +
				getAllSkillRowHtml() +
				'</div>' +
			'</div>' +
			getTrainRow() +
		'</div>'
		return str
	}
	function getAllSkillRowHtml() {
		html = ''
		for (i=0; i<academy.TOTAL_SKILLS; i++) {
			//warn('row', i)
			html += '<div id="academy-skill-'+ i +'" class="academy-row flex-row flex-max" style="margin-bottom: 1rem">' +
				getSkillRowHtml(i) +
			'</div>'
		}
		return html
	}
	function getSkillRowHtml(i) {
		row = ''
		for (rank=1; rank<=academy.MAX_RANK; rank++) {
			if (rank === 1) {
				if (my.skills[i] >= rank) {
					//info('rank ZERO unlocked!', my.skills[i], rank)
					// skill unlocked
					row += '<div class="academy-skill-rank0 academy-rank0-unlocked">' +
						'<img class="academy-skill-img" src="images/skills/' + my.job +'/'+ i +'.png">'+
					'</div>'
				}
				else {
					// skill locked
					//warn('rank ZERO LOCKED!', my.skills[i], rank)
					row += '<div data-index="'+ i +'" data-rank="'+ rank +'" class="academy-skill-rank0 academy-rank0-locked academy-train">' +
						'<img class="academy-skill-lock no-pointer" src="images/ui/lock.png">' +
						'<img class="academy-skill-img academy-locked-skill" src="images/skills/' + my.job +'/'+ i +'.png">' +
						'<div class="academy-gold-row">' +
							'<i class="ra ra-gold-bar academy-gold-img"></i>' +
							'<div class="academy-train-cost">'+ trainCosts[rank] +'</div>' +
						'</div>' +
					'</div>'
				}
				if (my.skills[i] >= rank) row += '<div class="academy-skill-divider" style="flex: 2"></div>'
				else row += '<div class="academy-skill-divider" style="flex: 2; visibility: hidden"></div>'
			}
			else {
				if (my.skills[i] >= rank) {
					//info('rank > 1 GREATER!', my.skills[i], rank)
					// unlocked
					row += '<div class="flex-center" style="position: relative">' +
						'<div class="academy-skill-unlocked">' +
							'<i class="ra ra-broken-shield academy-shield"></i>'+
						'</div>' +
					'</div>'
				}
				else if (my.skills[i] === rank - 1) {
					info('rank EQUAL!', my.skills[i], rank)
					warn('rank EQUAL!', reqLevel[rank], my.level)
					if (hasLevelRequired(rank)) {
						reqColor = ''
						reqClass = ''
						reqText = ''
					}
					else {
						reqColor = 'color: #f55;'
						reqClass = 'academy-buy-restricted'
						reqText = 'color: #ff1611;'
					}
					// prompt buy
					row += '<div class="flex-center" style="position: relative">' +
						'<div data-index="'+ i +'" data-rank="'+ rank +'" class="academy-skill-buy academy-train '+reqClass +'">' +
							'<i class="ra ra-crossed-swords academy-cross" style="'+ reqColor +'"></i>'+
						'</div>' +
						'<div class="academy-gold-row">' +
							'<i class="ra ra-gold-bar academy-gold-img"></i>' +
							'<div class="academy-train-cost" style="'+ reqText +'">'+ trainCosts[rank] +'</div>' +
						'</div>' +
					'</div>'
				}
				else {
					//warn('rank > 1 LESS!', my.skills[i], rank)
					// locked
					row += '<div class="flex-center" style="position: relative">' +
						'<div class="academy-skill-locked">' +
							'<img class="academy-lock" src="images/ui/lock.png">'+
						'</div>' +
					'</div>'
				}
				if (rank < academy.MAX_RANK) {
					if (my.skills[i] >= rank) row += '<div class="academy-skill-divider"></div>'
					else row += '<div class="academy-skill-divider" style="visibility: hidden"></div>'
				}
			}
		}

		return row

	}
	function hasLevelRequired(rank) {
		return my.level >= reqLevel[rank]
	}
	function getTrainRow() {
		return `<div id="buy-sell-row" class="flex-row align-center" style="margin-bottom: 0">
			<div id="town-value-wrap" class="flex-row">
				<i style="margin-top: .2rem" class="ra ra-gold-bar"></i>
				<div id="town-value">0</div>
			</div>
			<div class="flex-row" style="height: 100%">
				<div id="train-buy" class="ng-btn merchant-btn">Train</div>
			</div>
		</div>`
	}
	function trainSkill() {
		if (!academy.selected) {
			ng.splitText('various-description', 'Select a skill to train first!')
		}
		else {
			ng.splitText('various-description', 'Do you want to train ' + academy.selected + '?')
		}
	}
}($, _, TweenMax);