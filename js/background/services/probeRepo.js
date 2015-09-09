myApp.factory("probeRepo", function($http, defaultData) {
    var ls = localStorage || {},
        lastUpdate = new Date(),
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
                lastUpdate = new Date();
                //console.log("Saving probe data: ", ls.probeData);
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

    initialize(defaultData);

    return {
        getProbes: function() {
            return angular.copy(probeData);
        },
        isDirty: function(date) {
            return !date || date < lastUpdate;
        },
        getProbe: function(id) {
            var probe = probeData.filter(function(probe) { return probe.id === id; })[0];
            return angular.copy(probe);
        },
        createProbe: function(newProbe) {
            newProbe.id = generateNewId();
            probeData.push(newProbe);
            //console.log("New probe: ", newProbe);

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
});
