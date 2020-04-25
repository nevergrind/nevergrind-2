var academy;
!function($, _, TweenMax, undefined) {
	academy = {
		getBodyHtml,
		trainSkill,
		TOTAL_SKILLS: 12,
		selected: '',
	}
	/**
	 * skills need:
	 * img job-index
	 * name
	 * rank
	 */
	var i, el, str, row, html, obj, rank, goldEl
	
	let selected = {
		index: -1,
		rank: '',
		cost: 0
	}
	let lastCost = 0
	const trainCosts = [0, 100, 250, 625, 1500, 3750, 9000, 22500]

	$('#root-various')
		.on('click', '.academy-train', handleAcademyTrain)
		.on('click', '#train-buy', handleTrainSkill)
	///////////////////////////////////////////
	function handleTrainSkill() {
		info('handleTrainSkill', selected)
		selected.cost = 99999999999999999999999999
		if (my.gold < selected.cost) {
			ng.splitText('various-description', 'Sorry, '+ my.name +'. It seems that the cost of this training is rather prohibitive for someone of your station in life. Come back when you\'ve scrounged together enough of your meager wages.')
			return
		}
		// saves character data AND subtracts gold
		//saveCharacterData()
		/*

		$.post(app.url + 'character/save-data.php', {
			cost: selected.cost,
			data: JSON.stringify(_.pick(my, my.dataProps))
		})
		 */
	}
	function handleAcademyTrain(e) {
		selected = {
			index: _.pick(e.currentTarget.dataset, 'index').index,
			rank: _.pick(e.currentTarget.dataset, 'rank').rank,
		}
		selected.cost = trainCosts[selected.rank * 1]

		console.info('selected', selected)

		for (el of querySelectorAll('.academy-train')) {
			el.classList.remove('active')
		}
		this.classList.add('active')
		ng.splitText('various-description', 'Training '+ skills.skillNames[selected.index] +' to Rank '+ selected.rank +' will cost '+ selected.cost +' gold!')
		setStoreGold()
	}
	function setStoreGold() {
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
		selected.index = ''
		selected.rank = ''
		selected.cost = 0
		my.skills = my.skills.map(() => _.random(0, 7))

		str = '<div id="various-body" class="flex-column flex-max">' +
			'<div id="academy-skill-wrap" class="flex-column flex-max" >' +
				'<div id="academy-body" class="flex-column flex-max" style="margin: .1rem .2rem">' +
				getAllSkillRowHtml() +
				'</div>' +
			'</div>' +
			getTrainRow() +
		`</div>`
		return str
	}
	function getAllSkillRowHtml() {
		html = ''
		for (i=0; i<academy.TOTAL_SKILLS; i++) {
			//warn('row', i)
			html += '<div id="academy-skill-'+ i +'" class="academy-row flex-row flex-max">' +
				getSkillRowHtml(i, rank) +
			'</div>'
		}
		return html
	}
	function getSkillRowHtml(i, rank) {
		row = ''
		for (rank=1; rank<=7; rank++) {
			if (rank === 1) {
				if (my.skills[i] >= rank) {
					//info('rank ZERO unlocked!', my.skills[i], rank)
					// skill unlocked
					row += '<div class="academy-skill-rank0">' +
						'<img class="academy-skill-img" src="images/skills/' + my.job +'-'+ i +'.png">'+
					'</div>'
				}
				else {
					// skill locked
					//warn('rank ZERO LOCKED!', my.skills[i], rank)
					row += '<div data-index="'+ i +'" data-rank="'+ rank +'" class="academy-skill-rank0 academy-train">' +
						'<img class="academy-skill-lock no-pointer" src="images/ui/lock.png">' +
						'<img class="academy-skill-img academy-locked-skill" src="images/skills/' + my.job +'-'+ i +'.png">' +
						'<div class="academy-gold-row">' +
							'<img class="academy-gold-img" src="images/ui/gold.png">' +
							'<div class="academy-train-cost">'+ trainCosts[rank] +'</div>' +
						'</div>' +
					'</div>'
				}
				if (my.skills[i] > rank) row += '<div class="academy-skill-divider" style="flex: 1.5"></div>'
				else row += '<div class="academy-skill-divider" style="flex: 1.5; visibility: hidden"></div>'
			}
			else {
				if (my.skills[i] >= rank) {
					//info('rank > 1 GREATER!', my.skills[i], rank)
					// unlocked
					row += '<div class="academy-skill-rank-wrap">' +
						'<div class="academy-skill-unlocked">' +
							'<img class="academy-shield" src="images/ui/shield.png">'+
						'</div>' +
					'</div>'
				}
				else if (my.skills[i] === rank - 1) {
					//info('rank > 1 EQUAL!', my.skills[i], rank)
					// prompt buy
					row += '<div class="academy-skill-rank-wrap">' +
						'<div data-index="'+ i +'" data-rank="'+ rank +'" class="academy-skill-buy academy-train">' +
							'<img class="academy-cross" src="images/ui/cross.png">'+
						'</div>' +
						'<div class="academy-gold-row">' +
							'<img class="academy-gold-img" src="images/ui/gold.png">' +
							'<div class="academy-train-cost">'+ trainCosts[rank] +'</div>' +
						'</div>' +
					'</div>'
				}
				else {
					//warn('rank > 1 LESS!', my.skills[i], rank)
					// locked
					row += '<div class="academy-skill-rank-wrap">' +
						'<div class="academy-skill-locked">' +
							'<img class="academy-lock" src="images/ui/lock.png">'+
						'</div>' +
					'</div>'
				}
				if (rank < 7) {
					if (my.skills[i] >= rank) row += '<div class="academy-skill-divider"></div>'
					else row += '<div class="academy-skill-divider" style="visibility: hidden"></div>'
				}
			}
		}

		return row

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