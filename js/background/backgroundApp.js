var myApp = angular.module('pingBackground', ['ng']);
myApp.controller("BgCtrl", function($interval, $rootScope, $log, pingProcessor){
    $log.info("Starting background page...");
    $log.info("viewModels: ", pingProcessor.getViewModels());
    $rootScope.$on("allPingsDone", function(e, viewModels) {
        if (!viewModels) return;

        var failed = viewModels.filter(function(vm) { return vm.isFail; });

        if (!failed.length) {
            // All up!
            chrome.notifications.create({
                type: "basic",
                iconUrl: "img/icon128.png",
                title: "Ping complete",
                message: "All " + viewModels.length + " sites are online"
            });
        } else {
            chrome.notifications.create({
                type: "list",
                iconUrl: "img/icon128.png",
                title: failed.length + " of " + viewModels.length + " sites are offline",
                message: "Why?",
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
