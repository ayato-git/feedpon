import Enumerable = require('linqjs');
import angular = require('angular');
import htmlParser = require('../utils/htmlParser');
import relativeUrlResolver = require('../utils/relativeUrlResolver');
import urlParser = require('../utils/urlParser');

var AUTO_PAGERIZE_RESOURCE_URL = 'http://wedata.net/databases/AutoPagerize';
var LDR_FULL_FEED_RESOURCE_URL = 'http://wedata.net/databases/LDRFullFeed';

function resolveRelativeUrls(element: HTMLElement, url: string): void {
    var parsedUrl = urlParser(url);

    angular.forEach(element.querySelectorAll('a'), (found) => {
        var href = found.getAttribute('href');
        if (href != null) {
            found.setAttribute('href', relativeUrlResolver(href, parsedUrl));
        }
    });

    angular.forEach(element.querySelectorAll('img, iframe'), (node) => {
        var src = node.getAttribute('src');
        if (src != null) {
            node.setAttribute('src', relativeUrlResolver(src, parsedUrl));
        }
    });
}

function removeSpecialTags(element: HTMLElement): void {
    angular.forEach(element.querySelectorAll('script, style'), (node) => {
        node.parentNode.removeChild(node);
    });
}

function removeComments(element: HTMLElement): void {
    var children = Array.prototype.slice.call(element.childNodes);
    var node: Node;

    while (node = children.pop()) {
        switch (node.nodeType) {
            case node.COMMENT_NODE:
                node.parentNode.removeChild(node);
                break;

            case node.ELEMENT_NODE:
                for (var i = 0, l = node.childNodes.length; i < l; i++) {
                    children.push(node.childNodes[i]);
                }
                break;
        }
    }
}

function xPathResultToEnumerable(xpathResult: XPathResult): linqjs.IEnumerable<HTMLElement> {
    return Enumerable.Utils.createEnumerable(() => {
        return Enumerable.Utils.createEnumerator<HTMLElement>(
            function() {},
            function() {
                var node = xpathResult.iterateNext();
                if (node == null) return this.yieldBreak();
                return this.yieldReturn(node);
            },
            function() {}
        );
    });
}

class FullContentLoader implements IFullContentLoader {
    private siteinfo: Siteinfo = {
        autoPagerize: [],
        ldrFullFeed: []
    };

    /**
     * @ngInject
     */
    constructor(private $http: ng.IHttpService,
                private $q: ng.IQService,
                private wedataLoader: IWedataLoader) {
    }

    initSiteinfo(): ng.IPromise<Siteinfo> {
        return this.$q.all([
            this.wedataLoader.getItems(AUTO_PAGERIZE_RESOURCE_URL),
            this.wedataLoader.getItems(LDR_FULL_FEED_RESOURCE_URL)
        ]).then((responses) => {
            if (responses[0] != null && responses[1] != null) {
                this.siteinfo = {
                    autoPagerize: responses[0],
                    ldrFullFeed: responses[1]
                };
            }

            return this.siteinfo;
        });
    }

    reloadSiteinfo(): ng.IPromise<Siteinfo> {
        return this.$q.all([
            this.wedataLoader.reloadItems(AUTO_PAGERIZE_RESOURCE_URL),
            this.wedataLoader.reloadItems(LDR_FULL_FEED_RESOURCE_URL)
        ]).then((responses) => {
            if (responses[0] != null && responses[1] != null) {
                this.siteinfo = {
                    autoPagerize: responses[0],
                    ldrFullFeed: responses[1]
                };
            }

            return this.siteinfo;
        });
    }

    load(url: string): ng.IPromise<string> {
        return this.$http.get<any>(url, {
                responseType: 'text'
            })
            .then((response) => {
                var parsed = htmlParser(response.data);
                var content = this.extractContent(url, parsed.body);
                if (content == null) return '';

                resolveRelativeUrls(content, url);
                removeSpecialTags(content);
                removeComments(content);

                return content.outerHTML;
            });
    }

    private extractContent(url: string, target: HTMLElement): HTMLElement {
        return this.findElementsByLDRFullFeed(url, target).firstOrDefault(null, null)
            || this.findElementsByAutoPagerize(url, target).firstOrDefault(null, null);
    }

    private findElementsByLDRFullFeed(url: string, target: HTMLElement): linqjs.IEnumerable<HTMLElement> {
        var items = Enumerable.from(this.siteinfo.ldrFullFeed).select((item) => item.data);

        return Enumerable.empty<LDRFullFeedItem>()
            .concat(
                items.where((item) => item.type === 'SBM'),
                items.where((item) => item.type === 'IND' || item.type === 'INDIVIDUAL'),
                items.where((item) => item.type === 'SUB' || item.type === 'SUBGENERAL'),
                items.where((item) => item.type === 'GEN' || item.type === 'GENERAL')
            )
            .where((item) => {
                try {
                    var urlRegExp = new RegExp(item.url);
                    return urlRegExp.test(url);
                } catch (error) {
                    return false;
                }
            })
            .selectMany((item) => {
                var xpathResult = document.evaluate(
                    item.xpath,
                    target,
                    null,
                    XPathResult.ANY_TYPE,
                    null
                );

                return xPathResultToEnumerable(xpathResult);
            });
    }

    private findElementsByAutoPagerize(url: string, target: HTMLElement): linqjs.IEnumerable<HTMLElement> {
        return Enumerable.from(this.siteinfo.autoPagerize)
            .select((item) => item.data)
            .where((item) => {
                try {
                    var urlRegExp = new RegExp(item.url);
                    return urlRegExp.test(url);
                } catch (error) {
                    return false;
                }
            })
            .selectMany((item) => {
                var xpathResult = document.evaluate(
                    item.pageElement,
                    target,
                    null,
                    XPathResult.ANY_TYPE,
                    null
                );

                return xPathResultToEnumerable(xpathResult);
            });
    }
}

export = FullContentLoader;
