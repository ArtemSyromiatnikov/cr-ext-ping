/////////////////////////////////////////////////////////////////////
// Migration history
/////////////////////////////////////////////////////////////////////
myApp.factory('migrations', function($window, $log, chrome){
    var ls = $window.localStorage,
        migrations = [
            {
                // version 0.5
                id: "ChromeStorage",
                run: function() {
                    // Move data from localStorage to chrome.storage.local
                }
            },
        ],
        getLatestInstalledMigrationId = function() {
            return ls["installedMigration"];
        },
        runMigration = function(ix) {
            var migration = migration[ix];
            if (migration) {
                $log.log("Installing migration ", migration.id, " (", ix+1, "/", migrations.length, ")...")

                migration.run();

                ls["installedMigration"] = migration.id;
                $log.info("Migration ", migration.id, " has been installed.")
            }
        };


    return {
        upgrade: function(){
            $log.log("Starting version upgrade...");
            var installedVersion = getLatestInstalledMigrationId(),
                installedMigrationIx = -1,
                i;

            for (i=0; i<migrations.length; i++) {
                if (migrations[i].id === installedVersion) {
                    installedMigrationIx = i;
                }
            }
            if (installedVersion) {
                $log.log("Latest installed migration: '", installedVersion, "', #", installedMigrationIx+1, " of ", migration.length);
            } else {
                $log.log("No installed migrations are detected.");
            }

            for (i=installedMigrationIx+1; i<migrations.length; i++) {
                runMigration(i);
            }
            $log.info("Version upgrade is completed.");
        }
    };
});
