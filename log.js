// Logging
(function($){
	var filters = { // init state
		'log-error':  true, 
		'log-info':   true, 
		'log-debug':  false 
	}, log ;
	
	$(function(){
		log = $('#log .container') ;
	}) ;
	
	window.test.log = {
			filter: function(ftype) {
				filters[ftype] = !filters[ftype] ;
				$('.' + ftype, log)[ filters[ftype] == true ? 'fadeIn':'fadeOut']() ;
			},
			clear: function() {
				log.empty() ;
			},
			debug: function(msg) {
				createLogRow('debug', msg) ;
			},
			info: function(msg) {
				createLogRow('info', msg) ;
			},
			error: function(msg) {
				createLogRow('error', msg) ;
			}
	} ;
	
	function createLogRow(ltype, msg) {
		if ( typeof(msg) == 'object' ) // stringify objects
			msg = JSON.stringify(msg) ;
		
		var div = $('<div class="row log-' + ltype + '">') ; // create log entry element
		
		if ( filters['log-' + ltype] == false ) 			// hide/show depending on filter settings
			div.css('display', 'none') ;
		
		div.append($('<img>', { src: 'images/' + ltype + '-icon.png'})) 
		   .append($('<div class="timestamp">' + window.test.benchmark.toSeconds() + '</div>')) 
		   .append($('<div class="msg">' + (window.test.current ? '<b>'+window.test.current.name+'</b>': '') + ' ' + msg + '</div>')) 
		   .prependTo(log) ;
	}
})(jQuery) ;
