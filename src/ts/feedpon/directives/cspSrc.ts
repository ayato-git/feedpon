import angular = require('angular');
import PromiseQueueService = require('../services/PromiseQueueService');

/**
 * @ngInject
 */
function provideCspSrc($http: ng.IHttpService): ng.IDirective {
    var queue = new PromiseQueueService(4);

    function loadImage(uri: string): ng.IPromise<string> {
        return $http
            .get(uri, {responseType: 'blob'})
            .then((response) => {
                return URL.createObjectURL(response.data);
            });
    }

    return {
        restrict: 'A',
        link: function postLink(scope, element, attrs) {
            var uri: string = attrs['cspSrc'];
            if (<boolean> (<any> angular).$$csp()) {
                queue.enqueue(() => {
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
