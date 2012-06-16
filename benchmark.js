(function($){
	
	var init, starttime ;
	window.test.benchmark = {
		init: function() {
			init = (new Date()).getTime() ;
		},
		start: 	function() {
			starttime = (new Date()).getTime() ;
		},
		end: function() {
			return (new Date()).getTime() - starttime ;
		},
		toSeconds: function(diff) {
			diff || (diff = (new Date()).getTime() - init) ;
			return (Math.round(diff/10)/100) + 's' ; // in seconds with 1 decimal
		}
	}
	
})(jQuery) 
