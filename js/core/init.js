// global objects
let buff = {
	isSuppressing: []
}
let items = {
	inv: [],
	eq: [],
	bank: [],
	merchant: [],
	blacksmith: [],
	apothecary: [],
	tavern: [],
	tradeTo: [],
	tradeFrom: [],
}
let timers = {
	primaryAttack: 1,
	secondaryAttack: 1,
	hpPotion: 1,
	mpPotion: 1,
	spPotion: 1,
	globalCooldown: 1,
	castBar: 1,
}
timers.skillCooldowns = []
for (var i=0; i<12; i++) {
	// skill cooldowns
	timers.skillCooldowns[i] = 1
}
timers.mobAttack = []
for (var i=0; i<mob.max; i++) {
	// skill cooldowns
	timers.mobAttack[i] = delayedCall(0, '')
}
let delays = {
	primaryAttack: delayedCall(0, ''),
	secondaryAttack: delayedCall(0, ''),
}
// where app code is invoked upon initial load
login.init()
ng.init()
audio.init()
//audio.gameMusicInit();
context.init()
mission.init()
$('script').remove()