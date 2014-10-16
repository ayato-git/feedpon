/**
 * @ngInject
 */
function windowOpenerOnChrome($q: ng.IQService,
                              $ionicModal: any): IWindowOpener {
    var template =
        '<ion-modal-view>' +
          '<webview ng-src="{{url}}" on-loadredirect="onLoadredirect($event)">' +
          '</webview>' +
        '</ion-modal-view>';

    return function(url: string, expectUrl: string): ng.IPromise<string> {
        var deferred = $q.defer();
        var modal = $ionicModal.fromTemplate(template);

        var scope = modal.scope;
        scope.url = url;
        scope.onLoadredirect = function onLoadredirect($event: any) {
            if ($event.newUrl.indexOf(expectUrl) === 0) {
                deferred.resolve($event.newUrl);
                modal.remove();
            }
        };
        scope.$on('$destroy', function onDestroy() {
            deferred.reject();
        });

        modal.show();

        return deferred.promise;
    }
}

export = windowOpenerOnChrome;
