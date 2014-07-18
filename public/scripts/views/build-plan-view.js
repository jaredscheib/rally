// var Hogan = require( "hogan" );
var hogan = window.Hogan;

window.BuildPlanView = Backbone.View.extend({

  template: hogan.compile( [ '<div class="buildPlan">',
    '<p>',
      'My name is <input type="text" name="hostName" placeholder="Full Name" value="Nicholas Henry">.',
    '</p>',
    '<p>',
      'I want to ',
      '<select name="hostWhat">',
        '<option value="bars">drink</option>',
        '<option value="restaurants">eat</option>',
      '</select> near ',
      '<input type="text" name="hostWhere" placeholder="location" value="the Presidio"> at ',
      '<input type="time" name="hostWhen" value="21:30"> with ',
      '<input type="text" name="hostWho" placeholder="emails of friends" value="Mike,Jared">.',
    '</p>',
    '<p>',
      'Let\'s finalize this rally within the next ',
      '<select name="finalVoteEnd">',
        '<option value="5">5</option>',
        '<option value="15">15</option>',
        '<option value="30">30</option>',
      '</select>',
      ' minutes.',
    '</p>',
    '<button type="button" class="createEvent">Checkmark Image</button>',
    '<button type="reset" class="clear">Clear</button></div>' ].join("") ),



  initialize: function() {
    this.render();
    // save references to the inputs once so we don't have to perform mutliple $() selections
    this._$hostWhen = this.$el.find( '[name="hostWhen"]' );
    this._$hostWho = this.$el.find( '[name="hostWho"]' );
    this._$hostWhat = this.$el.find( '[name="hostWhat"]' );
    this._$hostWhere = this.$el.find( '[name="hostWhere"]' );
    this._$hostName = this.$el.find( '[name="hostName"'] );
    this._$finalVoteEnd = this.$el.find( '[name="finalVoteEnd"]' );
  },

  events: {
    'click .createEvent': 'createEvent',
    'click .clear': 'render'
  },

  getValues: function() {
    return {
      hostWho: this._$hostWho.val(),
      hostName: this._$hostName.val(),
      hostWhat: this._$hostWhat.val(),
      hostWhere: this._$hostWhere.val(),
      hostWhen: this._$hostWhen.val(),
      finalVoteEnd: this._$finalVoteEnd.val()
    };


  },

  createEvent: function( e ) {
    if( e ) {
       e.preventDefault();
     }

    var when = this.$el.find( '[name="hostWhen"]' ).val();
    var end = this.$el.find( '[name="finalVoteEnd"]' ).val();
    var who = this.$el.find( '[name="hostWho"]' ).val();

    //Sets the planModel host values equal to the form inputs
    this.model.set( 'hostWho', this.parseInvites( who ) );
    this.model.set( 'hostName', this.$el.find( '[name="hostName"]' ).val() );
    this.model.set( 'hostWhat', this.$el.find( '[name="hostWhat"]' ).val() );
    this.model.set( 'hostWhere', this.$el.find( '[name="hostWhere"]' ).val() );
    this.model.set( 'hostWhen', this.makeWhen( when ) );
    this.model.set( 'createdAt', moment().startOf( 'minute' ).add( 'minutes', 1 ) ); //round createdAt up to nearest minute for easy db use
    this.model.set( 'finalVoteEnd', this.makeEnd( end ) );
    this.model.set( 'attending', 1 );
    
    //Saves the planModel host values to the db then navigate to the first round vote page.
    var self = this;
    this.model.save().then( function( response ) {
      router.navigate( '/' + self.model.get( 'id' ) + '/round/' + self.model.get( 'currentRoundNum' ), { trigger: true } );
    });
  },

  makeWhen: function( time ) {
    var now = moment();
    var hr = time.slice( 0, 2 );
    var min = time.slice( 3, 5 );
    now.hours( hr );
    now.minutes( min );
    now.seconds( 00 );
    return now;
  },

  makeEnd: function( minutes ) {
    var now = moment().startOf( 'minute' ).add( 'minutes', 1 ); //round to nearest minute and add 1 to remain relative to createdAt
    now.add( 'minutes', minutes );

    return now;
  },

  //Remove all spaces and split email entries into an array of emails.
  parseInvites: function(emailString) {
    return emailString.replace( /\s/g, '' ).split( ',' );
  },

  render: function() {
    this.$el.html( this.template.render( this.model.attributes ) );
    return this;
  }

});