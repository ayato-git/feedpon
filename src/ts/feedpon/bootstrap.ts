/// <amd-dependency path="hgn!./templates/subscription-item.mustache" />

import $ = require('jquery');
import Authentication = require('./cloud/authentication');
import AuthenticationService = require('./services/authentication-service');
import Client = require('./cloud/client');
import CredentialRepository = require('./persistence/credential-repository');
import Enumerable = require('linqjs');
import Framework7 = require('framework7');
import Gateway = require('./cloud/gateway');

var client = new Client();
var gateway = new Gateway(client);

var credentialRepository = new CredentialRepository(window.localStorage);
var credential = credentialRepository.get();
if (credential) {
    client.setCredential(credential);
}

if ('cordova' in window) {
    $(document).on('deviceready', initialize);
} else {
    initialize();
}

function initialize() {
    var app = new Framework7();
    var mainView = app.addView('.view-main', {
        dynamicNavbar: true
    });

    $('.js-authenticate').on('click', authenticate);
    $('.js-reload-subscriptions').on('click', reloadSubscriptions);
}

function reloadSubscriptions() {
    $.when(gateway.allSubscriptions(), gateway.unreadCounts())
        .done((data1: any[], data2: any[]) => {
            var $panel = $('.panel');
            var subscriptionItemTemplate: any = require('hgn!./templates/subscription-item.mustache');
            var subscriptions: Subscription[] = data1[0];
            var unreadCounts: UnreadCount[] = data2[0].unreadcounts;

            Enumerable
                .from(subscriptions)
                .join(
                    unreadCounts,
                    (subscription) => subscription.id,
                    (unreadCount) => unreadCount.id,
                    (subscription, unreadCount) => {
                        return {
                            subscription: subscription,
                            unreadCount: unreadCount
                        };
                    }
                )
                .selectMany(item => {
                    return Enumerable
                        .from(item.subscription.categories)
                        .defaultIfEmpty({label: "Uncategorized", id: null})
                        .select((category) => {
                            return {
                                category: category,
                                subscription: item.subscription,
                                unreadCount: item.unreadCount
                           };
                        });
                })
                .groupBy(item => item.category.label)
                .forEach(items => {
                    $('<div>')
                        .addClass('content-block-title')
                        .text(items.key())
                        .appendTo($panel);

                    var $listBlock = $('<div>')
                        .addClass('list-block')
                        .appendTo($panel);
                    var $list = $('<ul>').appendTo($listBlock);

                    items.forEach(item => {
                        var subscriptionItem = subscriptionItemTemplate.render({
                            id: item.subscription.id,
                            title: item.subscription.title,
                            unreadCount: item.unreadCount.count,
                            website: item.subscription.website
                        });

                        $list.append(subscriptionItem);
                    })
                });
    })
}

function authenticate() {
    var authenticationService = new AuthenticationService(
        new Authentication(client),
        credentialRepository
    );

    authenticationService
        .authenticate(windowOpener)
        .done((response) => {
            client.setCredential(response);
        });
}

function windowOpener(url: string): JQueryPromise<string> {
    var authWindow = window.open(url, '_blank');
    var defer = $.Deferred();

    authWindow.addEventListener('loadstart', function(e) {
        var url = e.url;

        if (/^http:\/\/localhost\//.test(url)) {
            authWindow.close();

            defer.resolveWith(authWindow, [url]);
        }
    });

    return defer.promise();
};
