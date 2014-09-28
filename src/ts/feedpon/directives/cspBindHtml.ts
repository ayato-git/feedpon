import angular = require('angular');

/**
 * @ngInject
 */
function provideCspBindHtml($sce: ng.ISCEService,
                            $http: ng.IHttpService,
                            $parse: ng.IParseService,
                            cspPromiseQueue: IPromiseQueue): ng.IDirective {
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

    function replaceSrcAttribute(node: Element) {
        var element = angular.element(node);
        var uri = element.attr('src');
        if (uri == null) return;

        var placeholder = createPlaceholder(element);
        element.removeAttr('src').replaceWith(placeholder);

        cspPromiseQueue.enqueue(() => {
            return loadImage(uri)
                .then((blobUri) => { element.attr('src', blobUri) })
                .finally(() => { placeholder.replaceWith(element) })
        });
    }

    function compileHtml(html: string): JQuery {
        var parser = new DOMParser();
        var parsed = parser.parseFromString(html, 'text/html');
        var element = angular.element(parsed.body);

        element.find('a').attr('target', '_blank');

        if (cspIsEnabled()) {
            angular.forEach(element.find('img'), replaceSrcAttribute);
        }

        return element.children();
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
                        var html = ($sce.getTrustedHtml(parsed(scope)) || '');
                        element.append(compileHtml(html));
                    });
                }
            };
        }
    };
}

export = provideCspBindHtml;
