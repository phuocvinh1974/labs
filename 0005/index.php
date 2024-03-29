<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="content-type" content="text/html; charset=utf-8">
		<title>TICKETS</title>
		<link rel="stylesheet" href="css/font-awesome.min.css">
		<link rel="stylesheet" href="css/app.css">
		<script src="js/jquery-2.1.3.min.js"></script>
        <script src="js/react-with-addons.min.js"></script>
        <script src="js/JSXTransformer.js"></script>

        <!--<script src="js/velocity.min.js"></script>-->

		<script src="js/proto-helper.js"></script>
	</head>
	<body>
		<script src="components/app.jsx" type="text/jsx"></script>
		<script src="components/auth.box.jsx" type="text/jsx"></script>
		<script src="components/movie.datepicker.jsx" type="text/jsx"></script>
		<script src="components/movie.times.jsx" type="text/jsx"></script>
		<script src="components/movie.tickets.jsx" type="text/jsx"></script>

		<script type="text/jsx">
            React.render(<App />, document.body);
        </script>

        <script type="text/javascript">
			// $(window).on("beforeunload", function () {
			// 	return false;
			// });
        </script>
	</body>
</html>