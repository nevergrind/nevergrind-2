var loading;
!function($, _, TweenMax, Power0, Power2, undefined) {
	loading = {
		index: 0,
		isLoading: false,
		tweens: [],
		setRandomImage,
		startLoading,
		stopLoading,
		setLoadingMessage,
		killAllTweens,
	}
	///////////////////////////////////////////
	loading.tips = [
		'Ranged archery attacks are all considered piercing attacks, which cannot be riposted.',
		'Enemy ripostes are considered piercing attacks. Piercing attacks cannot be dodged, parried, or riposted.',
		'Don\'t confuse piercing weapons and piercing attacks! Piercing weapons are a type of weapon skill. Piercing attacks bypass passive defensive skills.',
		'Blocking with a shield is a great way to improve survivability. Blocking cannot be pierced unlike other passive defensive skills.',
		'When you successfully block with a shield, you reduce all damage received by 50%. Unlike other defensive skill checks, it does not depend on passive skills and it applies to all damage types.',
		'Ranged attacks hit the back row for full damage. This is one of the key benefits of playing a Ranger. Full physical damage to caster mobs in the back row can prove very useful.',
		'All melee damage to the back row is reduced by 50%. Take this into consideration when choosing which target to attack first.',
		'Each monster has its own threat list. Managing how much each mob hates you is important to your survival.',
		'Some skills allow you to reduce how much each monster hates you. Highly efficient parties manage their threat effectively.',
		'You cannot parry or riposte while casting a spell.',
		'Shields will help any class survive longer. When you block a shield reduces melee damage by an additional 25%.',
		'You can cancel a spell by pressing the space bar.',
		'If a mob hits you while you are casting a spell, you will experience spell knockback which makes your spell take a longer time to cast. This can make life difficult for a caster, but other players can help take the heat off of you.',
		'Be wary about training spells that require skills that you have not sufficiently practiced. High-level spells may frequently fizzle if your alteration, conjuration, or evocation are not adequate.',
		'Improving your alteration, conjuration, and evocation will help you channel your spells while taking a beating from mobs. Failed channeling rolls will result in longer cast times.',
		'The undead take extra damage from blunt weapons.',
		'Beasts take extra damage from slashing weapons.',
		'Mystical creatures take extra damage from piercing weapons.',
	]

	//////////////
	function startLoading() {
		let loadDuration = 12
		if (Config.fastQuestTransitions) {
			loadDuration = 0
		}
		loading.isLoading = true
		TweenMax.set('#scene-loading', {
			display: 'flex',
			opacity: 0
		})
		let totalColorPoints = 96
		const red = _.random(0, 48)
		const green = _.random(0, 48)
		totalColorPoints = totalColorPoints - red - green
		if (totalColorPoints < 0) totalColorPoints = 0
		const blue = _.random(0, 64) + totalColorPoints
		TweenMax.to('#scene-loading', .5, {
			opacity: 1,
		})
		loading.tweens.push(TweenMax.to('#loading-bg', 1.5, {
			startAt: {
				background: 'radial-gradient(farthest-side at 50% 50%, rgba('+
					red +','+ green +','+ blue +
				'), rgba(0,0,0))',
				scale: 1,
			},
			scale: .95,
			yoyo: true,
			repeat: -1,
			ease: Power1.easeInOut
		}))
		loading.tweens.push(TweenMax.to('#loading-logo-gem' , .5, {
			startAt: { filter: 'brightness(.7)' },
			repeat: -1,
			yoyo: true,
			ease: Power0.easeIn,
			filter: 'brightness(2)'
		}))
		loading.tweens.push(TweenMax.to('#loading-logo-fg', 1.5, {
			startAt: { webkitMaskPositionX: '-40rem', },
			webkitMaskPositionX: '40rem',
			ease: Power2.easeInOut,
			repeat: -1,
			repeatDelay: 3,
		}))
		TweenMax.to('#loading-img', loadDuration, {
			startAt: { scale: 1 },
			scale: 1.2,
			ease: Power0.easeIn
		})
		/*TweenMax.to(['#loading-logo', '#loading-logo-fg', '#loading-logo-gem'], loadDuration, {
			y: '300%',
			ease: Power0.easeIn
		})*/
		loading.setLoadingMessage()
		delayedCall(loadDuration, loading.stopLoading)
	}

	function stopLoading() {
		loading.isLoading = false
		audio.playSound('sit')
		TweenMax.to('#scene-loading', 1, {
			opacity: 0,
			onComplete: () => {
				loading.killAllTweens()
				TweenMax.set('#scene-loading', CSS.DISPLAY_NONE)
				querySelector('#loading-msg').innerHTML = ''
			}
		})
	}

	function setLoadingMessage() {
		const msg = _.sample(loading.tips)
		ng.splitText('loading-msg', msg)
	}

	function setRandomImage() {
		const img = _.sample(zones[mission.id].mobs)
		const frame = _.random(1, 90)
		// querySelector('#loading-img').src = 'images/loading/' + img + '.jpg'
		querySelector('#loading-img').src = 'mobs/' + img + '/'+ frame +'.png'
	}

	function killAllTweens() {
		loading.tweens.forEach(t => {
			t.kill()
		})
	}
}($, _, TweenMax, Power0, Power2);