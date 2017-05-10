angular.module('BarcampApp')
	.filter('afternoon', function () {
		return function (items) {
			return items.filter(function (item) {
				if (item.availability) {
				  return item.availability.toLowerCase().indexOf('afternoon') > -1 && !item.inSync.removed;
				}
			});
		}
	})
;
