"use strict" ;

$(function(){ // onload
	var wsql = new WSQL() // also used to create mysql dump
	var dbsPointer = -1;
	var dbs = [
		{ obj: new window.test.LS(), enabled: true },
		{ obj: new IDB(), enabled: true },
		{ obj: wsql, enabled: true}
	] ;
	var testPlanPointer = 0 ;
	var testPlan = [
			  { method: 'setup' },
			  { method: 'insert', records: true },
			  { method: 'selectByPK', columnName: 'ssn', validationKey: 'email'}, 			// selection based on Primary Key
			  { method: 'selectByUI', columnName: 'email', validationKey: 'age'},			// selection based on a unique index
			  { method: 'selectMultipleByPK', columnName: 'ssn', validationKey: 'name'},	// bound search on Primary Key
			  { method: 'selectMultipleByUI', columnName: 'email', validationKey: 'name'},	// bound search on a unique index
			  { method: 'selectMultipleByI', columnName: 'name', validationKey: 'email'},	// bound search on a index
			  { method: 'selectMultiple', columnName: 'age', validationKey: 'email'},		// bound search wihout an index
			] ;
	
	window.test.go = function(options) {
		window.test.log.clear() ;
		window.test.benchmark.init() ;
		
		window.test.data.create(options.numberOfRecords, options.seed) ;
		for( var i in testPlan ) { // extend options
			testPlan[i].callback = window.test.callback ; // add callback function
			if ( testPlan[i].records )
				testPlan[i].records = window.test.data.records ;
		}
		for( var i in dbs )  // enable/disable test
			dbs[i].enabled = options.dbsEnabled[dbs[i].obj.id] ;
		
		dbsPointer = -1 ;
		window.test.executeTestPlan() ;
	} ;
	
	window.test.executeTestPlan = function(next) {
		// select storage api
		if ( next || dbsPointer == -1 || testPlan.length == testPlanPointer )  { 
			if ( ++dbsPointer == dbs.length ) // done
				return ; 
			window.test.current = dbs[dbsPointer].obj ;
			testPlanPointer = 0 ;
			if ( !dbs[dbsPointer].enabled )
				return window.test.executeTestPlan(true) ;
		}
		
		// execute the plan
		var options = testPlan[testPlanPointer] ;
		window.test.benchmark.start() ;
		$('#' + window.test.current.id + ' .' + options.method + ' .status').addClass('in-progress') ;
		options.skip = !$('#test-headers input.' + options.method).is(':checked') ;
		if ( typeof(window.test.current[options.method]) == 'function' && (!options.skip || options.method == 'setup') ) { // test implemented?. Always execute the setup test => db connection stuff
			if ( options.method.match(/Multiple/) ) {
				window.test.current[options.method]( $.extend(options, window.test.data.getLowerUpperBoundBy(options.columnName)) ) ;
			}
			else {
				window.test.current[options.method]( $.extend(options, { record: window.test.data.record } )) ;
			}
		}
		else
			window.test.callback(-1) ;
	} ;
	
	/* status:
		0 - error 
		1 - ok
		2 - not implemented
	*/
	window.test.callback = function(status) {
		setTimeout( function(){
			var parent = '#' + window.test.current.id + ' .' + testPlan[testPlanPointer].method ; // container element for test results
			$('.status', parent).removeClass('in-progress').addClass(status == 1 ? 'ok' : (status == 0 ? 'error':'skip')) ;
			if ( status == 1) // add time taken by the test
				$('.time-spent', parent).html(window.test.benchmark.toSeconds(window.test.benchmark.end())) ;
		
			testPlanPointer++ ;
			window.test.executeTestPlan() ;
		}, 5 ) ;
	} ;
	
	window.test.cleanup = function() {
		for(var i in dbs ) {
			dbs[i].obj.cleanup() ;
		}
	} ;
}) ;
