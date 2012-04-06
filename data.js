"use strict" ;

/* Seeded random number generator */
(function($){
	var config = {
			A: 48271,
			M: 2147483647
	}
	config.Q = config.M / config.A ;
	config.R = config.M % config.A ;
	config.X = 1.0 / config.M ;
	
	window.test.seed = 84600 ;
	window.test.rand = function(min, max) {
		window.test.seed = config.A * (window.test.seed % config.Q) - config.R * (window.test.seed / config.Q);
	  	window.test.seed <= 0 && (window.test.seed += config.M) ;
	  	return Math.round((max-min) * (window.test.seed * config.X) + min) ;
	}
})(jQuery) ;

// create the data
(function(){
	var records, oldSeed ;
	var chars = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
	var names   = ['Bill', 'Donna', 'Joyce', 'Chris', 'Bob', 'Angelina', 'Bratt', 'George', 'Obama', 'Jill', 'Thomas', 'Martin', 'Louise', 'Francesca', 'Holly','Sarah','Zoe'] ;
	var rand = window.test.rand ; // shortcut
	var upper, lower ; // bounds

	window.test.data = {
		records: null,
		create: function(num, seed) {
			num = parseInt(num) ;
			// structure: {ssn:"111-11-1115",name:"Donna",age:12,email:"donna123@gmail.org"}
			if ( window.test.data.records && window.test.data.records.length == num && oldSeed == seed) // any changes ?
				return records ;
			window.test.data.records = [] ;
			window.test.seed = (oldSeed = seed) ;
			
			var name ;
			for( var i = 0; i < num; i++) {
				window.test.data.records.push( {
					ssn:   generateSsn(),
					name:  (name = names[rand(0,16)]),
					email: name + '@' + randomStr(5) + '.' + randomStr(3),
					age:   rand(0,100)
				}) ;
			}
			
			// test are performed on one record or two record (bound search with upper/lower bound)
			window.test.data.record = window.test.data.records[rand(0, num-1)] ;
			var bound = rand(0, num-2) ; 
			lower = window.test.data.records[rand(0,bound-1)] ; // exclude the bound value 
			upper = window.test.data.records[rand(bound, num-1)] ;// include the bound value
		},
		getLowerUpperBoundBy: function(key) { // the lower/upper bounds are different for each key (column name)
			return { lowerBound: lower[key] > upper[key] ? upper : lower, 
					 upperBound: lower[key] < upper[key] ? upper : lower 
				   } ;
		}
	}

	function generateSsn() { // ssn: 1253-3456-2342 (unique identifier)
		return ''    + rand(0,9) + rand(0,9)  + rand(0,9) + rand(0,9) +
		       '-'   + rand(0,9) + rand(0,9)  + rand(0,9) + rand(0,9) +
		       '-'   + rand(0,9) + rand(0,9)  + rand(0,9) + rand(0,9) ;
	}

	function randomStr(length) {
    		var str = '';
    		for (var i = 0; i < length; i++) {
       			str += chars[rand(0,35)] ;
    		}
    		return str;
	}
})(jQuery) ;

