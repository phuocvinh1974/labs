<?php

	$employees = [
		['last'=>'A','first'=>'Tran Van'],
		['last'=>'Giau','first'=>'Pham Van'],
		['last'=>'Hieu','first'=>'Tran Trung'],
		['last'=>'Hieu','first'=>'Tran Trung'],
		['last'=>'Hieu','first'=>'Tran Trung'],
	];

	// for ($i=0; $i<count($employees); $i++) {
	// 	echo '<div>' . $employees[$i]['first'] . ' ' . $employees[$i]['last'] . '</div>';
	// }

	foreach ($employees as $item) {
		echo '<div>' . $item['first'] . ' ' . $item['last'] . '</div>';
	}
?>;