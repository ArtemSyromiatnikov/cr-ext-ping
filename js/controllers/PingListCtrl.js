////////////////////////////////////////////////////////////////////
// Ping List controller (Home page)
////////////////////////////////////////////////////////////////////
myApp.controller('PingListCtrl', function($scope, $http, CONST, probeRepo) {
    var probeArr = probeRepo.getProbes();
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
});
