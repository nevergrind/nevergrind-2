var player;
let players = []; // player sprites
!function($, _, TweenMax, undefined) {
	player = {
		layer: {},
		textures: [],
		initCanvas,
		setPlayers,
		updatePlayerSprite,
		updateAllPlayerSprites,
		show,
		hide,
	}
	///////////////////////////////////////////
	function initCanvas() {
		// happens once
		if (typeof player.layer.view === 'undefined') {
			// player layer
			player.layer = new PIXI.Application({
				width: MaxWidth,
				height: MaxHeight,
				// backgroundColor: 0x103322
				transparent: true
			});
			player.layer.stage.sortableChildren = true
			player.layer.view.id = 'player-layer'
			player.layer.view.style.pointerEvents = 'none'
			player.layer.view.style.position = 'absolute'
			player.layer.view.style.top = '0px'
			player.layer.view.style.left = '0px'
			player.layer.view.style.zIndex = 1
			querySelector('#scene-players').appendChild(player.layer.view)
			player.setPlayers()
		}
	}
	function setPlayers() {
		/**
		 * This is the initial draw of players and shows them if party member is present
		 */
		// init
		if (!players.length) {
			for (var i=0; i<party.maxPlayers; i++) {
				initPlayerSprite(i)
			}
		}
		// and update status if player is present
		player.updateAllPlayerSprites()
	}
	function initPlayerSprite(i) {
		// console.info('initPlayerSprite')
		let id = ask.getAskId()
		players[i] = {}
		players[i].askId = id
		const texture = PIXI.Texture.from(`images/players/default.png`)
		player.textures.push(texture)
		players[i].sprite = PIXI.Sprite.from(player.textures[0])
		players[i].sprite.id = 'ask-' + id
		players[i].sprite.anchor.set(.5, 1)
		players[i].sprite.x = dungeon.centerX[i]
		players[i].sprite.y = dungeon.bottomY
		players[i].sprite.zIndex = ask.DEFAULT_PLAYER_LAYER
		if (typeof party.presence[i] === 'object') {
			// mobSkills.applyEffectFilter(party.presence[i].row)
			players[i].sprite.alpha = 1
		}
		else {
			players[i].sprite.alpha = 0
		}

		ask.addChild(players[i].sprite, false)
	}
	function updatePlayerSprite(i, alpha) {
		// this may change appearance depending on players leaving/joining etc
		players[i].sprite.texture = player.textures[0]
		players[i].sprite.alpha = alpha
	}
	function updateAllPlayerSprites() {
		players.forEach((p, i) => {
			if (party.aliveByIndex(i)) updatePlayerSprite(i, 1)
			else updatePlayerSprite(i, 0)
		})
	}
	function show() {
		TweenMax.set(querySelector('#scene-players'), {
			filter: 'brightness(1)',
			display: 'block',
		})
	}
	function hide() {
		TweenMax.set(querySelector('#scene-players'), {
			filter: 'brightness(0)',
			display: 'none',
		})
	}
}($, _, TweenMax);