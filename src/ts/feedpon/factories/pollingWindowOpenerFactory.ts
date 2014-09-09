/**
 * @ngInject
 */
function pollingWindowOpenerFactory($q: ng.IQService,
                                    $window: ng.IWindowService,
                                    $interval: ng.IIntervalService): IWindowOpener {
    return function(url: string, expectUrl: string): ng.IPromise<string> {
        var authWindow = $window.open(url, '_blank');
        var deferred = $q.defer();

        var timer = $interval(() => {
            try {
                if (authWindow.closed) {
                    deferred.reject();
                    $interval.cancel(timer);
                } else if (authWindow.document) {
                    var url = authWindow.document.location.href;
                    if (url.indexOf(expectUrl) === 0) {
                        deferred.resolve(url);
                        authWindow.close();
                        $interval.cancel(timer);
                    }
                }
            } catch (e) {}
        }, 100);

        return deferred.promise;
    }
}

export = pollingWindowOpenerFactory;
