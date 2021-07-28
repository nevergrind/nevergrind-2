var storage;
!function($, _, TweenMax, String, localStorage, undefined) {
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

	///////////////////////////////////////////
	/**
	 * Returns a string based on a key - wrapper for two APIs needed for local & prod
	 * @param key
	 * @returns {string}
	 */
	function get(key, callback) {
		if (app.isApp) {
			console.info('get:', key)
			fs.readFile(storage.getPath(key), (err, data) => {
				console.info('Read file object', key, JSON.parse(data))
				callback(JSON.parse(data))
			})
		}
		else {
			let data = localStorage.getItem(key)
			if (typeof data === 'string') {
				try {
					let resp = JSON.parse(data)
					console.info('localStorage get', key, resp)
					callback(resp)
				}
				catch (err) {
					console.info('localStorage get', key, data)
					callback(data)
				}
			}
			else if (typeof data === 'number') {
				console.info('localStorage get', key, data)
				callback(data)
			}
			else {
				console.info('localStorage get', key, data)
				callback(undefined)
			}
		}
	}

	/**
	 * Set based on key and value - generally data is a string, but primitives work too... ugh
	 * @param key
	 * @param data
	 */
	function set(key, data) {
		if (app.isApp) {
			console.info('Saving...', key, data)
			if (typeof data === 'string') {
				fs.writeFile(storage.getPath(key), data, err => {
					console.info('Saved string to disk...!', key, data)
				})
			}
			else if (typeof data === 'object') {
				data = JSON.stringify(data)
				fs.writeFile(storage.getPath(key), data, err => {
					console.info('Saved object as string to disk...!', key, data)
				})
			}
			else if (typeof data === 'number') {
				data = String(data)
				fs.writeFile(storage.getPath(key), data, err => {
					console.info('Saved number as string to disk...!', key, data)
				})
			}
		}
		else {
			localStorage.setItem(key, data)
		}
	}

	function remove(key) {
		if (app.isApp) {
			fs.unlinkSync(storage.getPath(key))
		}
		else {
			localStorage.removeItem(key)
		}
	}

	/**
	 * creates a string based on app data path + key
	 * @param key
	 * @returns {string}
	 */
	function getPath(key) {
		console.info('getPath key', key)
		console.info('full path', path.join(nw.App.dataPath, key))
		return path.join(nw.App.dataPath, key)
	}
}($, _, TweenMax, String, localStorage);