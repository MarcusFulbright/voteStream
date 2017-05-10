angular.module('BarcampApp')
	.factory('User', function ($firebase) {
		var User = function (user) {
			this.ref = new Firebase('https://nashvillebarcamp.firebaseio.com/Users/' + user.id);
			this.sync = $firebase(this.ref).$asObject();
			this.sessions = user.sessions || null;
			this.id = user.id;
			this.admin = user.admin;
			this.voting = false;
		};

		User.prototype.updateSessions = function (id, cb) {
			this.voting = true;

			if (!this.sync.sessions) {
				this.sync.sessions = [];
			}

			var idx = this.sync.sessions.indexOf(id);

			if (idx > -1) {
				this.sync.sessions.splice(idx, 1);
			} else if (this.sync.sessions.length >= 4) {
				return this.voting = false;
			} else {
				this.sync.sessions.push(id);
			}

			this.sync.$save().then(function () {
				if (cb) {
					cb();
				}
			});
		}

		return User;
	})
;
