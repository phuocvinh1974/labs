<script type="text/javascript">
	function youSayGoodBye() {
	 
	    alert("Good Bye!");
	 
	    function andISayHello() {
	        alert("Hello!");
	    }
	 
	    return andISayHello;
	}

	var x = youSayGoodBye()
	x()
</script>