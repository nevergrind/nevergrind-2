var stat;
!function() {
	stat = {
		getAttr
	}

	var attrIndex = {
		str: 0,
		sta: 1,
		agi: 2,
		dex: 3,
		wis: 4,
		intel: 5,
		cha: 6,
	}
	////////////////////////
	function getAttr(attr) {
		return my[attr] +
			create.raceAttrs[my.race][attrIndex[attr]] +
			create.jobAttrs[my.jobLong][attrIndex[attr]]
	}
}()