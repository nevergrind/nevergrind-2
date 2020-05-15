// global objects
let buff = []
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
}
timers.skillCooldowns = []
for (var i=0; i<12; i++) {
	// skill cooldowns
	timers.skillCooldowns[i] = 1
}
// where app code is invoked upon initial load
login.init()
ng.init()
audio.init()
//audio.gameMusicInit();
context.init()
mission.init()
$('script').remove()