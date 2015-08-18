<html>
<head>
	<title>LABS</title>
	<link rel="stylesheet" href="default.css">
</head>
<body>
	<div style="margin:12px 0 0 12px">
		<div style="margin:0 0 12px 0">APPS</div>
		<?php
			foreach ( glob ('./*', GLOB_ONLYDIR) as $dir ) {
			    $dirname = basename ($dir);
			    echo '<div><li><a href="/'.$dirname.'" style=" letter-spacing:3px">' . $dirname . '</a></li></div>';
			}
		?>
	</div>
</body>

</html>