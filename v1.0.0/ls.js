"use strict"; 

(function($){
	var disabled = false ;
	
	window.test.LS = function(options){
		this.id =  'ls' ;
		this.name = 'LocalStorage' ;
	}
	window.test.LS.prototype = {
		setup: function(options) {
			if ( window.localStorage ) {
				localStorage.clear() ;
				options.callback(1) ;
			}
			else {
				window.test.error('LocalStorage is not supported by this browser') ;
				disabled = true ;
				options.callback(0) ;
			}
			
		},
		insert: function(options) {
			if ( disabled == false ) {
				try {
					for( var i in options.records ) 
   						localStorage.setItem(options.records[i].ssn, JSON.stringify(options.records[i])) ;
				} catch(e) {
					window.test.error('Could not insert the records (Error: ' + e.message + ')') ;
					disabled = true ;
					options.callback(0) ;
				}
				options.callback(1) ;
			}
			else {
				options.callback(-1) ;
			}
		},
		selectByPK: function(options) {
			if ( disabled == false ) {
				var record = localStorage.getItem(options.key) ;
				options.callback(1);
			}
			else {
				options.callback(-1) ;
			}
		},
		cleanup: function(){
			if ( window.localStorage ){
				localStorage.clear() ;
				window.test.log.info(this.name + ': cleanup succeeded') ;
			}
		}
	}
})(jQuery) ;
