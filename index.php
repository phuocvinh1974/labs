<html>
<head>
	<title>LABS</title>
	<link rel="stylesheet" href="default.css">
</head>
<body>
	<div style="margin:12px 0 0 12px">
		<div style="margin:0 0 12px 0">SITES</div>
		<?php
			
			function getInfos ($dir) {

				$fp = basename($dir) . '/_info_.json';

				if ( file_exists($fp) )
					return json_decode( file_get_contents($fp) );
				else 
					return false;
			}

			foreach ( glob ('./*', GLOB_ONLYDIR) as $dir ) {

				$name = getInfos ($dir) ? getInfos ($dir)->name : null;

			    echo '<div style="margin-bottom:3px">
			    		<li><a href="/' . basename ($dir) . '" style=" letter-spacing:3px">' . basename ($dir) . '</a></li>
			    	</div>
			    	<div style="color:#999;margin-bottom:12px">'.$name.'</div>';
			}
		?>
	</div>
</body>

</html>