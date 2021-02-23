let maps;
!function($, _, TweenMax, undefined) {

	maps = [{},
		{
			id: 1,
			width: 800,
			height: 800,
			rooms: [
				{
					id: 0,
					x: 0, y: 0,
					connects: [1]
				}, {
					id: 1,
					x: 0, y: 6,
					connects: [0, 2]
				}, {
					id: 2,
					x: 0, y: 12,
					connects: [1]
				}
			],
			hallways: [
				{
					x1: 0, y1: 1,
					x2: 0, y2: 5,
				}, {
					x1: 0, y1: 7,
					x2: 0, y2: 11,
				}
			]
		}
	]
	///////////////////////////////////////////

}($, _, TweenMax);