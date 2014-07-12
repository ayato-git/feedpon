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

$(document).on('deviceready', function() {
    var app = new Framework7();
    var mainView = app.addView('.view-main', {
        dynamicNavbar: true
    });

    $('.js-authenticate').on('click', authenticate);
    $('.js-reload-subscriptions').on('click', reloadSubscriptions);
});

function reloadSubscriptions() {
    $.when(gateway.allSubscriptions(), gateway.unreadCounts())
        .done((data1: any[], data2: any[]) => {
            var $subscriptions = $('.subscriptions');
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
                .forEach(item => {
                    var contents = subscriptionItemTemplate.render({
                        id: item.subscription.id,
                        title: item.subscription.title,
                        unreadCount: item.unreadCount.count,
                        website: item.subscription.website
                    });

                    $subscriptions.append(contents);
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
