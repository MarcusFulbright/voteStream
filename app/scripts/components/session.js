'use strict';

const SessionCtrl = function($scope, $element, $attrs) {

  // Variables
  this.isChecked = null;
  this.polling = null;
  this.maxVotes = 4;


  // Component Lifecycle events

  // Can use this when resetting the votearray. This will return a changes.vote array with the new value from the controller. Then I can recheck which checkboxes are checked
  this.$onChanges = function(changes) {
    // Any time there is a change made to $scope.voteArray from the parent controller, this function will fire.
    // Using this on init and reset to set each checkbox checked value.
    if (changes.votes) {
       this.isChecked = this.arrayHasVote();
    }
 };


   // Component Methods
  // Determines if checkboxes are disabled. Will be disabled if a user is not in edit mode or if a user has voted more than the maxVotes amount
  this.isDisabled = function() {
    if (this.votes.length === this.maxVotes && !this.arrayHasVote()) {
      return true;
    } else if (!this.hasVoted) {
      return true;
    } else {
      return false;
    }
  };

  // Determines if a checkbox will be added / removed from the voteArray when being checked
  this.check = function() {
    // If a checkbox has been checked and is not in the voteArray, add the index to the array
    if (this.isChecked && !this.arrayHasVote()) {
      this.addVote({ index: this.index });
      // If a checkbox has been unchecked and is in the voteArray, remove the index to the array
    } else if (!this.isChecked && this.arrayHasVote()) {
      this.removeVote({ index: this.index });
    }
    // Calculate remaining votes
    this.getRemainingVotes();
  };

  // Function that determines if a polling session is open or not. This will hide / show the checkbox
  this.isVotingOpen = function() {
      return (this.polling.open && this.polling.sessions === this.sessionType);
  };

  // Determines if a session instance has been voted for or not
  this.arrayHasVote = function() {
		return this.votes.includes(this.index.toString());
  };
};

app.component('session', {
    templateUrl: './templates/singleSession.html',

    controller: SessionCtrl,

    bindings: {
        session: '<',
        polling: '<',
        sessionType: '<',
        index: '<',
        votes: '<',
        hasVoted: '<',
        addVote: '&',
        removeVote: '&',
        getRemainingVotes: '&',
    }
});
