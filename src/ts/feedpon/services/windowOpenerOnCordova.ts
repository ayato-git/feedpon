/**
 * @ngInject
 */
function WindowOpenerOnCordova($q: ng.IQService, $window: ng.IWindowService): IWindowOpener {
    return function(url: string, expectUrl: string): ng.IPromise<string> {
        var authWindow = $window.open(url, '_blank', 'location=no,toolbar=no');
        var deferred = $q.defer();
        var resolved = false;

        authWindow.addEventListener('loadstart', (e) => {
            var url = (<any> e).url;
            if (resolved = url.indexOf(expectUrl) === 0) {
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

export = WindowOpenerOnCordova;
