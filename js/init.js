// reserved objects
var buff = []
var items = {
	inv: [],
	eq: [],
	bank: [],
	merchant: [],
	blacksmith: [],
	apothecary: [],
	tavern: []
}
// where app code is invoked upon initial load
login.init()
ng.init()
audio.init()
//audio.gameMusicInit();
context.init()
$('script').remove()