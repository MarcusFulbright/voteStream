angular.module('BarcampApp')
	.factory('Session', function ($firebase, $rootScope, $timeout) {
		var Session = function (session) {
			var ref = new Firebase('https://nashvillebarcamp.firebaseio.com/Sessions/' + session.$id);
			this.voteCountRef = $firebase(ref.child('total_votes'));
			this.ref = $firebase(ref);
			this.inSync = this.ref.$asObject();
			this.availability = session.Availability;
			this.id = session.$id;
			this.nid = session.Nid;
			this.summary = session.Body;
			this.speaker = {
				firstName: session['First Name'],
				lastName: session['Last Name'],
				email: session['E-mail']
			};
			this.categories = session['Session Category'];
			if (this.categories) {
				this.categories = this.categories.split(",");
			}
			this.totalSignUps = session['Signup Counts'];
			this.time = session["Time Slot"];
			this.title = session.Title;
			this.room = session.Room;
			this.hashtag = session['Twitter Hashtag'];
			this.uservoted = false;

			this.inSync.$loaded().then(function () {
				this.inSync.removed = this.inSync.removed || false;
				this.totalVotes = this.inSync.total_votes || null;
				this.availability = this.inSync.Availability;
			}.bind(this))
		};

		Session.prototype.updateUserVoteStatus = function () {
			this.uservoted = !this.uservoted;
		};

		Session.prototype.vote = function (user) {
			if (user.voting || !$rootScope.pollingSync.open) return;
			user.updateSessions(this.id, function () {
				var val;
				if (user.sync.sessions) {
					val = user.sync.sessions.indexOf(this.id) > -1 ? 1 : -1;
				} else {
					val = -1;
				}
				this.uservoted = !this.uservoted;

				this.voteCountRef.$transaction(function (current) {
					return current + val;
				}).then(function (snapshot) {
					user.voting = false;
				}, function () {
					user.voting = false;
				});
			}.bind(this));
		};

		return Session;
	})
	.service('SessionListing', function ($firebase, $q, Session) {
		return function () {
			var defer = $q.defer();
			var items = [];
			if (items.length > 0) {
				defer.resolve(items);
			}
			var list = $firebase(new Firebase('https://nashvillebarcamp.firebaseio.com/Sessions')).$asArray();
			list.$loaded().then(function (sessions) {
				sessions.forEach(function (sess) {
					items.push(new Session(sess));
				});
				defer.resolve(items);
			});

			return defer.promise;
		}
	})
;
