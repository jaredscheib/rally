var hogan = window.Hogan;

window.VoteOptionsView = Backbone.View.extend({

  tagName: 'div',

  className: 'voteOptionsView',

  template: hogan.compile( ['<span id="affirmation">Great! Where to?</span>',
              '<div id="options">',
                '{{#currentRoundOptions}}',
                '<input class="priority" type="button" value="{{name}}" data-index="{{index}}">',
                  //'<span id="rec1-title">{{title}}</span>', //modify when decide on final recommendation properties to display
                  //'<span id="rec1-description"></span>',
                  //'<span id="rec1-cost"></span><span id="rec1-rating"></span>',
                '{{/currentRoundOptions}}',
              '</div>',
              '<div id="vote">',
                '<input id="submitVote" type="button" value="Vote!">',
              '</div>',
              // '<div id="counters">',
              //   '<span id="rally-eta">{{ ??? }}</span>',
              //   '<span id="round-number">{{ currentRound + '/' + rounds.length }}</span>',
              //   '<span id="round-deadline">{{ ??? }}</span>',
              // '</div>',
              ].join('\n') ),

  initialize: function(){
    this.render();
    // this.model.on( 'change', this.render.bind( this ) ); // ??? remove this once we ascertain the order of fetch
    this._voteModel = new window.VoteModel({
      planId: this.model.get( 'id' ),
      userVotes: [],
      currentRoundNum: this.model.get( 'currentRoundNum' )
    });
  },

  events: {
    'click .priority': function(event){
      event.preventDefault();
      $(event.currentTarget).attr( 'disabled', 'disabled' );
      this.controller.setPriority.call( this, Number(event.currentTarget.dataset.index) );
    },
    'click #submitVote': function(event){
      event.preventDefault();
      $(event.currentTarget).attr( 'disabled', 'disabled' );
      this.controller.submitVote.call( this );
    }
  },

  render: function(){
    this.$el.html( this.template.render( this.model.attributes ) );
    return this;
  },

  controller: {
    setPriority: function( option ){
      var userVotes = this._voteModel.get( 'userVotes' );
      userVotes.push( option );
      this._voteModel.set( 'userVotes', userVotes );
      var currentRoundOptions = this.model.get( 'currentRoundOptions' );
      if( userVotes.length === currentRoundOptions.length ){
        $( '#submitVote' ).trigger( 'click' );
      }
    },

    submitVote: function(){
      var context = this;
      this._voteModel.save()
      .then( function( response ) {
        if( response.expired === true ) {
          router.navigate( '/' + context.model.get( 'id' ) + '/round/' + context.model.get( 'currentRoundNum' ) + '/expired', { trigger: true } );
        } else {
          router.navigate( '/' + context.model.get( 'id' ) + '/round/' + context.model.get( 'currentRoundNum' ) + '/voted', { trigger: true } );
        }
      });

    }

  }

});
