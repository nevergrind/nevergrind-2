var mobs = [];
mobs.images = {
	'balrog': {
		imgW: 2000,
		imgH: 1200,
		imgCy: 360,
		width: 2000,
		height: 1200,
		yFloor: -195,
		yoyo: true,
		cache: [],
		speed: .05,
		barAliveBottom: 620,
		barDeathBottom: 240,
		shadowBottom: 40,
		shadowWidth: 400,
		shadowHeight: 80,
		clickAliveY: 20,
		clickAliveW: 230,
		clickAliveH: 500,
		clickDeadY: -70,
		clickDeadW: 400,
		clickDeadH: 200,
		enableSecondary: true,
		enableSpecial: true
	},
	'ice-golem': {
		imgW: 1200,
		imgH: 1000,
		imgCy: 360,
		width: 960,
		height: 800,
		yFloor: -140,
		yoyo: false,
		cache: [],
		speed: .045,
		barAliveBottom: 580,
		barDeathBottom: 300,
		shadowBottom: 40,
		shadowWidth: 370,
		shadowHeight: 100,
		clickAliveY: 40,
		clickAliveW: 300,
		clickAliveH: 500,
		clickDeadY: -50,
		clickDeadW: 500,
		clickDeadH: 250,
		enableSecondary: true,
		enableSpecial: true
	},
	'stone-golem': {
		imgW: 1200,
		imgH: 1000,
		imgCy: 360,
		width: 960,
		height: 800,
		yFloor: -140,
		yoyo: false,
		cache: [],
		speed: .045,
		barAliveBottom: 580,
		barDeathBottom: 300,
		shadowBottom: 40,
		shadowWidth: 370,
		shadowHeight: 100,
		clickAliveY: 40,
		clickAliveW: 300,
		clickAliveH: 500,
		clickDeadY: -50,
		clickDeadW: 500,
		clickDeadH: 250,
		enableSecondary: true,
		enableSpecial: true
	},
	'iron-golem': {
		imgW: 1200,
		imgH: 1000,
		imgCy: 360,
		width: 960,
		height: 800,
		yFloor: -140,
		yoyo: false,
		cache: [],
		speed: .045,
		barAliveBottom: 580,
		barDeathBottom: 300,
		shadowBottom: 40,
		shadowWidth: 370,
		shadowHeight: 100,
		clickAliveY: 40,
		clickAliveW: 300,
		clickAliveH: 500,
		clickDeadY: -50,
		clickDeadW: 500,
		clickDeadH: 250,
		enableSecondary: true,
		enableSpecial: true
	},
	'treant': {
		imgW: 1300,
		imgH: 1200,
		imgCy: 420,
		width: 1170,
		height: 1080,
		yFloor: -135,
		yoyo: false,
		cache: [],
		speed: .05,
		barAliveBottom: 750,
		barDeathBottom: 270,
		shadowBottom: 40,
		shadowWidth: 420,
		shadowHeight: 70,
		clickAliveY: 30,
		clickAliveW: 200,
		clickAliveH: 600,
		clickDeadY: -80,
		clickDeadW: 350,
		clickDeadH: 200,
		enableSecondary: true,
		enableSpecial: true
	},
	'spider': {
		imgW: 1000,
		imgH: 1000,
		imgCy: 190,
		width: 1000,
		height: 1000,
		yFloor: -190,
		yoyo: false,
		cache: [],
		speed: .045,
		barAliveBottom: 380,
		barDeathBottom: 270,
		shadowBottom: 40,
		shadowWidth: 900,
		shadowHeight: 100,
		clickAliveY: 10,
		clickAliveW: 800,
		clickAliveH: 280,
		clickDeadY: 50,
		clickDeadW: 500,
		clickDeadH: 180,
		enableSecondary: true,
		enableSpecial: true
	},
	'wolf': {
		imgW: 1000,
		imgH: 1000,
		imgCy: 240,
		width: 600,
		height: 600,
		yFloor: -40,
		yoyo: true,
		cache: [],
		speed: .045,
		barAliveBottom: 390,
		barDeathBottom: 220,
		shadowBottom: 20,
		shadowWidth: 200,
		shadowHeight: 100,
		clickAliveY: 10,
		clickAliveW: 130,
		clickAliveH: 330,
		clickDeadY: 0,
		clickDeadW: 300,
		clickDeadH: 120,
		enableSecondary: false,
		enableSpecial: true
	},
	'rat': {
		imgW: 1100,
		imgH: 1000,
		imgCy: 135,
		width: 550,
		height: 500,
		yFloor: -70,
		yoyo: false,
		cache: [],
		speed: .045,
		barAliveBottom: 260,
		barDeathBottom: 200,
		shadowBottom: 40,
		shadowWidth: 200,
		shadowHeight: 80,
		clickAliveY: 30,
		clickAliveW: 150,
		clickAliveH: 180,
		clickDeadY: 20,
		clickDeadW: 210,
		clickDeadH: 120,
		enableSecondary: false,
		enableSpecial: true
	},
	'snake': {
		imgW: 1000,
		imgH: 1000,
		imgCy: 160,
		width: 500,
		height: 500,
		yFloor: -60,
		yoyo: false,
		cache: [],
		speed: .045,
		barAliveBottom: 320,
		barDeathBottom: 200,
		shadowBottom: 40,
		shadowWidth: 200,
		shadowHeight: 60,
		clickAliveY: 30,
		clickAliveW: 150,
		clickAliveH: 230,
		clickDeadY: 0,
		clickDeadW: 150,
		clickDeadH: 100,
		enableSecondary: false,
		enableSpecial: true
	},
	'dragonkin': {
		imgW: 1300,
		imgH: 1300,
		imgCy: 340,
		width: 845,
		height: 845,
		yFloor: -70,
		yoyo: false,
		cache: [],
		speed: .055,
		barAliveBottom: 510,
		barDeathBottom: 240,
		shadowBottom: 40,
		shadowWidth: 360,
		shadowHeight: 100,
		clickAliveY: 30,
		clickAliveW: 200,
		clickAliveH: 440,
		clickDeadY: -50,
		clickDeadW: 250,
		clickDeadH: 200,
		enableSecondary: true,
		enableSpecial: true
	},
	'lizardman': {
		imgW: 1100,
		imgH: 1000,
		imgCy: 350,
		width: 880,
		height: 800,
		yFloor: -130,
		yoyo: true,
		cache: [],
		speed: .045,
		barAliveBottom: 520,
		barDeathBottom: 250,
		shadowBottom: 40,
		shadowWidth: 320,
		shadowHeight: 60,
		clickAliveY: 20,
		clickAliveW: 160,
		clickAliveH: 450,
		clickDeadY: 0,
		clickDeadW: 300,
		clickDeadH: 140,
		enableSecondary: true,
		enableSpecial: true
	},
	'dragon': {
		imgW: 3000,
		imgH: 1500,
		imgCy: 240,
		width: 3000,
		height: 1500,
		yFloor: -80,
		yoyo: true,
		cache: [],
		speed: .055,
		barAliveBottom: 650,
		barDeathBottom: 350,
		shadowBottom: 40,
		shadowWidth: 640,
		shadowHeight: 160,
		clickAliveY: -50,
		clickAliveW: 500,
		clickAliveH: 600,
		clickDeadY: 0,
		clickDeadW: 500,
		clickDeadH: 250,
		enableSecondary: true,
		enableSpecial: true
	},
	'dragon-fire': {
		imgW: 2900,
		imgH: 1500,
		imgCy: 240,
		width: 2900,
		height: 1500,
		yFloor: -150,
		yoyo: true,
		cache: [],
		speed: .055,
		barAliveBottom: 820,
		barDeathBottom: 550,
		shadowBottom: 20,
		shadowWidth: 800,
		shadowHeight: 160,
		clickAliveY: 0,
		clickAliveW: 500,
		clickAliveH: 750,
		clickDeadY: 0,
		clickDeadW: 700,
		clickDeadH: 500,
		enableSecondary: true,
		enableSpecial: true
	},
	'dragon-poison': {
		imgW: 2500,
		imgH: 1500,
		imgCy: 240,
		width: 2500,
		height: 1500,
		yFloor: -150,
		yoyo: true,
		cache: [],
		speed: .055,
		barAliveBottom: 700,
		barDeathBottom: 350,
		shadowBottom: 20,
		shadowWidth: 800,
		shadowHeight: 160,
		clickAliveY: 0,
		clickAliveW: 400,
		clickAliveH: 600,
		clickDeadY: 0,
		clickDeadW: 600,
		clickDeadH: 300,
		enableSecondary: true,
		enableSpecial: true
	},
	'dragon-frost': {
		imgW: 2900,
		imgH: 1500,
		imgCy: 240,
		width: 2900,
		height: 1500,
		yFloor: -150,
		yoyo: true,
		cache: [],
		speed: .055,
		barAliveBottom: 800,
		barDeathBottom: 500,
		shadowBottom: 40,
		shadowWidth: 800,
		shadowHeight: 160,
		clickAliveY: 0,
		clickAliveW: 420,
		clickAliveH: 700,
		clickDeadY: 0,
		clickDeadW: 700,
		clickDeadH: 400,
		enableSecondary: true,
		enableSpecial: true
	},
	'dragon-plains': {
		imgW: 3000,
		imgH: 1500,
		imgCy: 240,
		width: 3000,
		height: 1500,
		yFloor: -150,
		yoyo: true,
		cache: [],
		speed: .055,
		barAliveBottom: 650,
		barDeathBottom: 400,
		shadowBottom: 40,
		shadowWidth: 700,
		shadowHeight: 140,
		clickAliveY: 0,
		clickAliveW: 420,
		clickAliveH: 600,
		clickDeadY: 0,
		clickDeadW: 700,
		clickDeadH: 330,
		enableSecondary: true,
		enableSpecial: true
	},
	'dragon-water': {
		imgW: 3000,
		imgH: 1500,
		imgCy: 240,
		width: 3000,
		height: 1500,
		yFloor: -230,
		yoyo: true,
		cache: [],
		speed: .055,
		barAliveBottom: 720,
		barDeathBottom: 450,
		shadowBottom: 40,
		shadowWidth: 700,
		shadowHeight: 140,
		clickAliveY: 0,
		clickAliveW: 420,
		clickAliveH: 640,
		clickDeadY: 0,
		clickDeadW: 700,
		clickDeadH: 330,
		enableSecondary: true,
		enableSpecial: true
	},
	'dragon-forest': {
		imgW: 3000,
		imgH: 1500,
		imgCy: 240,
		width: 3000,
		height: 1500,
		yFloor: -140,
		yoyo: true,
		cache: [],
		speed: .055,
		barAliveBottom: 800,
		barDeathBottom: 480,
		shadowBottom: 20,
		shadowWidth: 700,
		shadowHeight: 140,
		clickAliveY: 0,
		clickAliveW: 420,
		clickAliveH: 680,
		clickDeadY: 0,
		clickDeadW: 700,
		clickDeadH: 330,
		enableSecondary: true,
		enableSpecial: true
	},
	'dragon-desert': {
		imgW: 3000,
		imgH: 1500,
		imgCy: 240,
		width: 3000,
		height: 1500,
		yFloor: -190,
		yoyo: true,
		cache: [],
		speed: .055,
		barAliveBottom: 740,
		barDeathBottom: 440,
		shadowBottom: 20,
		shadowWidth: 700,
		shadowHeight: 140,
		clickAliveY: 0,
		clickAliveW: 420,
		clickAliveH: 680,
		clickDeadY: 0,
		clickDeadW: 700,
		clickDeadH: 330,
		enableSecondary: true,
		enableSpecial: true
	},
	'ghoul': {
		imgW: 900,
		imgH: 1000,
		imgCy: 350,
		width: 630,
		height: 700,
		yFloor: -80,
		yoyo: true,
		cache: [],
		speed: .045,
		barAliveBottom: 510,
		barDeathBottom: 210,
		shadowBottom: 40,
		shadowWidth: 320,
		shadowHeight: 40,
		clickAliveY: 30,
		clickAliveW: 270,
		clickAliveH: 450,
		clickDeadY: -50,
		clickDeadW: 250,
		clickDeadH: 140,
		enableSecondary: true,
		enableSpecial: true
	},
	'mummy': {
		imgW: 800,
		imgH: 1000,
		imgCy: 370,
		width: 560,
		height: 700,
		yFloor: -30,
		yoyo: false,
		cache: [],
		speed: .04,
		barAliveBottom: 550,
		barDeathBottom: 210,
		shadowBottom: 40,
		shadowWidth: 260,
		shadowHeight: 60,
		clickAliveY: 40,
		clickAliveW: 180,
		clickAliveH: 480,
		clickDeadY: 0,
		clickDeadW: 160,
		clickDeadH: 120,
		enableSecondary: true,
		enableSpecial: true
	},
	'skeleton': {
		imgW: 900,
		imgH: 1000,
		imgCy: 340,
		width: 720,
		height: 800,
		yFloor: -30,
		yoyo: false,
		cache: [],
		speed: .045,
		barAliveBottom: 520,
		barDeathBottom: 240,
		shadowBottom: 40,
		shadowWidth: 280,
		shadowHeight: 60,
		clickAliveY: 30,
		clickAliveW: 150,
		clickAliveH: 430,
		clickDeadY: 50,
		clickDeadW: 350,
		clickDeadH: 100,
		enableSecondary: true,
		enableSpecial: true
	},
	'zombie': {
		imgW: 900,
		imgH: 1000,
		imgCy: 400,
		width: 630,
		height: 700,
		yFloor: -15,
		yoyo: true,
		cache: [],
		speed: .045,
		barAliveBottom: 590,
		barDeathBottom: 230,
		shadowBottom: 40,
		shadowWidth: 230,
		shadowHeight: 70,
		clickAliveY: 30,
		clickAliveW: 160,
		clickAliveH: 520,
		clickDeadY: 10,
		clickDeadW: 240,
		clickDeadH: 150,
		enableSecondary: true,
		enableSpecial: false
	},
	'vampire': {
		imgW: 1000,
		imgH: 1000,
		imgCy: 350,
		width: 650,
		height: 650,
		yFloor: -60,
		yoyo: true,
		cache: [],
		speed: .04,
		barAliveBottom: 510,
		barDeathBottom: 230,
		shadowBottom: 40,
		shadowWidth: 300,
		shadowHeight: 60,
		clickAliveY: 40,
		clickAliveW: 200,
		clickAliveH: 420,
		clickDeadY: -50,
		clickDeadW: 250,
		clickDeadH: 200,
		enableSecondary: true,
		enableSpecial: true
	},
	'goblin': {
		imgW: 1000,
		imgH: 1000,
		imgCy: 250,
		width: 700,
		height: 700,
		yFloor: -40,
		yoyo: false,
		cache: [],
		speed: .042,
		barAliveBottom: 400,
		barDeathBottom: 220,
		shadowBottom: 40,
		shadowWidth: 200,
		shadowHeight: 40,
		clickAliveY: 50,
		clickAliveW: 150,
		clickAliveH: 330,
		clickDeadY: 40,
		clickDeadW: 300,
		clickDeadH: 100,
		enableSecondary: true,
		enableSpecial: true
	},
	'hobgoblin': {
		imgW: 1000,
		imgH: 1000,
		imgCy: 340,
		width: 1000,
		height: 1000,
		yFloor: -120,
		yoyo: false,
		cache: [],
		speed: .045,
		barAliveBottom: 530,
		barDeathBottom: 220,
		shadowBottom: 40,
		shadowWidth: 340,
		shadowHeight: 70,
		clickAliveY: 40,
		clickAliveW: 220,
		clickAliveH: 450,
		clickDeadY: 0,
		clickDeadW: 330,
		clickDeadH: 150,
		enableSecondary: true,
		enableSpecial: true
	},
	'kobold': {
		imgW: 1400,
		imgH: 1000,
		imgCy: 230,
		width: 700,
		height: 500,
		yFloor: -40,
		yoyo: false,
		cache: [],
		speed: .045,
		barAliveBottom: 380,
		barDeathBottom: 200,
		shadowBottom: 40,
		shadowWidth: 230,
		shadowHeight: 60,
		clickAliveY: 30,
		clickAliveW: 170,
		clickAliveH: 310,
		clickDeadY: 10,
		clickDeadW: 250,
		clickDeadH: 100,
		enableSecondary: true,
		enableSpecial: true
	},
	orc: {
		imgW: 1200,
		imgH: 1000,
		imgCy: 340,
		width: 960,
		height: 800,
		yFloor: -55,
		yoyo: false,
		cache: [],
		speed: .045,
		barAliveBottom: 520,
		barDeathBottom: 250,
		shadowBottom: 40,
		shadowWidth: 260,
		shadowHeight: 70,
		clickAliveY: 30,
		clickAliveW: 200,
		clickAliveH: 440,
		clickDeadY: 0,
		clickDeadW: 240,
		clickDeadH: 150,
		enableSecondary: true,
		enableSpecial: true
	},
	griffon: {
		imgW: 2000,
		imgH: 1200,
		imgCy: 250,
		width: 1600,
		height: 960,
		yFloor: -40,
		yoyo: false,
		cache: [],
		speed: .05,
		barAliveBottom: 520,
		barDeathBottom: 230,
		shadowBottom: 40,
		shadowWidth: 280,
		shadowHeight: 80,
		clickAliveY: 20,
		clickAliveW: 180,
		clickAliveH: 380,
		clickDeadY: 20,
		clickDeadW: 400,
		clickDeadH: 130,
		enableSecondary: true,
		enableSpecial: true
	},
	'harpy': {
		imgW: 1500,
		imgH: 1000,
		imgCy: 290,
		width: 900,
		height: 600,
		yFloor: -30,
		yoyo: false,
		cache: [],
		speed: .045,
		barAliveBottom: 490,
		barDeathBottom: 270,
		shadowBottom: 40,
		shadowWidth: 300,
		shadowHeight: 40,
		clickAliveY: 50,
		clickAliveW: 200,
		clickAliveH: 400,
		clickDeadY: 50,
		clickDeadW: 350,
		clickDeadH: 130,
		enableSecondary: true,
		enableSpecial: true
	},
	'werewolf': {
		imgW: 1000,
		imgH: 1000,
		imgCy: 260,
		width: 800,
		height: 800,
		yFloor: -60,
		yoyo: false,
		cache: [],
		speed: .045,
		barAliveBottom: 450,
		barDeathBottom: 220,
		shadowBottom: 40,
		shadowWidth: 380,
		shadowHeight: 60,
		clickAliveY: 40,
		clickAliveW: 350,
		clickAliveH: 330,
		clickDeadY: -20,
		clickDeadW: 400,
		clickDeadH: 200,
		enableSecondary: true,
		enableSpecial: true
	},
	'centaur': {
		imgW: 1500,
		imgH: 1000,
		imgCy: 330,
		width: 1050,
		height: 700,
		yFloor: -25,
		yoyo: false,
		cache: [],
		speed: .045,
		barAliveBottom: 560,
		barDeathBottom: 240,
		shadowBottom: 40,
		shadowWidth: 190,
		shadowHeight: 80,
		clickAliveY: 20,
		clickAliveW: 150,
		clickAliveH: 470,
		clickDeadY: 20,
		clickDeadW: 380,
		clickDeadH: 150,
		enableSecondary: true,
		enableSpecial: true
	},
	// dont like the cerberus
	'cerberus': {
		imgW: 1800,
		imgH: 1200,
		imgCy: 300,
		width: 1200,
		height: 800,
		yFloor: -50,
		yoyo: false,
		cache: [],
		speed: .055,
		barAliveBottom: 530,
		barDeathBottom: 350,
		shadowBottom: 40,
		shadowWidth: 470,
		shadowHeight: 180,
		clickAliveY: 20,
		clickAliveW: 420,
		clickAliveH: 480,
		clickDeadY: 0,
		clickDeadW: 400,
		clickDeadH: 250,
		enableSecondary: false,
		enableSpecial: true
	},
	'fungoid': {
		imgW: 1000,
		imgH: 1000,
		imgCy: 340,
		width: 800,
		height: 800,
		yFloor: -80,
		yoyo: true,
		cache: [],
		speed: .045,
		barAliveBottom: 550,
		barDeathBottom: 270,
		shadowBottom: 40,
		shadowWidth: 260,
		shadowHeight: 70,
		clickAliveY: 40,
		clickAliveW: 190,
		clickAliveH: 470,
		clickDeadY: 0,
		clickDeadW: 210,
		clickDeadH: 140,
		enableSecondary: true,
		enableSpecial: true
	},
	'gargoyle': {
		imgW: 1200,
		imgH: 1000,
		imgCy: 300,
		width: 1080,
		height: 900,
		yFloor: -20,
		yoyo: true,
		cache: [],
		speed: .045,
		barAliveBottom: 530,
		barDeathBottom: 350,
		shadowBottom: 40,
		shadowWidth: 320,
		shadowHeight: 60,
		clickAliveY: 40,
		clickAliveW: 200,
		clickAliveH: 400,
		clickDeadY: 40,
		clickDeadW: 200,
		clickDeadH: 250,
		enableSecondary: true,
		enableSpecial: true
	},
	'beetle': {
		imgW: 1000,
		imgH: 1000,
		imgCy: 210,
		width: 600,
		height: 600,
		yFloor: -60,
		yoyo: false,
		cache: [],
		speed: .04,
		barAliveBottom: 370,
		barDeathBottom: 250,
		shadowBottom: 40,
		shadowWidth: 400,
		shadowHeight: 90,
		clickAliveY: 120,
		clickAliveW: 190,
		clickAliveH: 170,
		clickDeadY: 20,
		clickDeadW: 200,
		clickDeadH: 170,
		enableSecondary: true,
		enableSpecial: true
	},
	'imp': {
		imgW: 1250,
		imgH: 1000,
		imgCy: 200,
		width: 625,
		height: 500,
		yFloor: -15,
		yoyo: true,
		cache: [],
		speed: .045,
		barAliveBottom: 400,
		barDeathBottom: 230,
		shadowBottom: 40,
		shadowWidth: 220,
		shadowHeight: 60,
		clickAliveY: 30,
		clickAliveW: 150,
		clickAliveH: 290,
		clickDeadY: 0,
		clickDeadW: 150,
		clickDeadH: 140,
		enableSecondary: true,
		enableSpecial: true
	},
	'minotaur': {
		imgW: 1000,
		imgH: 1000,
		imgCy: 380,
		width: 1000,
		height: 1000,
		yFloor: -100,
		yoyo: false,
		cache: [],
		speed: .045,
		barAliveBottom: 620,
		barDeathBottom: 250,
		shadowBottom: 40,
		shadowWidth: 270,
		shadowHeight: 80,
		clickAliveY: 40,
		clickAliveW: 200,
		clickAliveH: 500,
		clickDeadY: 0,
		clickDeadW: 250,
		clickDeadH: 150,
		enableSecondary: true,
		enableSpecial: true
	},
	'aviak': {
		imgW: 1200,
		imgH: 1000,
		imgCy: 290,
		width: 900,
		height: 750,
		yFloor: -110,
		yoyo: false,
		cache: [],
		speed: .04,
		barAliveBottom: 450,
		barDeathBottom: 200,
		shadowBottom: 40,
		shadowWidth: 270,
		shadowHeight: 40,
		clickAliveY: 40,
		clickAliveW: 190,
		clickAliveH: 380,
		clickDeadY: 0,
		clickDeadW: 350,
		clickDeadH: 125,
		enableSecondary: true,
		enableSpecial: true
	},
	'elephant': {
		imgW: 1300,
		imgH: 1000,
		imgCy: 330,
		width: 1300,
		height: 1000,
		yFloor: -100,
		yoyo: false,
		cache: [],
		speed: .05,
		barAliveBottom: 720,
		barDeathBottom: 340,
		shadowBottom: 40,
		shadowWidth: 380,
		shadowHeight: 110,
		clickAliveY: 10,
		clickAliveW: 290,
		clickAliveH: 650,
		clickDeadY: 0,
		clickDeadW: 440,
		clickDeadH: 250,
		enableSecondary: true,
		enableSpecial: true
	},
	'lion': {
		imgW: 900,
		imgH: 1200,
		imgCy: 300,
		width: 540,
		height: 720,
		yFloor: -20,
		yoyo: false,
		cache: [],
		speed: .05,
		barAliveBottom: 500,
		barDeathBottom: 230,
		shadowBottom: 40,
		shadowWidth: 250,
		shadowHeight: 90,
		clickAliveY: 30,
		clickAliveW: 180,
		clickAliveH: 420,
		clickDeadY: 0,
		clickDeadW: 320,
		clickDeadH: 140,
		enableSecondary: false,
		enableSpecial: true
	},
	'crocodile': {
		imgW: 1000,
		imgH: 1000,
		imgCy: 120,
		width: 800,
		height: 800,
		yFloor: -50,
		yoyo: false,
		cache: [],
		speed: .05,
		barAliveBottom: 320,
		barDeathBottom: 250,
		shadowBottom: 40,
		shadowWidth: 420,
		shadowHeight: 110,
		clickAliveY: 10,
		clickAliveW: 330,
		clickAliveH: 240,
		clickDeadY: 30,
		clickDeadW: 370,
		clickDeadH: 170,
		enableSecondary: true,
		enableSpecial: true
	},
	'rhino': {
		imgW: 1200,
		imgH: 1200,
		imgCy: 275,
		width: 1000,
		height: 1000,
		yFloor: -90,
		yoyo: false,
		cache: [],
		speed: .05,
		barAliveBottom: 620,
		barDeathBottom: 320,
		shadowBottom: 40,
		shadowWidth: 370,
		shadowHeight: 130,
		clickAliveY: 20,
		clickAliveW: 280,
		clickAliveH: 540,
		clickDeadY: 0,
		clickDeadW: 450,
		clickDeadH: 240,
		enableSecondary: true,
		enableSpecial: false
	},
	'lioness': {
		imgW: 900,
		imgH: 1200,
		imgCy: 300,
		width: 540,
		height: 720,
		yFloor: -20,
		yoyo: false,
		cache: [],
		speed: .045,
		barAliveBottom: 460,
		barDeathBottom: 230,
		shadowBottom: 40,
		shadowWidth: 250,
		shadowHeight: 90,
		clickAliveY: 30,
		clickAliveW: 180,
		clickAliveH: 390,
		clickDeadY: 0,
		clickDeadW: 320,
		clickDeadH: 140,
		enableSecondary: false,
		enableSpecial: true
	},
	'bear': {
		imgW: 1000,
		imgH: 1000,
		imgCy: 260,
		width: 600,
		height: 600,
		yFloor: -10,
		yoyo: false,
		cache: [],
		speed: .05,
		barAliveBottom: 470,
		barDeathBottom: 320,
		shadowBottom: 40,
		shadowWidth: 280,
		shadowHeight: 100,
		clickAliveY: 50,
		clickAliveW: 240,
		clickAliveH: 370,
		clickDeadY: 50,
		clickDeadW: 340,
		clickDeadH: 240,
		enableSecondary: true,
		enableSpecial: true
	},
	'toadlok': {
		imgW: 1200,
		imgH: 1000,
		imgCy: 200,
		width: 600,
		height: 500,
		yFloor: -35,
		yoyo: false,
		cache: [],
		speed: .045,
		barAliveBottom: 390,
		barDeathBottom: 270,
		shadowBottom: 40,
		shadowWidth: 200,
		shadowHeight: 70,
		clickAliveY: 50,
		clickAliveW: 200,
		clickAliveH: 300,
		clickDeadY: 30,
		clickDeadW: 200,
		clickDeadH: 170,
		enableSecondary: true,
		enableSpecial: true
	},
	'giant': {
		imgW: 1400,
		imgH: 1200,
		imgCy: 480,
		width: 1400,
		height: 1200,
		yFloor: -150,
		yoyo: false,
		cache: [],
		speed: .05,
		barAliveBottom: 800,
		barDeathBottom: 370,
		shadowBottom: 40,
		shadowWidth: 480,
		shadowHeight: 120,
		clickAliveY: 50,
		clickAliveW: 350,
		clickAliveH: 700,
		clickDeadY: -50,
		clickDeadW: 350,
		clickDeadH: 400,
		enableSecondary: true,
		enableSpecial: true
	},
	'ice-giant': {
		imgW: 1400,
		imgH: 1200,
		imgCy: 480,
		width: 1400,
		height: 1200,
		yFloor: -150,
		yoyo: false,
		cache: [],
		speed: .06,
		barAliveBottom: 800,
		barDeathBottom: 370,
		shadowBottom: 40,
		shadowWidth: 480,
		shadowHeight: 120,
		clickAliveY: 50,
		clickAliveW: 350,
		clickAliveH: 700,
		clickDeadY: -50,
		clickDeadW: 350,
		clickDeadH: 400,
		enableSecondary: true,
		enableSpecial: true
	},
	'fire-giant': {
		imgW: 1400,
		imgH: 1200,
		imgCy: 480,
		width: 1400,
		height: 1200,
		yFloor: -150,
		yoyo: false,
		cache: [],
		speed: .06,
		barAliveBottom: 800,
		barDeathBottom: 370,
		shadowBottom: 40,
		shadowWidth: 480,
		shadowHeight: 120,
		clickAliveY: 50,
		clickAliveW: 350,
		clickAliveH: 700,
		clickDeadY: -50,
		clickDeadW: 350,
		clickDeadH: 400,
		enableSecondary: true,
		enableSpecial: true
	},
	'spectre': {
		imgW: 1500,
		imgH: 1500,
		imgCy: 455,
		width: 1200,
		height: 1200,
		yFloor: -220,
		yoyo: false,
		cache: [],
		speed: .055,
		barAliveBottom: 610,
		barDeathBottom: 270,
		shadowBottom: 40,
		shadowWidth: 200,
		shadowHeight: 80,
		clickAliveY: 100,
		clickAliveW: 150,
		clickAliveH: 470,
		clickDeadY: 40,
		clickDeadW: 190,
		clickDeadH: 150,
		enableSecondary: true,
		enableSpecial: true
	},
	'angler': {
		imgW: 1500,
		imgH: 1200,
		imgCy: 235,
		width: 900,
		height: 720,
		yFloor: -60,
		yoyo: false,
		cache: [],
		speed: .045,
		barAliveBottom: 400,
		barDeathBottom: 270,
		shadowBottom: 40,
		shadowWidth: 240,
		shadowHeight: 60,
		clickAliveY: 50,
		clickAliveW: 200,
		clickAliveH: 280,
		clickDeadY: 10,
		clickDeadW: 200,
		clickDeadH: 120,
		enableSecondary: true,
		enableSpecial: true
	},
	'evil-eye': {
		imgW: 1200,
		imgH: 1000,
		imgCy: 240,
		width: 720,
		height: 600,
		yFloor: -100,
		yoyo: false,
		cache: [],
		speed: .05,
		barAliveBottom: 410,
		barDeathBottom: 270,
		shadowBottom: 40,
		shadowWidth: 250,
		shadowHeight: 80,
		clickAliveY: 50,
		clickAliveW: 200,
		clickAliveH: 300,
		clickDeadY: 50,
		clickDeadW: 200,
		clickDeadH: 200,
		enableSecondary: true,
		enableSpecial: true
	},
	'unicorn': {
		imgW: 2000,
		imgH: 1200,
		imgCy: 280,
		width: 1600,
		height: 960,
		yFloor: -40,
		yoyo: false,
		cache: [],
		speed: .055,
		barAliveBottom: 450,
		barDeathBottom: 260,
		shadowBottom: 40,
		shadowWidth: 220,
		shadowHeight: 70,
		clickAliveY: 50,
		clickAliveW: 120,
		clickAliveH: 350,
		clickDeadY: 50,
		clickDeadW: 350,
		clickDeadH: 100,
		enableSecondary: true,
		enableSpecial: true
	},
	'scorpion': {
		imgW: 1000,
		imgH: 1000,
		imgCy: 135,
		width: 600,
		height: 600,
		yFloor: 0, // back row is *2
		yoyo: false,
		cache: [],
		speed: .045,
		barAliveBottom: 450,
		barDeathBottom: 270,
		shadowBottom: 40,
		shadowWidth: 400,
		shadowHeight: 80,
		clickAliveY: 50,
		clickAliveW: 350,
		clickAliveH: 350,
		clickDeadY: 50,
		clickDeadW: 350,
		clickDeadH: 100,
		enableSecondary: true,
		enableSpecial: true
	},
	/*'cyclops': {
		imgW: 1000,
		imgH: 1000,
		imgCy: 135,
		width: 600,
		height: 600,
		yFloor: 0, // back row is *2
		yoyo: false,
		cache: [],
		speed: .045,
		barAliveBottom: 450,
		barDeathBottom: 270,
		shadowBottom: 40,
		shadowWidth: 400,
		shadowHeight: 80,
		clickAliveY: 50,
		clickAliveW: 350,
		clickAliveH: 350,
		clickDeadY: 50,
		clickDeadW: 350,
		clickDeadH: 100,
		enableSecondary: true,
		enableSpecial: true
	},*/
};