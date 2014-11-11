import Enumerable = require('linqjs');
import angular = require('angular');
import htmlParser = require('../utils/htmlParser');
import htmlSanitizer = require('../utils/htmlSanitizer');
import relativeUrlResolver = require('../utils/relativeUrlResolver');
import urlParser = require('../utils/urlParser');

var AUTO_PAGERIZE_RESOURCE_URL = 'http://wedata.net/databases/AutoPagerize';
var LDR_FULL_FEED_RESOURCE_URL = 'http://wedata.net/databases/LDRFullFeed';

function resolveRelativeUrls(target: HTMLElement, url: string): void {
    var parsedUrl = urlParser(url);

    angular.forEach(target.querySelectorAll('a'), (found) => {
        var href = found.getAttribute('href');
        if (href != null) {
            found.setAttribute('href', relativeUrlResolver(href, parsedUrl));
        }
    });

    angular.forEach(target.querySelectorAll('img, iframe'), (node) => {
        var src = node.getAttribute('src');
        if (src != null) {
            node.setAttribute('src', relativeUrlResolver(src, parsedUrl));
        }
    });
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
                private $sce: ng.ISCEService,
                private wedataLoader: IWedataLoader) {
    }

    initSiteinfo(): ng.IPromise<Siteinfo> {
        return this.$q.all([
            this.wedataLoader.getItems(AUTO_PAGERIZE_RESOURCE_URL),
            this.wedataLoader.getItems(LDR_FULL_FEED_RESOURCE_URL)
        ]).then((responses) => {
            return this.loadCompleted(responses[0], responses[1]);
        });
    }

    reloadSiteinfo(): ng.IPromise<Siteinfo> {
        return this.$q.all([
            this.wedataLoader.reloadItems(AUTO_PAGERIZE_RESOURCE_URL),
            this.wedataLoader.reloadItems(LDR_FULL_FEED_RESOURCE_URL)
        ]).then((responses) => {
            return this.loadCompleted(responses[0], responses[1]);
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

                return this.$sce.trustAsHtml(htmlSanitizer(content));
            });
    }

    private extractContent(url: string, target: HTMLElement): HTMLElement {
        return this.findElementsByLDRFullFeed(url, target).firstOrDefault(null, null)
            || this.findElementsByAutoPagerize(url, target).firstOrDefault(null, null);
    }

    private findElementsByLDRFullFeed(url: string, target: HTMLElement): linqjs.IEnumerable<HTMLElement> {
        return Enumerable.from(this.siteinfo.ldrFullFeed)
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

    private loadCompleted(autoPagerize: WedataItem<AutoPagerizeItem>[], ldrFullFeed: WedataItem<LDRFullFeedItem>[]): Siteinfo {
        this.siteinfo.autoPagerize = Enumerable.from(autoPagerize)
            .select((item) => item.data)
            .toArray();

        this.siteinfo.ldrFullFeed = Enumerable.from(ldrFullFeed)
            .select((item) => item.data)
            .groupBy((item) => {
                switch (item.type) {
                case 'SBM':
                    return 0;
                case 'IND':
                case 'INDIVIDUAL':
                    return 1;
                case 'SUB':
                case 'SUBGENERAL':
                    return 2;
                case 'GEN':
                case 'GENERAL':
                    return 3;
                }
            })
            .orderBy((item) => item.key())
            .selectMany((item) => item)
            .toArray();

        return this.siteinfo;
    }
}

export = FullContentLoader;
