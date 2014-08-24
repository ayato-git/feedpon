function windowOpenerFactory($q: ng.IQService, $window: ng.IWindowService): IWindowOpener {
    return function(url: string): ng.IPromise<string> {
        var authWindow = $window.open(url, '_blank');
        var deferred = $q.defer();

        authWindow.addEventListener('loadstart', (e) => {
            var url = e.url;

            if (/^http:\/\/localhost\//.test(url)) {
                authWindow.close();

                deferred.resolve(url);
            }
        });

        return deferred.promise;
    }
}

export = windowOpenerFactory;
