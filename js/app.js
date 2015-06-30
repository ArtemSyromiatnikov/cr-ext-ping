/// <reference path="typings/angularjs/angular.d.ts"/>
angular.module('pingApp', [])
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
			probes = [];
		return {
			createProbe: function(probeData) {
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
				};
			},
			initProbes: function(probeDataArr) {
				probeData = probeDataArr;
				probes = probeData.map(this.createProbe, this);
			},
			getProbes: function() {
				return probes;
			}
		};
	})
	.controller('pingListCtrl', function($scope, $http, probeFactory) {
		probeFactory.initProbes(PROBES);
		$scope.probes = probeFactory.getProbes();

		$scope.pingNow = function() {
			$scope.probes.forEach(function(probe){
				probe.ping();
			}, this);
		};

	});
