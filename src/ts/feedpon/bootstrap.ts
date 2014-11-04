import IndexedDbProvider = require('./stores/indexedDbProvider');
import angular = require('angular');
import controllersModule = require('./modules/controllersModule');
import directivesModule = require('./modules/directivesModule');

require('ionic-angular');

angular.module('feedpon', [
        controllersModule.name,
        directivesModule.name,
        'ui.router'
    ])

    /**
     * @ngInject
     */
    .config((indexedDbProvider: IndexedDbProvider) => {
        indexedDbProvider
            .use('feedpon')
            .migrate(1, (db) => {
                var subscriptions = db.createObjectStore('subscriptions', { keyPath: 'id' });
                var unreadCounts = db.createObjectStore('unreadCounts', { keyPath: 'id' });
                var wedata = db.createObjectStore('wedata', { keyPath: 'resource_url' });
                wedata.createIndex('databaseResourceUrl', 'database_resource_url');
            });
    })

    /**
     * @ngInject
     */
    .config(($stateProvider: ng.ui.IStateProvider) => {
        $stateProvider
            .state('entrance', {
                url: '/',
                templateUrl: 'templates/entrance.html'
            })
            .state('home', {
                url: '/home/',
                templateUrl: 'templates/home.html'
            })
            .state('content', {
                url: '/content/{streamId:.+}',
                templateUrl: 'templates/content.html'
            });
    })

    /**
     * @ngInject
     */
    .config(($urlRouterProvider: ng.ui.IUrlRouterProvider) => {
        $urlRouterProvider.otherwise('/');
    });

if ('cordova' in window) {
    document.addEventListener('deviceready', bootstrap, false);

    // Open the link by InAppBrowser
    document.addEventListener('click', (e) => {
        var target = <Element> e.target;

        do {
            if (target.nodeName === 'A' &&
                target.getAttribute('target') === '_blank') {
                e.preventDefault();

                var url = target.getAttribute('href');

                window.open(url, '_blank', 'location=no');

                break;
            }
        } while ((target = <Element> target.parentNode) &&
                  target.nodeType !== target.DOCUMENT_NODE);
    }, false);
} else {
    bootstrap();
}

function bootstrap(): void {
    angular.bootstrap(document, ['feedpon']);
}
