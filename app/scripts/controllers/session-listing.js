'use strict';

app.controller('SessionListingCtrl', function($scope, $location, Vote, User, Constants, AuthUser, PollingPeriod, SessionList) {
	//jQuery activation
	$('#myTabs a').click(function (e) {
		e.preventDefault();
		$(this).tab('show');
	});

	// Scoped Variables
	$scope.maxVotes = Constants.maxVotes;
	$scope.user = AuthUser;
	$scope.polling = PollingPeriod;
	$scope.sessions = SessionList;

	// Methods
	$scope.addVote = index => {
		// $scope.voteArray = ["5", "7"]; // This will change which checkboxes are checked
		//this.voteArray = []; // Example, this will trigger a change
		$scope.voteArray.push(index.toString());
		console.log('this.voteArray', $scope.voteArray);
	};

	$scope.editMode = () => {
		$scope.hasUserVoted = false;
	};

	$scope.getRemainingVotes = () => {
		$scope.remainingVotes = $scope.maxVotes - $scope.voteArray.length;
	};

	$scope.isVotingOpen = (session) => {
		return ($scope.polling.open && $scope.polling.sessions === session);
	};

	$scope.logout = () => {
		User.userLogout();
		$location.path('/login');
	};

	$scope.removeVote = index => {
		$scope.voteArray.splice($scope.voteArray.indexOf(index.toString()), 1);
		console.log('this.voteArray', $scope.voteArray);
	};

	$scope.resetVote = () => {
		// If a user resets votes while there are no votes, do nothing. Display modal?
		if (!$scope.voteArray.length) {
			$scope.voteArray = [];

		// Only set hasVoted to true if there have been previous votes
		} else if ($scope.voteArray.length) {
			const votes = window.document.cookie.split('voteArray=')[1].split(';')[0];
			$scope.voteArray = (votes !== '') ? votes.split(',') : [];
			$scope.hasUserVoted = (votes !== '') ? true : false;
		}

		$scope.getRemainingVotes();
		console.log("reset $scope.voteArray", $scope.voteArray);
	};

	$scope.setCookie = () => {
			const d = new Date();
			d.setTime(d.getTime() + (30*60*1000));
			const expires = `expires=${d.toUTCString()}`;
			window.document.cookie = `voteArray=${$scope.voteArray};${expires};`
	};

	$scope.updateModalMsg = () => {
		if($scope.voteArray.length < 3 || $scope.voteArray.length === 4) {
			$scope.errorMessage = `Thanks, you have ${$scope.maxVotes - $scope.voteArray.length} votes left.`; // Update message
		} else {
			$scope.errorMessage = `Thanks, you have ${$scope.maxVotes - $scope.voteArray.length} vote left.`; // Update message
		}
	};

	$scope.finishVote = () => {
		$scope.setCookie();
		$scope.hasUserVoted = true;
		$scope.updateModalMsg();
	}


	// Submit user's votes and increment session's total_count in services/vote.js
	$scope.voteSubmit = () => {
		const jsonArray = JSON.stringify($scope.voteArray);

		// If user has not voted, increment
		if (!window.document.cookie.includes('voteArray')) {
			Vote.updateUserVotes($scope.user, jsonArray)  // Update votes in services/vote.js
				.then(function(response){
					Vote.incrementSessionVoteCount($scope.voteArray, $scope.sessions) // Increment votes
				});

			$scope.finishVote();

		// If the user has already voted, increment or decrement in edit mode.
		} else if (window.document.cookie.includes('voteArray')) {  // if a cookie exist, compare old values
			let cookie = window.document.cookie.split('voteArray=')[1].split(';')[0]; // returns string "1,2,3,4"

			// compare votes
			let newVote = $scope.voteArray;
			let oldVote = (cookie !== "") ? cookie.split(',') : [];

			// let unchangedVotes = newVote.filter(x => oldVote.indexOf(x) != 1); // votes - no change
			let incrementVote = newVote.filter(x => oldVote.indexOf(x) == -1); // array of votes to decrement
			let decrementVote = oldVote.filter(x => newVote.indexOf(x) == -1); // array of votes to increment

			console.log('incrementVote', incrementVote);
			console.log('decrementVote', decrementVote);

			// Update votes in services/vote.js
			Vote.updateUserVotes($scope.user, jsonArray)
				.then(function(response) {
						Vote.decrementSessionVoteCount(decrementVote, $scope.sessions); // decrement
				}).then(function(response) {
						Vote.incrementSessionVoteCount(incrementVote, $scope.sessions); // increment
				});

			$scope.finishVote();

		} else {
			$scope.errorMessage = "Please select a session.";
		}

	};


	// Initial page JS - need methods to be defined before this is executed
	if (window.document.cookie.includes('voteArray')) {
		// Store the votes string e.g. '0,2,5' or ''
		const votes = window.document.cookie.split('voteArray=')[1].split(';')[0];
		// Determine if votes string has votes or is and empty string and assign voteArray and hasVoted values accordingly
		$scope.voteArray = (votes !== '') ? votes.split(',') : [];
		$scope.hasUserVoted = (votes !== '') ? true : false;
	} else {
		$scope.voteArray = [];
		// Setting cookie to help determine if user has not voted by initially storing an empty voteArray on the cookie
		$scope.setCookie();
	}

	$scope.getRemainingVotes();


});
