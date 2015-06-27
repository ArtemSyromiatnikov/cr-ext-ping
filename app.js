/// <reference path="typings/angularjs/angular.d.ts"/>
angular.module('pingApp', [])
	.controller('pingListCtrl', function($scope, $http) {
		$http.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
				
		$scope.probes = [
			{
				title: "Google",
				url: "https://www.google.se/",
				ms: 298
			}, {
				title: "Apple",
				url: "https://www.apple.com/",
				ms: 756
			}, {
				title: "Microsoft",
				url: "https://www.microsoft.com/en-us/default.aspx",
				ms: 1214
			}
		];
		
		$scope.pingNow = function() {
			var pingProbe = function(probe) {
				var startTime = new Date().getTime();
				$http.get(probe.url)
					.success(function(data, status) {
						console.log(probe.url, " - ", status);
						probe.ms = new Date().getTime() - startTime;
					}).error(function(data, status) {
						console.warn(probe.url, " - ", status);
						//probe.ms = -1;
						probe.ms = new Date().getTime() - startTime;
					});
				/*var xhr = new XMLHttpRequest();
			    xhr.open("GET", probe.url, true);
				xhr.onload = function() {
					console.log(probe.url, " - ", xhr.status);
					probe.ms = new Date().getTime() - startTime;
				};
				xhr.onerror = function() {
					console.warn(probe.url, " - ", xhr.status);
					//probe.ms = -1;
					probe.ms = new Date().getTime() - startTime;
				};
				xhr.send();*/
			};
			
			for(var i=0; i<$scope.probes.length; i++) {
				pingProbe($scope.probes[i]);
			}
		};
		
	});