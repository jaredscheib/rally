var calculateWinner = require( './calculate-winner' );
var sendEmails = require( './send-emails' );
// var db = require( '../stubs/db' );
var db = require( './mongodb.js' );

module.exports = function( plan, roundNumber ) {
  var winner = calculateWinner( plan, roundNumber );
  plan.rounds[ roundNumber ].winner = winner;
  db.update( 'plan', plan.id, plan );
  sendEmails( plan, roundNumber + 1 );
};