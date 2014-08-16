/// <amd-dependency path="hgn!./templates/subscription-item.mustache" />

import $ = require('jquery');
import AuthenticationService = require('./services/authentication-service');
import Client = require('./cloud/client');
import ControllerMediator = require('./interactions/controller-mediator');
import CredentialRepository = require('./persistence/credential-repository');
import Framework7 = require('framework7');
import Gateway = require('./cloud/gateway');
import SubscritionsController = require('./controllers/subscriptions-controller');

var client = new Client();
var gateway = new Gateway(client);

var authenticationService = new AuthenticationService(
    gateway,
    new CredentialRepository(window.localStorage)
);

var controllerMediator = new ControllerMediator();
var subscritionsController = new SubscritionsController(
    $('.panel-left'),
    gateway,
    controllerMediator
);

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
        .on('click', () => subscritionsController.load());

    authenticate().done(() => subscritionsController.load());
}

function authenticate() {
    return authenticationService
        .authenticate(windowOpener)
        .done((response) => {
            client.setCredential(response);
        });
}

function windowOpener(url: string): JQueryPromise<string> {
    var authWindow = window.open(url, '_blank');
    var defer = $.Deferred();

    authWindow.addEventListener('loadstart', (e) => {
        var url = e.url;

        if (/^http:\/\/localhost\//.test(url)) {
            authWindow.close();

            defer.resolveWith(authWindow, [url]);
        }
    });

    return defer.promise();
};
