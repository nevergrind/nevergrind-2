<?php

$query = 'select 
	salubrin_den,
	tendolin_hollow,
	greenthorn_cavern,
	riven_grotto,
	lanfeld_refuge,
	babels_bastille,
	kordata_cove,
	arcturins_crypt,
	fahlnir_citadel,
	anuran_ruins,
	temple_of_prenssor,
	sylong_mausoleum,
	galeblast_fortress,
	ashenflow_peak
	from `missions` 
	where c_id=? 
	limit 1';

$stmt = $db->prepare($query);
$stmt->bind_param('s', $_SESSION['row']);
$stmt->execute();
$stmt->bind_result(
	$salubrin_den,
	$tendolin_hollow,
	$greenthorn_cavern,
	$riven_grotto,
	$lanfeld_refuge,
	$babels_bastille,
	$kordata_cove,
	$arcturins_crypt,
	$fahlnir_citadel,
	$anuran_ruins,
	$temple_of_prenssor,
	$sylong_mausoleum,
	$galeblast_fortress,
	$ashenflow_peak
);
$_SESSION['mission'] = [];
$r['mission'] = [];
while ($stmt->fetch()) {
	$r['mission'] = [
		'salubrinDen' => $salubrin_den,
		'tendolinHollow' => $tendolin_hollow,
		'greenthornCavern' => $greenthorn_cavern,
		'rivenGrotto' => $riven_grotto,
		'lanfeldRefuge' => $lanfeld_refuge,
		'babelsBastille' => $babels_bastille,
		'kordataCove' => $kordata_cove,
		'arcturinsCrypt' => $arcturins_crypt,
		'fahlnirCitadel' => $fahlnir_citadel,
		'anuranRuins' => $anuran_ruins,
		'templeOfPrenssor' => $temple_of_prenssor,
		'sylongMausoleum' => $sylong_mausoleum,
		'galeblastFortress' => $galeblast_fortress,
		'ashenflowPeak' => $ashenflow_peak
	];
}