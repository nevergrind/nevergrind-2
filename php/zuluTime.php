<?php
	function getZulu(){
		return str_replace(":", "", gmdate("H:i:s", time()) . 'Z ');
	}