"use strict" ;

/* Seeded random number generator 
 * see: http://stackoverflow.com/questions/424292/how-to-create-my-own-javascript-random-number-generator-that-i-can-also-set-the
 */
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
	var names   = ['Bill',  'Bob', 'Bratt', 'Donna', 'Joyce', 'Chris', 'Angelina',  'George', 'Obama', 'Jill', 'Thomas', 'Martin', 'Louise', 'Francesca', 'Holly','Sarah','Zoe'] ;
	var rand = window.test.rand ; // shortcut
	var upper, lower ; // bounds
	var singleValueIndex = {} ;
	var multiValueBounds = {} ;
	var bounds ;

	window.test.data = {
		records: null,
		create: function(options) {
			// structure: {ssn:"111-11-1115",name:"Donna",age:12,email:"donna123@gmail.org"}
			window.test.benchmark.start() ;
			
			var generateRecords = false ;
			if ( !window.test.data.records || window.test.data.records.length != options.numberOfRecords || oldSeed != options.seed) { // any changes ?
				generateRecords = true ;
				window.test.data.records = [] ;
				window.test.seed = (oldSeed = options.seed) ;
			
				var name ;
				for( var i = 0; i < options.numberOfRecords; i++) {
					window.test.data.records.push( {
						ssn:   generateSsn(),
						name:  (name = names[rand(0,16)]),
						email: name + '@' + randomStr(5) + '.' + randomStr(3),
						age:   rand(0,100)
					}) ;
				}
			}
			
			if ( generateRecords == true || didBoundsChange(options.bounds, bounds) == true ) {
				setBounds(options) ;
				bounds = options.bounds ;
			}
		
			window.test.log.info('Created ' + options.numberOfRecords + ' records in ' + window.test.benchmark.toSeconds(window.test.benchmark.end())) ;
		},
		getSingleValueRecordBy: function(key) {
			return window.test.data.records[singleValueIndex[key]] ;
		},
		getMultiValueBounds: function(key) {
			return multiValueBounds[key]  ;
		},
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
	
	function didBoundsChange(b1, b2) {
		for( var k in b1) {
			if ( b1[k] != b2[k] )
				return true ;
		}
		return false ;
	}
	
	function setBounds(options) {
		// select a record which needs to be found by the storage eninges
		singleValueIndex.selectByPK = rand(0, options.numberOfRecords-1) ;
		singleValueIndex.selectByUI = rand(0, options.numberOfRecords-1) ;
		singleValueIndex.selectByI = rand(0, options.numberOfRecords-1) ;
		
		// set upper/lower bounds so that a specified number of records will match
		setBoundsBy( 'ssn', options.bounds.pk) ;
		setBoundsBy( 'email', options.bounds.ui) ;
		// add a limit to the query 
		setBoundsBy( 'name', options.bounds.i, {limit: options.bounds.i} ) ;
		setBoundsBy( 'age', options.bounds.wi, {limit: options.bounds.wi} ) ;
	}
	
	function setBoundsBy(key, numberOfMatches, preset) {
		var sorter = function(a,b){
			return a[key] > b[key] ? 1 : a[key] == b[key] ? 0 : -1 ;
		}
		
		var sortedRecords = window.test.data.records.sort(sorter) ;
		multiValueBounds[key] = (preset||{}) ;
		var lowerBoundIndex = rand(0, window.test.data.records.length - numberOfMatches - 1) ;
		multiValueBounds[key].lowerBound = sortedRecords[lowerBoundIndex] ;
		multiValueBounds[key].upperBound = sortedRecords[lowerBoundIndex + numberOfMatches -1] ;
	}
})(jQuery) ;

