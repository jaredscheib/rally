// var MongoClient = require( 'mongodb' ).MongoClient;
var Mongo = require( 'mongo-gyro' );
var Bluebird = require( 'bluebird' );

// require calls to scripts
var uniqueId = require( '../stubs/uid.js' );
// var validateDeadline = require('../stubs/validate-deadline');

// constants for this file
var NOT_FOUND = 404;
var BAD_REQUEST = 400;
var DELAY = 100;

//temporary
// var testPlan = require( '../stubs/plan-fixture.js' );

//retrieve our custom connection string from environmental variable set in Azure
var connectionString = process.env.CUSTOMCONNSTR_MONGOLAB_URI || process.env.MONGO_CONN;

var mongo = new Mongo( connectionString, { auto_reconnect: true } );

//POST
//saves plan and vote models to respective collections
var save = function( collectionName, obj ) {
  return new Bluebird( function( resolve, reject ) {
    var id = uniqueId();
    obj.id = id;
    mongo.insert( collectionName, obj )
    .then( function() {
      //confirm insert into database since save doesn't return anything useful
      mongo.find( collectionName, {id: obj.id})
      .then( function( foundObj ) {
        console.log( 'Insert successful on document id', obj.id );
      })
      .catch( function( err ) {
        console.log( 'Insert failed on document id', obj.id, err );
      });
      resolve( obj );
    })
    .catch( function( err ) {
      reject( BAD_REQUEST, err );
    });
  });
};

//GET
var find = function( collectionName, query ) {
  if( typeof( query ) === 'object' ) { //if sent in query, currently used for deadlines
    return mongo.find( collectionName, query );
  } else { //else default to id string
    return mongo.find( collectionName, { id: query } );
  }
};

//PUT
var update = function( collectionName, id, obj ) {
  return mongo.findAndModify( collectionName, { id: id }, obj );
};

var remove = function( collectionName, query ) {
  return mongo.remove( collectionName, query );
};

module.exports = {
  find: find,
  save: save,
  update: update,
  remove: remove
};
