<?php
if (!($_SESSION['guild']['name'])) {
	exit('You are not in a guild.');
}