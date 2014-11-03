import Enumerable = require('linqjs');

interface IMigration {
    version: number;

    execute(db: IDBDatabase): void;
}

class IndexedDbProvider {
    private dbName: string;

    private dbVersion: number = 0;

    private migrations: IMigration[] = [];

    use(dbName: string): IndexedDbProvider {
        this.dbName = dbName;
        return this;
    }

    migrate(dbVersion: number, execute: (db: IDBDatabase) => void): IndexedDbProvider {
        this.dbVersion = Math.max(this.dbVersion, dbVersion);
        this.migrations.push({
            version: dbVersion,
            execute: execute
        });
        return this;
    }

    /**
     * @ngInject
     */
    $get($q: ng.IQService, $window: ng.IWindowService): ng.IPromise<IDBDatabase> {
        if (this.dbName == null) throw 'The Database name is not set.'
        if (this.dbVersion == null) throw 'The Database name is not set.'

        var deffered = $q.defer();
        var request = $window.indexedDB.open(this.dbName, this.dbVersion);
        var migrations = this.migrations;

        request.onsuccess = function onSuccess(e) {
            deffered.resolve(request.result);
        };
        request.onblocked = function onBlocked(e) {
            deffered.reject(e);
        };
        request.onerror = function onError(e) {
            deffered.reject(e);
        };
        request.onupgradeneeded = function onUpgradeNeeded(e) {
            Enumerable.from(migrations)
                .where((migration) => migration.version > e.oldVersion)
                .orderBy((migration) => migration.version)
                .forEach((migration) => migration.execute(request.result));
        };

        return deffered.promise;
    }
}

export = IndexedDbProvider;
