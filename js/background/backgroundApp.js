var myApp = angular.module('pingBackground', ['ng']);
myApp.controller("BgCtrl", function($interval, $rootScope, $log){
    $log.info("Starting background page...");
    $rootScope.$on("allPingsDone", function(e, viewModels) {
        if (!viewModels) return;

        var message,
            failed = viewModels.reduce(function(cnt, vm) {
                if (vm.isFail) cnt++;
                return cnt;
            }, 0);

        if (failed > 0) {
            message = failed + " of " + viewModels.length + " sites are offline!";
        } else {
            message = "All " + viewModels.length + " sites are online";
        }

        chrome.notifications.create({
            type: "basic",
            iconUrl: "img/icon128.png",
            title: "Ping complete",
            message: message
        });
    });
});
