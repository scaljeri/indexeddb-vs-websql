"use strict";

(function($){
	var DBNAME = 'wsql-test', TABLENAME = 'customers', VERSION = 1 ;
    var dbconn, disabled = false ;

    window.WSQL = function(options){
    	this.id = 'wsql' ;
		this.name = 'WebSQL' ;
	} ;

	window.WSQL.prototype = {
		setup: function(options) {
			if ( window.openDatabase ) {
				try {
		 			dbconn = openDatabase(DBNAME, VERSION, 'performance test database', 10 * 1024 * 1024); // 10MB in size
		 			if ( !options.skip) {
		 				dbconn.transaction(function (tx) {
        	 				tx.executeSql('DROP TABLE IF EXISTS customers') ;
                 			tx.executeSql('CREATE TABLE IF NOT EXISTS customers (ssn TEXT PRIMARY KEY, email TEXT NOT NULL, name TEXT, age INTEGER, UNIQUE(email))') ;
                 			tx.executeSql('CREATE INDEX email_idx ON customers (email)') ;
        				}, function(err){
        					window.test.error( 'could not create table (Error: ' + err.message + ')') ;
        					disabled = true ;
        					options.callback(0) ;
        				}, function(){
        					options.callback(1) ;
        				});
		 			}
		 			else 
		 				options.callback(-1) ;
				} catch(e) {
					window.test.error('could not connect to the database (Error: ' + e.message + ')') ;
					//window.test.info
					disabled = true ;
					options.callback(0) ;
				}
			} else {
				window.test.log.error('WebSQL is not supported by this browser') ;
				disabled = true ;
				options.callback(0) ;
			}
		},
		insert: function(options) {
			if ( disabled == false ) {
				dbconn.transaction( function(tx) {
						var record, sql, i ;
						for( i in options.records )  {
							record = options.records[i] ;
							tx.executeSql('INSERT INTO ' + TABLENAME + ' (ssn, email, name, age) VALUES(?,?,?,?)', 
									[ record['ssn'], 
									  record['email'], 
									  record['name'], 
									  record['age']
									]
							) ;
						}
				}, function(err) {
					window.test.error( 'could not insert records (Error: ' + err.message + ')') ;
					window.test.info( 'record ' + i + ' failed: ' + JSON.stringify(record) ) ;
					disabled = true ;
					options.callback(0) ;
				}, function(){ 
					options.callback(1);
				}) ;
			}
			else {
				options.callback({setup:-1});
       		}
		},
		selectByPK: function(options) {
			select(options) ;
		},
       	selectByUI: function(options ) {
    	  	select(options)  ;
       	},
       	selectMultipleByPK: function(options) {
     	   select(options, 'Bound search on primary key') ;
       	},
       	selectMultipleByUI: function(options) {
    	  	select(options, 'Bound search on unique index')  ;
       	},
       	selectMultipleByI: function(options) {
    	  	select(options, 'Bound search on non-unique index')  ;
       	},
       	selectMultiple: function(options) {
     	   select(options, 'Bound search without an index') ;
       	},
       	cleanup: function() {
       		var name = this.name ;
       		this.setup({callback: function(retVal){
       			window.test.log.info(name + ': Cleanup ' + (retVal == 1 ? 'succeeded':'failed')) ;
       		}})
       	}
	}
   	function select(options, startInfoMsg) {
		if ( disabled == false ) {
    		   dbconn.transaction( function(tx) {
    			   var sql = 'SELECT * FROM ' + TABLENAME + ' WHERE ' ;
    			   if ( options.record ) {
    				  sql += options.columnName + ' = "' + options.record[options.columnName] + '"' ; 
    			   }
    			   else {
    				   sql += options.columnName + ' >= "' + options.lowerBound[options.columnName] + '" AND ' + options.columnName + ' <= "' + options.upperBound[options.columnName] + '"';
    			   }
    			   window.test.log.debug(sql) ;
                   tx.executeSql(sql, [], function (tx, results) {
                	   if ( startInfoMsg )
                		   window.test.log.info( startInfoMsg + ', found ' + results.rows.length + ' entries') ;
                	   if ( results.rows.length > 0 ) {
    				   		for( var i = 0; i < results.rows.length; i++) {
    					   		results.rows.item(i).ssn ;
    				   		}
                       		options.callback(1);
                	   }
                       else {
                       	 	window.test.log.debug('No records found') ;
                       	 	options.callback(0);
                       }
                   }, function(t, err){
                	   window.test.log.debug('SQL: ' + sql) ;
    				   window.test.log.error('query failed: ' + err.message) ;
    				   options.callback(0);
                   }) ;
           		}) ;
            }
            else {
            	options.callback( { status: -1 }) ;
            }
	}	
})(jQuery) ;
