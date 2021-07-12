var academy;
!function($, _, TweenMax, undefined) {
	academy = {
		getBodyHtml,
		trainSkill,
		TOTAL_SKILLS: 12,
		MAX_RANK: 7,
		selected: '',
	}
	var i, el, str, row, html, obj, goldEl, skillData

	let selected = {
		index: -1,
		rank: '',
		cost: 0
	}
	let lastCost = 0
	const trainCosts = [0, 100, 250, 625, 1500, 3750, 9000, 22500]
	const reqLevel = [0, 1, 6, 12, 18, 24, 30, 39, 49] // [0, 5, 30, 60, 90, 120, 150, 195, 245]
	// [7,7,7,7,7,7,7,7,7,7,7,7]
	// [0,0,0,0,0,0,0,0,0,0,0,0]


	$('#root-various')
		.on('click', '.academy-train', handleRankClick)
		.on('click', '#train-buy', handleTrainBuy)
	///////////////////////////////////////////
	function handleTrainBuy() {
		// console.info('handleTrainBuy', selected)
		if (!selected.cost) {
			ng.splitText('various-description', 'Please clarify which skill you would like to train.')
			return
		}
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
		audio.playSound('upgrade')
		selected.cost = 0
		if (town.openVariousWindow === 'Academy') {
			querySelector('#academy-skill-' + selected.index).innerHTML = getSkillRowHtml(selected.index)
			setAcademyGold()
			ng.splitText('various-description', 'Congratulations, '+ my.name +'. You have completed your training for ' + skills.skillNames[selected.index] + ', Rank '+ selected.rank +'!')
		}
		button.updateBtnEnabled()
	}
	function handleRankClick(e) {
		selected = {
			index: _.pick(e.currentTarget.dataset, KEYS.INDEX).index,
			rank: _.pick(e.currentTarget.dataset, KEYS.RANK).rank * 1,
		}
		selected.cost = trainCosts[selected.rank]

		// console.info('selected', selected)

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
		audio.playSound('click-19')
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
			'<div id="academy-body" class="flex-column flex-max">' +
				'<div id="academy-skill-wrap">' +
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
			// console.warn('row', i)
			html += '<div id="academy-skill-'+ i +'" class="academy-row stag-blue">' +
				getSkillRowHtml(i) +
			'</div>'
		}
		return html
	}
	function getSkillRowHtml(i) {
		row = ''
		let skillData = skills[my.job][i]
		let nextRank = my.skills[i] + 1
		row += '<div id="academy-skill-icon-'+ i +'" class="academy-skill-img-base skill-btn-tooltip">'+
				'<img class="academy-skill-img" src="images/skills/' + my.job +'/'+ i +'.png?">' +
			'</div>' +
			// row 2
			'<div class="flex-column flex-max" style="margin-left: .5rem; justify-content: center">' +
				'<div class="academy-skill-name'+
					(my.skills[i] === 0 ? ' con-grey' : '')
				+'">'+ skillData.name +'</div>'
				if (my.skills[i] > 0) {
					row += '<div class="academy-skill-rank">Current Rank: '+ my.skills[i] +'</div>'
				}
			row += '</div>' +
			// col 3
			'<div class="flex-column flex-center text-center" style="width: 4rem">'
				if (!hasLevelRequired(nextRank)) {
					row += '<div class="academy-skill-next" style="color: #f22">'+
						'<div>Requires</div>'+
						'<div>Level '+ reqLevel[nextRank] +'</div>' +
					'</div>'
				}
				else {
					if (my.skills[i] === 0) {
						row += '<div class="academy-skill-next">'+
							'<div>Learn Skill:</div>'+
							'<div class="flex-center">'+
								'<img class="academy-gold-img" src="images/ui/gold-bar.png">'+ trainCosts[nextRank] + '</div>' +
						'</div>'
					}
					else if (nextRank <= 7) {
						row += '<div class="academy-skill-next">'+
							'<div>Next Rank:</div>'+
							'<div class="flex-center">'+
								'<img class="academy-gold-img" src="images/ui/gold-bar.png">'+ trainCosts[nextRank] +
							'</div>' +
						'</div>'
					}
					else {
						row += '<div class="academy-skill-next">Skill Maxed</div>'
					}
				}
			row += '</div>' +
			// col 4
			'<div class="academy-skill-base">'
				if (hasLevelRequired(nextRank)) {
					if (nextRank <= 7) {
						row += '<div class="academy-train-label">Train</div>'+
							'<img data-index="'+ i +'" data-rank="'+ nextRank +'" class="academy-swords academy-train" src="images/ui/academy-swords.png">'
					}
					else {
						row += '<div class="academy-train-label">Maxed</div>'+
							'<img class="academy-shield" src="images/ui/academy-shield.png">'
					}
				}
				else {
					row += '<div class="academy-train-label">Locked</div>'+
						'<img class="academy-lock" src="images/ui/academy-lock.png">'
				}
			row += '</div>'
		return row

	}
	function hasLevelRequired(rank) {
		return my.level >= reqLevel[rank]
	}
	function getTrainRow() {
		return `<div id="buy-sell-row" class="flex-row align-center" style="margin-bottom: 0">
			<div id="town-value-wrap" class="flex-row">
				<img class="store-gold-bar" src="images/ui/gold-bar.png">
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