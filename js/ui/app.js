var myApp = angular.module('pingApp', ['ngRoute', 'ng']);

////////////////////////////////////////////////////////////////////
// App Configuration
////////////////////////////////////////////////////////////////////
myApp.config(function($routeProvider, $compileProvider) {
	// Fix a.href links for chrome extension
	$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|mailto|chrome-extension):/);
	// Set up routes
	$routeProvider
		.when('/', {
			templateUrl: 'views/main.html',
			controller: 'PingListCtrl'
		})
		.when('/config', {
			templateUrl: 'views/config.html',
			controller: 'ConfigCtrl'
		})
		.when('/json', {
			templateUrl: 'views/json.html',
			controller: 'JsonCtrl'
		})
		.when('/ping/new', {
			templateUrl: 'views/editPing.html',
			controller: 'EditPingCtrl'
		})
		.when('/ping/:pingId/edit', {
			templateUrl: 'views/editPing.html',
			controller: 'EditPingCtrl'
		})
		.otherwise({
			redirectTo: '/'
		});
});

window.testMethod = function(message) {
	console.log(message);
};
