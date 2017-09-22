(function() {
	window.util = {
		isInArray: function (e, arr) {
			for (var i = 0; i < arr.length; i++) {
				if (e === arr[i]) {
					return true;
				}
			}
			return false;
		},
		isNotEmpty: function() {
			var _arg = arguments;
			for (var i = 0; i < _arg.length; i++) {
				if (!_arg[i]) {
					return false;
				}
			}
			return true;
		},
		removeTag: function(e) {
			return e.replace(/<.+?>/ig, '').replace(/\t/g, ' ');
		}
	};
})();