import angular = require('angular');

/**
 * @ngInject
 */
function provideCspSrc($http: ng.IHttpService, promiseQueue: IPromiseQueue): ng.IDirective {
    function loadImage(url: string): ng.IPromise<string> {
        return $http
            .get(url, {responseType: 'blob'})
            .then((response) => {
                return URL.createObjectURL(response.data);
            });
    }

    function cspIsEnabled(): boolean {
        return (<any> angular).$$csp();
    }

    return {
        restrict: 'A',
        link: function postLink(scope, element, attrs) {
            var url: string = attrs['cspSrc'];
            if (cspIsEnabled()) {
                promiseQueue.enqueue(() => {
                    return loadImage(url).then((blobUrl) => {
                        element.attr('src', blobUrl);
                    });
                });
            } else {
                element.attr('src', url);
            }
        }
    };
}

export = provideCspSrc;
