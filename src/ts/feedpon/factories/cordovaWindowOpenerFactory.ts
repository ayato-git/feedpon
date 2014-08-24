/// <reference path="../interfaces.d.ts" />

function windowOpenerFactory($q: ng.IQService, $window: ng.IWindowService): IWindowOpener {
    return function(url: string, redirectUrl: string): ng.IPromise<string> {
        var authWindow = $window.open(url, '_blank');
        var deferred = $q.defer();

        authWindow.addEventListener('loadstart', (e) => {
            var url = e.url;
            if (url.indexOf(redirectUrl) === 0) {
                authWindow.close();
                deferred.resolve(url);
            }
        });

        return deferred.promise;
    }
}

export = windowOpenerFactory;
