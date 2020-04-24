var academy;
!function($, _, TweenMax, undefined) {
	academy = {
		getBodyHtml,
		trainSkill,
		TOTAL_SKILLS: 12,
		selectedSkill: '',
	}
	/**
	 * skills need:
	 * img job-index
	 * name
	 * rank
	 */
	var i, str, row, html, icon, rank
	///////////////////////////////////////////
	function getBodyHtml() {
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
			warn('row', i)
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
					info('rank ZERO unlocked!', my.skills[i], rank)
					// skill unlocked
					row += '<div class="academy-skill-rank0">' +
						'<img class="academy-skill-img" src="images/skills/' + my.job +'-'+ i +'.png">'+
					'</div>'
				}
				else {
					// skill locked
					warn('rank ZERO LOCKED!', my.skills[i], rank)
					row += '<div class="academy-skill-rank0">' +
						'<img class="academy-skill-lock" src="images/ui/lock.png">' +
						'<img class="academy-skill-img academy-locked-skill" src="images/skills/' + my.job +'-'+ i +'.png">' +
						'<div class="academy-gold-row">' +
							'<img class="academy-gold-img" src="images/ui/gold.png">' +
							'<div class="academy-train-cost">100</div>' +
						'</div>' +
					'</div>'
				}
				if (my.skills[i] > rank) {
					row += '<div class="academy-skill-divider" style="flex: 1.5"></div>'
				}
				else {
					row += '<div class="academy-skill-divider" style="flex: 1.5; visibility: hidden"></div>'
				}
			}
			else {
				if (my.skills[i] >= rank) {
					info('rank > 1 GREATER!', my.skills[i], rank)
					// unlocked
					row += '<div class="academy-skill-rank-wrap">' +
						'<div class="academy-skill-unlocked">' +
							'<img class="academy-shield" src="images/ui/shield.png">'+
						'</div>' +
					'</div>'
				}
				else if (my.skills[i] === rank - 1) {
					info('rank > 1 EQUAL!', my.skills[i], rank)
					// prompt buy
					row += '<div class="academy-skill-rank-wrap">' +
						'<div class="academy-skill-buy">' +
							'<img class="academy-cross" src="images/ui/cross.png">'+
						'</div>' +
						'<div class="academy-gold-row">' +
							'<img class="academy-gold-img" src="images/ui/gold.png">' +
							'<div class="academy-train-cost">100</div>' +
						'</div>' +
					'</div>'
				}
				else {
					warn('rank > 1 LESS!', my.skills[i], rank)
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
				<div id="town-buy" class="ng-btn merchant-btn">Train</div>
			</div>
		</div>`
	}
	function trainSkill() {
		if (!academy.selectedSkill) {
			ng.splitText('various-description', 'Select a skill to train first!')
		}
		else {
			ng.splitText('various-description', 'Do you want to train ' + academy.selectedSkill + '?')
		}
	}
}($, _, TweenMax);