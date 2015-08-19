<html>
<head>
	<title>LABS</title>
	<link rel="stylesheet" href="default.css">
</head>
<body>
	<div style="margin:12px 0 0 12px">
		<div style="margin:0 0 12px 0">SITES</div>
		<?php
			foreach ( glob ('./*', GLOB_ONLYDIR) as $dir ) {
			    echo '<div style="margin-bottom:3px"><li><a href="/' . basename ($dir) . '" style=" letter-spacing:3px">' . basename ($dir) . '</a></li></div>';
			}
		?>
	</div>
</body>

</html>