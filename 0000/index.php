<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="content-type" content="text/html; charset=utf-8">
		<title>MEMBERS ZONE</title>
		<link rel="stylesheet" href="css/font-awesome.min.css">
		<link rel="stylesheet" href="css/app.css">
		<script src="js/jquery-2.1.3.min.js"></script>
        <script src="js/react-with-addons.min.js"></script>
        <script src="js/JSXTransformer.js"></script>
		<script src="js/proto-helper.js"></script>
	</head>
	<body>
		<script src="components/app.jsx" type="text/jsx"></script>
		<script src="components/sidebar.jsx" type="text/jsx"></script>
        <script src="components/container.jsx" type="text/jsx"></script>

        <script src="components/member.finder.controlbox.jsx" type="text/jsx"></script>
        <script src="components/member.quickadd.controlbox.jsx" type="text/jsx"></script>

        <script src="components/member.list.jsx" type="text/jsx"></script>
        <script src="components/member.info.jsx" type="text/jsx"></script>
		
		<script type="text/jsx">
            React.render(<App />, document.body);
        </script>
	</body>
</html>