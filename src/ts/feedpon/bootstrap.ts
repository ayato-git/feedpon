/// <reference path="../../DefinitelyTyped/cordova/cordova.d.ts" />
/// <reference path="../../DefinitelyTyped/requirejs/require.d.ts" />
/// <reference path="../framework7.d.ts" />
/// <amd-dependency path="hgn!./templates/subscription-item.mustache" />

import $ = require('jquery');
import CredentialRepository = require('./persistence/credential-repository');
import AuthenticationService = require('./services/authentication-service');
import Authentication = require('./cloud/authentication');
import Client = require('./cloud/client');
import Gateway = require('./cloud/gateway');
import Framework7 = require('framework7');

var client = new Client();
var gateway = new Gateway(client);

var credentialRepository = new CredentialRepository(window.localStorage);
var credential = credentialRepository.findCredential();
if (credential) {
    client.setCredential(credential);
}

$(document).on('deviceready', function() {
    var app: any = new Framework7();
    var mainView = app.addView('.view-main', {
        dynamicNavbar: true
    });

    $('.js-authenticate').on('click', authenticate);
    $('.js-reload-subscriptions').on('click', reloadSubscriptions);
});

function reloadSubscriptions() {
    var subscriptionItemTemplate: any = require('hgn!./templates/subscription-item.mustache');

    gateway.allSubscriptions().done((subscriptions) => {
        var $subscriptions = $('.subscriptions');

        subscriptions.forEach((subscription) => {
            var contents = subscriptionItemTemplate.render({
                id: subscription.id,
                title: subscription.title,
                count: 0,
                website: subscription.website
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
