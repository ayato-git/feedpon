/// <reference path="../interfaces.d.ts" />

/**
 * @ngInject
 */
function windowOpenerFactory($q: ng.IQService, $window: ng.IWindowService): IWindowOpener {
    return function(url: string, redirectUrl: string): ng.IPromise<string> {
        var authWindow = $window.open(url, '_blank', 'location=no,toolbar=no');
        var deferred = $q.defer();
        var resolved = false;

        authWindow.addEventListener('loadstart', (e) => {
            var url = e.url;
            if (resolved = url.indexOf(redirectUrl) === 0) {
                deferred.resolve(url);
                authWindow.close();
            }
        });
        authWindow.addEventListener('exit', (e) => {
            if (!resolved) deferred.reject();
        });

        return deferred.promise;
    }
}

export = windowOpenerFactory;
