<?php
	/*
	insert into `items` (
			charRow, 
			type (0 eq, 1 inv)
			$slots (key is slot, value is lootRow)
			slot
		) VALUES '
	*/
	function getItemString($charRow, $slots, $type){
		$arr = [];
		foreach ($slots as $key => $value){
			$arr[] = '('. $charRow .',?,'. $type .','. $key .','. $value . ')';
		}
		return join(',', $arr);
	}