import angular = require('angular');

/**
 * @ngInject
 */
function provideCspSrc($http: ng.IHttpService, promiseQueue: IPromiseQueue): ng.IDirective {
    function loadImage(uri: string): ng.IPromise<string> {
        return $http
            .get(uri, {responseType: 'blob'})
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
            var uri: string = attrs['cspSrc'];
            if (cspIsEnabled()) {
                promiseQueue.enqueue(() => {
                    return loadImage(uri).then((blobUri) => {
                        element.attr('src', blobUri);
                    });
                });
            } else {
                element.attr('src', uri);
            }
        }
    };
}

export = provideCspSrc;
