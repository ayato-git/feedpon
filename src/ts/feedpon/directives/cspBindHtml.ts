import angular = require('angular');
import htmlParser = require('../utils/htmlParser');

/**
 * @ngInject
 */
function provideCspBindHtml($sce: ng.ISCEService,
                            $http: ng.IHttpService,
                            $parse: ng.IParseService,
                            promiseQueue: IPromiseQueue): ng.IDirective {
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

    function toPixel(value: any, def: string): string {
        return value ? value + 'px' : def;
    }

    function createPlaceholder(element: JQuery): JQuery {
        return angular.element(
            '<div class="csp-loading">' +
                '<div class="csp-loading-inner">' +
                    '<i class="csp-loading-icon icon ion-loading-c"></i>' +
                '</div>' +
            '</div>')
            .css('width', toPixel(element.attr('width'), 'auto'))
            .css('height', toPixel(element.attr('height'), 'auto'));
    }

    function loadSrcAttribute(target: Element) {
        var element = angular.element(target);
        var url = element.attr('src');
        if (url == null) return;

        var placeholder = createPlaceholder(element);
        element.removeAttr('src').replaceWith(placeholder);

        promiseQueue.enqueue(() => {
            return loadImage(url)
                .then((blobUrl) => { element.attr('src', blobUrl) })
                .finally(() => { placeholder.replaceWith(element) })
        });
    }

    function compileHtml(html: string): JQuery {
        var parsed = htmlParser(html);
        var body = angular.element(parsed.body);

        // Open external links in a new tab.
        body.find('a').attr('target', '_blank');

        if (cspIsEnabled()) {
            angular.forEach(body.find('img'), loadSrcAttribute);
        }

        return body.children();
    }

    return {
        restrict: 'A',
        compile: function compile(element) {
            element.addClass('ng-binding');

            return {
                post: function postLink(scope, element, attr) {
                    element.data('$binding', attr['cspBindHtml']);

                    var parsed = $parse(attr['cspBindHtml']);

                    function getStringValue() {
                        return (parsed(scope) || '').toString();
                    }

                    scope.$watch(getStringValue, (value) => {
                        var originalHtml = parsed(scope);
                        var trustedHtml = $sce.getTrustedHtml(originalHtml) || '';
                        element.empty().append(compileHtml(trustedHtml));
                    });
                }
            };
        }
    };
}

export = provideCspBindHtml;
