"use strict";

//import {TestInterface} from './TestInterace.js';
//const VERSION = '1.2';
export default class IDB {
  constructor(options={dbname: 'idb-test', store: 'customers'}) {
    //this._idb = getIndexedDBObject('indexedDB');
  }
}

/*
function getIndexedDBObject(name) {
    var prefixedName = name[0].toUpperCase() + name.slice(1);

		return window[name] || window['webkit' + prefixedName] || window['moz' + prefixedName] || window['ms' + prefixedName] ;
}*/

/* ----
(function($){
	var DBNAME = 'idb-test', OBJECTSTORENAME = 'customers', VERSION = 12 ;
	var idb, dbconn ;
	var disabled = false ;

	/*
		options:
			* callback - a callback function which expectes: {setup:true} (succes) or {setup:false} (error) object
	* /
	window.IDB = function(options){
		idb = getIndexedDBObject( 'IndexedDB' ) ;
	}
	window.IDB.prototype = {
		id: 'idb',
		name: 'IndexedDB',
		setup: function(options) {
			openIDB(options) ;
		},
		insert: function(options) {
			if ( disabled == false ) {
				var transaction = dbconn.result.transaction(['customers'], 'readwrite') ;

				var retval = 1 ;
				try {
					var objectStore = transaction.objectStore('customers') ;
					for( var i in options.records ) {
    						objectStore.add(options.records[i]) ;
					}
				} catch(e) {
					window.test.log.error('could not insert records (Error: ' + e.message + ')') ;
					options.callback(0) ;
					retval = 0 ;
				}
				options.callback(retval) ;
			}
			else {
				options.callback(-1) ;
			}
		},
		selectByPK: function(options) {
			if ( disabled == false ) {
				var transaction = getTransaction('readonly') ;
				if ( transaction ) {
					var objectStore = transaction.objectStore(OBJECTSTORENAME) ;
					var request = objectStore.get(options.record[options.columnName]) ;

					request.onsuccess = function(e) {
						request.result[options.validationKey] ;
						options.callback(1);
					}
					request.onerror = function(e) {
						window.test.log.error('could not lookup record: ' + e.message) ;
						options.callback(0) ;
					}
				}
				else
					options.callback(0) ;
			}
			else {
				options.callback(-1);
			}
		},
		selectByUI: function(options) {
			if ( disabled == false ) {
				var transaction = getTransaction('readonly') ;
				if ( transaction ) {
					var objectStore = transaction.objectStore(OBJECTSTORENAME) ;

                	var index = objectStore.index(options.columnName);
                	index.get(options.record[options.columnName]).onsuccess = function(event) {
                			event.target.result[options.validationKey] ;
                			options.callback(1);
                	};
				}
				else
					options.callback(0);
			}
            else {
                options.callback(-1);
            }
		},
		selectMultipleByPK: function(options) {
			if ( disabled == false ) {
				var transaction = getTransaction('readonly') ;
				if ( transaction ) {
					var objectStore = transaction.objectStore(OBJECTSTORENAME) ;

					var boundKeyRange = getIndexedDBObject('IDBKeyRange').bound(options.lowerBound[options.columnName], options.upperBound[options.columnName], false, false);
					var count = 0 ;
					objectStore.openCursor(boundKeyRange).onsuccess = function(event) {
						var cursor = event.target.result;
						if (cursor && (!options.limit || count < options.limit)) {
                    		count ++ ;
                        	cursor.value[options.validationKey] ; // make sure the value is not lazy loaded
                        	cursor.continue();
                    	}
                    	else { // ready
                    		window.test.log.info('Bound search on primary key, found ' + count + ' entries.') ;
                        	options.callback(1);
                    	}
					};
				}
				else
					options.callback(0);
			}
			else {
				options.callback(-1);
			}
		},
		selectMultipleByUI: function(options) {
      		this.selectMultipleByI(options,'unique') ; //this method performs the exact same thing!
    	},
    	selectMultipleByI: function(options, indexType) {
    		if ( disabled == false ) {
				var transaction = getTransaction('readonly') ;
				if ( transaction ) {
					var objectStore = transaction.objectStore(OBJECTSTORENAME) ;

            		var index = objectStore.index(options.columnName);
            		var boundKeyRange = getIndexedDBObject('IDBKeyRange').bound(options.lowerBound[options.columnName], options.upperBound[options.columnName], false, false);
            		var count = 0 ;
            		index.openCursor(boundKeyRange).onsuccess = function(event) {
            			var cursor = event.target.result;
                		if (cursor && (!options.limit || count < options.limit)) {
                			cursor.value[options.validationKey] ;
                			count++ ;
               				cursor.continue();
                		}
                		else { // ready
							window.test.log.info('Bound search on ' + (indexType||'') + ' index, found ' + count + ' entries.') ;
                    		options.callback(1);
                		}
            		};
				}
				else
					options.callback(0);
        	}
        	else {
            	options.callback(-1);
        	}
		},
		cleanup: function() {
			var name = this.name ;
			openIDB({callback:function(retVal){
				window.test.log.info(name + ': Cleanup ' + (retVal == 1 ? 'succeeded':'failed')) ;
			}}) ;
		}
	} ; // end window.IDB.prototype


	function openIDB(options) {

		dbconn = idb.open( DBNAME, VERSION ) ;

		dbconn.onerror = function(event) {
			window.test.log.error('Could not setup an IndexedDB database (' + dbconn.errorCode + ')') ;
			disabled = true ;
			options.callback(0) ;
		};
		dbconn.onsuccess = function(event) {
			// cleanup
			var db = event.target.result ;
			try {
				var transaction = getTransaction('readwrite') ;
				if ( transaction ){
					if ( !options.skip) {
						if ( transaction.db.objectStoreNames.contains(OBJECTSTORENAME) ) {
							var objectStore = transaction.objectStore(OBJECTSTORENAME);
							objectStore.clear() ;
							options.callback(1) ;
						}
						else {
							window.test.log.error('Could not access the object store (Error: ' + e.message + ')') ;
							disabled = true ;
							options.callback(0) ;

						}
					}
					else
						options.callback(-1) ;
				}
				else {
					disabled = true ;
					options.callback(0) ;
				}
			} catch(e) {
				window.test.log.error('Could not access the object store (Error: ' + e.message + ')') ;
				disabled = true ;
				options.callback(0) ;
			}
		} ;
		dbconn.onupgradeneeded = function(event) {
			// Update object stores and indices
			console.info('onupgradeneeded') ;

			var db = event.target.result;

            while (db.objectStoreNames.length) {
              db.deleteObjectStore(db.objectStoreNames[0]);
            }

			var objectStore = db.createObjectStore( OBJECTSTORENAME, {keyPath:"ssn"} ) ;
			objectStore.createIndex("name","name",{unique:false});
			objectStore.createIndex("email","email",{unique:true});
		} ;
	}

	function getIndexedDBObject(name) {
		return window[name[0].toLowerCase() + name.slice(1)]
            || window['webkit' + name] || window['moz' + name] || window['ms' + name] ;
	}
	function getTransaction( mode) {
		try {
			return dbconn.result.transaction([OBJECTSTORENAME], mode ) ;
		}
		catch(e) {
			window.test.log.error('Could not create a transaction (Error: ' + e.message+')') ;
			return null ;
		}
	}
})(jQuery) ; */
