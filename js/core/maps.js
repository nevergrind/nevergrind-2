let maps;
!function($, _, TweenMax, undefined) {
	const HORIZONTAL_HALL = {width: HALLWAY_LENGTH, height: HALLWAY_WIDTH}
	const VERTICAL_HALL = {width: HALLWAY_WIDTH, height: HALLWAY_LENGTH}
	const ROOM_DISTANCE = 100
	maps = [{}]
	createMap({
		width: 1200,
		height: 1200,
		totalRooms: 81,
	})
	///////////////////////////////////////////
	function createMap(grid) {
		const MAX_ROOMS = ~~((((grid.width - ROOM_DISTANCE) / 100) * ((grid.height - ROOM_DISTANCE) / 100)) * .66)
		console.info('max rooms', MAX_ROOMS)
		grid.totalRooms = Math.min(grid.totalRooms, MAX_ROOMS)
		grid.id = maps.length + 1

		grid.rooms = [{
			id: 0,
			x: grid.width * .5,
			// y: grid.height - ROOM_DISTANCE,
			y: grid.height * .5,
			connects: []
		}]
		grid.hallways = []
		/*addRoom(grid, { from: 1, to: 'north' })
		addRoom(grid, { from: 1, to: 'west' })
		addRoom(grid, { from: 3, to: 'north' })
		addRoom(grid, { from: 4, to: 'east' })
		addRoom(grid, { from: 2, to: 'east' })
		addRoom(grid, { from: 5, to: 'south' })
		addRoom(grid, { from: 6, to: 'south' })
		addRoom(grid, { from: 7, to: 'west' })
		addRoom(grid, { from: 0, to: 'west' })
		addRoom(grid, { from: 8, to: 'north' })
		addRoom(grid, { from: 1, to: 'east' })*/
		while (grid.rooms.length < grid.totalRooms) {
			// TODO: try to go to 3 rooms... bug for some reason
			// TODO: Rooms connecting to themselves????
			let validRoomIds = grid.rooms.filter(roomHasLessThanFourHallways).map(getRoomIds)
			let maxIndex = validRoomIds.length - 1
			console.info('validRoomIds', validRoomIds.length, maxIndex)
			let fromId = validRoomIds[_.random(0, maxIndex)]
			let direction = getDirection(fromId)
			addRoom(grid, { from: fromId, to: direction })
		}
		maps.push(grid)
		//////////////////////////////////
		function getDirection(fromId) {
			let validDirections = []
			console.info('fromId', fromId)
			if (grid.rooms[fromId].y > ROOM_DISTANCE &&
				!grid.hallways.some(hallwayFoundNorth)) {
				validDirections.push(0)
			}
			if (grid.rooms[fromId].x < grid.width - ROOM_DISTANCE &&
				!grid.hallways.some(hallwayFoundEast)) {
				validDirections.push(1)
			}
			if (grid.rooms[fromId].y < grid.height - ROOM_DISTANCE &&
				!grid.hallways.some(hallwayFoundSouth)) {
				validDirections.push(2)
			}
			if (grid.rooms[fromId].x > ROOM_DISTANCE &&
				!grid.hallways.some(hallwayFoundWest)) {
				validDirections.push(3)
			}
			let dirLen = validDirections - 1

			return validDirections[_.random(0, dirLen)]
			//////////////////////////////
			function hallwayFoundNorth(h) {
				return h.x === grid.rooms[fromId].x &&
					h.y === grid.rooms[fromId].y - ROOM_DISTANCE &&
					h.height === HALLWAY_LENGTH
			}
			function hallwayFoundEast(h) {
				return h.x === grid.rooms[fromId].x &&
					h.y === grid.rooms[fromId].y &&
					h.width === HALLWAY_LENGTH
			}
			function hallwayFoundSouth(h) {
				return h.x === grid.rooms[fromId].x &&
					h.y === grid.rooms[fromId].y &&
					h.height === HALLWAY_LENGTH
			}
			function hallwayFoundWest(h) {
				return h.x === grid.rooms[fromId].x - ROOM_DISTANCE &&
					h.y === grid.rooms[fromId].y &&
					h.width === HALLWAY_LENGTH
			}
		}
		function roomHasLessThanFourHallways(r) {
			return r.connects.length <= 4
		}
		function getRoomIds(r) {
			return r.id
		}
	}
	function addRoom(grid, room) {
		let addedRoomId = grid.rooms.length
		let hallId = grid.hallways.length
		let origin = grid.rooms[room.from]
		// determine relational position
		// console.info('room.from', room.from)
		room.x = origin.x
		room.y = origin.y
		// set new coordinates based on direction
		if (room.to === 0) room.y -= ROOM_DISTANCE
		else if (room.to === 1) room.x += ROOM_DISTANCE
		else if (room.to === 2) room.y += ROOM_DISTANCE
		else if (room.to === 3) room.x -= ROOM_DISTANCE
		// room already exists at room coordinates?
		let findRoomId = grid.rooms.findIndex(r => r.x === room.x && r.y === room.y)
		if (findRoomId === -1) {
			// VALID - room with these coordinates does not exist yet
			grid.rooms.push({
				id: addedRoomId,
				x: room.x,
				y: room.y,
				connects: [room.from]
			})
		}
		else {
			// INVALID - room exists - connect hallways only
			addedRoomId = findRoomId
			if (!grid.rooms[findRoomId].connects.includes(room.from)) {
				grid.rooms[findRoomId].connects.push(room.from)
			}
		}
		if (addedRoomId !== origin.id) {
			grid.hallways.push({
				id: hallId,
				x: room.x > origin.x ? origin.x : room.x,
				y: room.y > origin.y ? origin.y : room.y,
				connects: [addedRoomId, origin.id],
				...(room.x !== origin.x ? HORIZONTAL_HALL : VERTICAL_HALL),
			})
			origin.connects.push(addedRoomId)
		}
	}
	/**
	{
		id: 1,
		x: 500, y: 500,
		connects: [0, 2, 3, 4],
	}, {
		id: 2,
		x: 500, y: 400,
		connects: [1, 6, 5],
	}, {
		id: 3,
		x: 400, y: 500,
		connects: [1, 8, 5],
	}, {
		id: 4,
		x: 600, y: 500,
		connects: [1, 7, 6],
	}, {
		id: 5,
		x: 400, y: 400,
		connects: [3, 2],
	}, {
		id: 6,
		x: 600, y: 400,
		connects: [2, 4],
	}, {
		id: 7,
		x: 600, y: 600,
		connects: [4, 0],
	}, {
		id: 8,
		x: 400, y: 600,
		connects: [0, 3],
	}
	 */

	/**
	 *
	{
		id: 0,
		x: 500, y: 500,
		connects: [0, 1],
		...VERTICAL_HALL,
	}, {
		id: 1,
		x: 500, y: 400,
		connects: [1, 2],
		...VERTICAL_HALL,
	}, {
		id: 2,
		x: 400, y: 500,
		connects: [1, 3],
		...HORIZONTAL_HALL,
	}, {
		id: 3,
		x: 500, y: 500,
		connects: [1, 4],
		...HORIZONTAL_HALL,
	}, {
		id: 4,
		x: 400, y: 400,
		connects: [3, 5],
		...VERTICAL_HALL,
	}, {
		id: 5,
		x: 500, y: 400,
		connects: [2, 6],
		...HORIZONTAL_HALL,
	}, {
		id: 6,
		x: 600, y: 500,
		connects: [4, 7],
		...VERTICAL_HALL,
	}, {
		id: 7,
		x: 400, y: 600,
		connects: [0, 8],
		...HORIZONTAL_HALL,
	}, {
		id: 8,
		x: 400, y: 400,
		connects: [2, 5],
		...HORIZONTAL_HALL,
	}, {
		id: 9,
		x: 600, y: 400,
		connects: [4, 6],
		...VERTICAL_HALL,
	}, {
		id: 10,
		x: 500, y: 600,
		connects: [0, 7],
		...HORIZONTAL_HALL,
	}, {
		id: 11,
		x: 400, y: 500,
		connects: [3, 8],
		...VERTICAL_HALL,
	}
	 */


		/*if (room.y < origin.y) {
			// north
			grid.hallways.push({
				id: hallId,
				x: room.x,
				y: room.y,
				connects: [addedRoomId, origin.id],
				...VERTICAL_HALL,
			})
		}
		else if (room.y > origin.y) {
			// south
			grid.hallways.push({
				id: hallId,
				x: room.x,
				y: origin.y,
				connects: [addedRoomId, origin.id],
				...VERTICAL_HALL,
			})
		}
		else if (room.x < origin.x) {
			// west
			grid.hallways.push({
				id: hallId,
				x: room.x,
				y: room.y,
				connects: [addedRoomId, origin.id],
				...HORIZONTAL_HALL,
			})
		}
		else if (room.x > origin.x) {
			// east
			grid.hallways.push({
				id: hallId,
				x: origin.x,
				y: room.y,
				connects: [addedRoomId, origin.id],
				...HORIZONTAL_HALL,
			})
		}*/

}($, _, TweenMax);