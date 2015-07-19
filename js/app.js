angular.module('pingApp', ['ngRoute'])
	.constant("CONST", {
		quality: {
			good: 'good',	// quick response
			avg: 'avg',		// average response time
			bad: 'bad',		// long response time
			fail: 'fail'	// site unavailable!
		}
	})
	.factory("probeFactory", function($http) {
		var ls = localStorage || {},
			probeData,

			getProbeData = function() {
				if (ls.probeData) {
					probeData = JSON.parse(ls.probeData);
				}
				return probeData || [];
			},
			saveProbeData = function() {
				if (angular.isArray(probeData)) {
					ls.probeData = JSON.stringify(probeData);
					console.log("Saving probe data: ", ls.probeData);
				}
			},
			generateNewId = function() {
				var maxId = probeData
					.map(function(probe) { return probe.id })
					.reduce(function(max, probeId) {
						return Math.max(max, probeId);
					}, 0);
				return maxId + 1;
			},
			// First-run initialization.
			initialize = function(defaultProbes) {
				if (ls.probeData) {
					probeData = getProbeData();
				} else {
					var id = 1;
					probeData = defaultProbes.map(function(probe) {
						probe.id = id++;
						return probe;
					});
					saveProbeData();
				}
			};

		initialize(PROBES);

		return {
			getProbes: function() {
				return angular.copy(probeData);
			},
			getProbe: function(id) {
				var probe = probeData.filter(function(probe) { return probe.id === id; })[0];
				return angular.copy(probe);
			},
			createProbe: function(newProbe) {
				newProbe.id = generateNewId();
				probeData.push(newProbe);
				console.log("New probe: ", newProbe);

				saveProbeData();
			},
			saveProbe: function(data) {
				var probe;
				if (data.id) {
					probe = probeData.filter(function(probe) { return probe.id === data.id; })[0];
					if (probe) {
						probe.title = data.title;
						probe.url  = data.url;
					}
				}
				if (!probe) {
					data.id = generateNewId();
					probeData.push(data);
				}

				saveProbeData();
			},
			removeProbe: function(id) {
				var probe = probeData.filter(function(probe) { return probe.id === id; })[0];
					probeIx = probeData.indexOf(probe);
				if (probeIx >= 0) {
					probeData.splice(probeIx, 1);
					saveProbeData();
				}
			},
			importProbes: function(probes) {
				probeData = [];
				if(angular.isArray(probes)) {
					var id = 1;
					probeData = probes
						.filter(function(probe) {
							return angular.isString(probe.title) && angular.isString(probe.url);
						})
						.map(function(probe) {
							return {
								id: id++,
								title: probe.title,
								url: probe.url
							};
						});
				}
				saveProbeData();
			}
		};
	})
	.controller('ConfigCtrl', function($scope, probeFactory) {
		$scope.probes = probeFactory.getProbes();
		$scope.remove = function(id) {
			probeFactory.removeProbe(id);
			$scope.probes = probeFactory.getProbes();
		}
	})
	////////////////////////////////////////////////////////////////////
	// Ping List Controller
	////////////////////////////////////////////////////////////////////
	.controller('PingListCtrl', function($scope, $http, CONST, probeFactory) {
		var probeArr = probeFactory.getProbes();
		$scope.probes = probeArr.map(function(probe) {
			return {
				data: probe,
				quality: CONST.quality.none,
				isPristine: true,		// ping was not performed yet
				inProgress: false,
				isFail: false,
				ms: 0,
				setStatus: function(statusCode, ms) {
					this.isPristine = false;
					this.isFail = statusCode === 0;
					if (!this.isFail) {
						this.ms = ms;
						if (this.ms > 0 && this.ms < 500) {
							this.quality = CONST.quality.good;
						} else if (this.ms < 1500) {
							this.quality = CONST.quality.avg;
						} else {
							this.quality = CONST.quality.bad;
						}
					} else {
						this.ms = 0;
						this.quality = CONST.quality.fail;
					}
				},
				ping: function() {
					var self = this,
						startTime = new Date().getTime();
					this.inProgress = true;
					$http.get(this.data.url)
						.success(function(data, status) {
							console.log("SUCCESS: ", self.data.url, " - ", status);
							self.setStatus(status, new Date().getTime() - startTime);
							self.inProgress = false;

						}).error(function(data, status) {
							console.warn("FAIL: ", self.data.url, " - ", status);
							self.setStatus(status, new Date().getTime() - startTime);
							self.inProgress = false;
						});
				}
			}
		});

		$scope.pingNow = function() {
			$scope.probes.forEach(function(probe){
				probe.ping();
			}, this);
		};
	})
	////////////////////////////////////////////////////////////////////
	// Create/Edit Ping Controller
	////////////////////////////////////////////////////////////////////
	.controller('EditPingCtrl', function($scope, probeFactory, $location, $routeParams) {
		var id = Number($routeParams.pingId);
		$scope.probe = probeFactory.getProbe(id);
		$scope.isNew = !$scope.probe;
		if ($scope.isNew) {
			$scope.probe = {
				url: "http://"
			};
		}

		$scope.saveProbe = function() {
			if ($scope.probe.title && $scope.probe.url) {
				probeFactory.saveProbe($scope.probe);
			}
			$location.path("/config");
		};
	})
	////////////////////////////////////////////////////////////////////
	// Import/Export Json Controller
	////////////////////////////////////////////////////////////////////
	.controller('JsonCtrl', function($scope, probeFactory, $location) {
		var probes = probeFactory.getProbes(),
			originalJson = JSON.stringify(probes, ['title', 'url'], '  ');
		$scope.json = originalJson

		$scope.reset = function() {
			$scope.json = originalJson;
		};
		$scope.saveJson = function() {
			var objects;
			try {
				objects = JSON.parse($scope.json);
			} catch(e) {
				objects = [];
			}
			probeFactory.importProbes(objects);

			$location.path("/");
		};
	})
	////////////////////////////////////////////////////////////////////
	// App Configuration
	////////////////////////////////////////////////////////////////////
	.config(function($routeProvider, $compileProvider) {
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
