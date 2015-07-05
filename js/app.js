/// <reference path="typings/angularjs/angular.d.ts"/>
angular.module('pingApp', ['ngRoute'])
	.config(function($routeProvider){
		$routeProvider
			.when('/', {
				templateUrl: 'views/main.html',
				controller: 'PingListCtrl'
			})
			.when('/config', {
				templateUrl: 'views/config.html',
				controller: 'ConfigCtrl'
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
	})
	.constant("CONST", {
		quality: {
			good: 'good',
			avg: 'avg',
			bad: 'bad',
			none: 'none'
		}
	})
	.factory("probeFactory", function(CONST, $http) {
		var probeData = [],
			probes = [],
			createProbe = function(probeData) {
				return {
					data: probeData,
					inProgress: false,
					quality: CONST.quality.none,
					ms: 0,
					setMs: function(value) {
						this.ms = value;
						if (this.ms > 0 && this.ms < 500) {
							this.quality = CONST.quality.good;
						} else if ( this.ms < 1000) {
							this.quality = CONST.quality.avg;
						} else {
							this.quality = CONST.quality.bad;
						}
					},
					ping: function() {
						var self = this,
							startTime = new Date().getTime();
						this.inProgress = true;
						$http.get(this.data.url)
							.success(function(data, status) {
								//console.log("SUCCESS: ", self.data.url, " - ", status);
								self.setMs(new Date().getTime() - startTime);
								self.inProgress = false;

							}).error(function(data, status) {
								//console.warn("FAIL: ", self.data.url, " - ", status);
								self.setMs(new Date().getTime() - startTime);
								self.inProgress = false;
							});
					}
				}
			};

		return {
			initProbes: function(probeDataArr) {
				probeData = probeDataArr;
				probes = probeData.map(createProbe, this);
			},
			getPingDataList: function() {
				return probeData;
			},
			getProbes: function() {
				return probes;
			},
			getProbe: function(id) {
				var probe = probeData.filter(function(probe) { return probe.id === id; });
				return probe[0];
			},
			createProbe: function(newProbe) {
				newProbe.id = Math.ceil(Math.random()*1000000);
				probeData.push(newProbe);
				probes.push(createProbe(newProbe));
			},
			editProbe: function(id, data) {
				var probe = this.getProbe(id);
				if (probe) {
					probe.title = data.title;
					probe.url = data.url;
				}
			},
			removeProbe: function(id) {
				var probe = this.getProbe(id),
					probeIx = probeData.indexOf(probe);
				probeData.splice(probeIx, 1);
				probes.splice(probeIx, 1);
			}
		};
	})
	.controller('ConfigCtrl', function($scope, probeFactory) {
		$scope.pingDataList = probeFactory.getPingDataList();
		$scope.remove = function(id) {
			probeFactory.removeProbe(id);
		}
	})
	.controller('PingListCtrl', function($scope, $http, probeFactory) {
		probeFactory.initProbes(PROBES);
		$scope.probes = probeFactory.getProbes();

		$scope.pingNow = function() {
			$scope.probes.forEach(function(probe){
				probe.ping();
			}, this);
		};

	})
	.controller('EditPingCtrl', function($scope, $http, probeFactory, $location, $routeParams) {
		var id = Number($routeParams.pingId);
		if (id) {
			var probe = probeFactory.getProbe(id);
			$scope.isNew = false;
			$scope.title = probe.title;
			$scope.url = probe.url;
		} else {
			$scope.isNew = true;
		}

		$scope.saveProbe = function() {
			if (id) {
				probeFactory.editProbe(id, {
			      title: $scope.title,
			      url: $scope.url
				});
			} else {
				// TODO: Add real validation!
				if ($scope.title && $scope.url) {
					probeFactory.createProbe({
				        title: $scope.title,
				        url: $scope.url
					});
				}
			}
			$location.path("/config");
		};
	});
