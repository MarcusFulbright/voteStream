angular.module('BarcampApp')
	.filter('morning', function () {
		return function (items) {
			return items.filter(function (item) {
				if (item.availability) {
          return item.availability.toLowerCase().indexOf('morning') > -1 && !item.inSync.removed;
				}
			});
		}
	})
;
