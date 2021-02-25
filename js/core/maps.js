let maps;
!function($, _, TweenMax, undefined) {
	maps = [{},
		{
			id: 1,
			width: 1000,
			height: 1000,
			startX: 500,
			startY: 600,
			rooms: [
				{
					id: 0,
					x: 500, y: 600,
					connects: [1],
					mobs: 0,
				}, {
					id: 1,
					x: 500, y: 500,
					connects: [0, 2],
					mobs: 9,
				}, {
					id: 2,
					x: 500, y: 400,
					connects: [1],
					mobs: 9,
				}
			],
			hallways: [
				{
					id: 0,
					x: 500, y: 500,
					connects: [0, 1],
					width: HALLWAY_WIDTH, height: HALLWAY_LENGTH,
				}, {
					id: 1,
					x: 500, y: 400,
					connects: [1, 2],
					width: HALLWAY_WIDTH, height: HALLWAY_LENGTH,
				}
			]
		}
	]
	///////////////////////////////////////////

}($, _, TweenMax);