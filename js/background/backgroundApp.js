var myApp = angular.module('pingBackground', ['ng']);
myApp.controller("BgCtrl", function($interval, $rootScope, $log, chrome, pingProcessor){
    $log.info("Starting background page...");

    $rootScope.$on("pingsInProgress", function(e, viewModels) {
        $log.info("in progress!");
        var notFinished = viewModels.filter(function(vm) { return vm.inProgress; }),
            failed = viewModels.filter(function(vm) { return vm.isFail; }),
            successCount = viewModels.length - notFinished.length - failed.length;

        if (notFinished.length > 0) {
            // Show Progress!
            chrome.notifications.create({
                type: "progress",
                iconUrl: "img/icon_in_progress_80x80.png",
                title: "Ping in progress",
                message: successCount + " sites are online, " + failed.length + " offline, " + notFinished.length + " pending",     // Smarter messages!
                progress: Math.round((viewModels.length - notFinished.length) / viewModels.length * 100)
            });
        }
    });
    $rootScope.$on("allPingsDone", function(e, viewModels) {
        if (!viewModels) return;

        var failed = viewModels.filter(function(vm) { return vm.isFail; });

        if (!failed.length) {
            // All up!
            chrome.notifications.create({
                type: "basic",
                iconUrl: "img/icon_success_80x80.png",
                title: "Ping complete",
                message: "All " + viewModels.length + " sites are online"
            });
        } else {
            chrome.notifications.create({
                type: "list",
                iconUrl: "img/icon_fail_80x80.png",
                title: failed.length + " of " + viewModels.length + " sites are offline",
                message: "",
                items: failed.map(function(vm) {
                    return {
                        title: vm.data.title,
                        message: vm.data.url
                    };
                })
            });
        }
    });
});
