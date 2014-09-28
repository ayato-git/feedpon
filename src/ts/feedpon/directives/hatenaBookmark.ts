import angular = require('angular');

interface IHatenaBookmarkScope extends ng.IScope {
    count: string;
    src: string;
}

/**
 * @ngInject
 */
function provideHatenaBookmark($http: ng.IHttpService, promiseQueue: IPromiseQueue): ng.IDirective {
    function getBookmarkCount(url: string): ng.IPromise<number> {
        return $http({
                method: 'GET',
                url: 'http://api.b.st-hatena.com/entry.count',
                params: {url: url}
            })
            .then((response: any) => Math.floor(response.data));
    }

    return {
        restrict: 'E',
        replace: true,
        scope: {
            src: '='
        },
        template: '<span>{{count}}</span>',
        link: function postLink(scope: IHatenaBookmarkScope) {
            scope.count = '?';

            promiseQueue.enqueue(() => {
                return getBookmarkCount(scope.src).then((count) => {
                    scope.count = count + '';
                });
            });
        }
    };
}

export = provideHatenaBookmark;
