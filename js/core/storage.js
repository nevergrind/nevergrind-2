var storage;
!function($, _, TweenMax, String, localStorage, JSON, undefined) {
	storage = {
		getPath,
		get,
		set,
		remove
	}
	let fs
	let path
	if (app.isApp) {
		fs = require('fs')
		path = require('path')
	}
	/* Test code
	var path = require('path')
	var fs = require('fs')
	var key = 'played88'
	var val = 1+''
	fs.writeFile(path.join(nw.App.dataPath, key), val, e => {
		console.info('done writing')
	})
	fs.readFile(path.join(nw.App.dataPath, 'played88'), (err, data) => {
		console.info('data resp', JSON.parse(data));
	})
	 */

	/*
	var path = require('path')
	var fs = require('fs')
	var key = 'played8'
	try {
		const resp = fs.readFileSync(path.join(nw.App.dataPath, key), (err, data) => {
			console.info('data resp', JSON.parse(data));
		})
		console.info('read resp', JSON.parse(resp))
	}
	catch (err) {
		if (err.code !== 'ENOENT') {
			throw err;
		}


		// handle it
		console.info(err.code);
		fs.writeFileSync(path.join(nw.App.dataPath, 'played8'), '1', (err, data) => {

		})
	}
	 */
	///////////////////////////////////////////
	/**
	 * Returns a string based on a key - wrapper for two APIs needed for local & prod
	 * @param key
	 * @returns {string}
	 */
	function get(key) {
		/*if (app.isApp) {
			// console.info('get:', key)
			try {
				let val = fs.readFileSync(storage.getPath(key))
				/!*console.info('get value:', val, typeof val)
				console.info('get value:', typeof JSON.parse(val), JSON.parse(val))*!/
				// if it's a '1' it should parse into a type of number
				// if it's a string like 'asdf' it should parse into a string
				// if it's a JSON string, it should convert to an object
				return JSON.parse(val)
			}
			catch (err) {
				if (err.code !== 'ENOENT') {}
				// handle or something?
				return ''
			}
		}
		else {*/
			let data = localStorage.getItem(key)
			if (typeof data === 'string') {
				try {
					let resp = JSON.parse(data)
					// console.info('localStorage string get', key, resp)
					return resp
				}
				catch (err) {
					// console.warn('localStorage string get error', key, data)
					return data
				}
			}
			else if (typeof data === 'number') {
				// console.info('localStorage number get', key, data)
				return data
			}
			else {
				// console.info('localStorage get undefined', key, data)
				return undefined
			}
		// }
	}

	/**
	 * Set based on key and value - generally data is a string, but primitives work too... ugh
	 * @param key
	 * @param data
	 */
	function set(key, value) {
		// console.info('Saving...', key, value)
		/*if (app.isApp) {
			if (typeof value === 'string') {
				fs.writeFileSync(storage.getPath(key), value)
			}
			else if (typeof value === 'object') {
				fs.writeFileSync(storage.getPath(key), JSON.stringify(value))
			}
			else if (typeof value === 'number') {
				fs.writeFileSync(storage.getPath(key),  String(value))
			}
		}
		else {*/
			localStorage.setItem(key, value)
		// }
	}

	function remove(key) {
		/*if (app.isApp) {
			fs.unlinkSync(storage.getPath(key))
		}
		else {*/
			localStorage.removeItem(key)
		// }
	}

	/**
	 * creates a string based on app data path + key
	 * @param key
	 * @returns {string}
	 */
	function getPath(key) {
		// console.info('getPath', path.join(nw.App.dataPath, key))
		return path.join(nw.App.dataPath, key + '.txt')
	}
}($, _, TweenMax, String, localStorage, JSON);