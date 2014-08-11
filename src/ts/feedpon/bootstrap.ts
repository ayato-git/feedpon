/// <amd-dependency path="hgn!./templates/subscription-item.mustache" />

import $ = require('jquery');
import Authentication = require('./cloud/authentication');
import AuthenticationService = require('./services/authentication-service');
import Client = require('./cloud/client');
import CredentialRepository = require('./persistence/credential-repository');
import Framework7 = require('framework7');
import Gateway = require('./cloud/gateway');
import SubscritionPanelController = require('./controllers/subscription-panel-controller');

var client = new Client();
var gateway = new Gateway(client);

var subscritionPanelController = new SubscritionPanelController(
    $('.panel-left'),
    gateway
);

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

    $('.js-authenticate')
        .on('click', authenticate);

    $('.js-reload-subscriptions')
        .on('click', () => subscritionPanelController.reload());
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
