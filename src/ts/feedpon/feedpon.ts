/// <reference path="../../DefinitelyTyped/cordova/cordova.d.ts" />
/// <reference path="../framework7/framework7.d.ts" />

import Framework7 = require('framework7');
import Authentication = require('feedly/authentication');

var app: any = new Framework7();

var mainView = app.addView('.view-main', {
    dynamicNavbar: true
});

$(document).one('deviceready', function() {
    new Authentication()
        .authenticate(windowOpener, {
            client_id: 'feedly',
            redirect_uri: 'http://localhost',
            scope: 'https://cloud.feedly.com/subscriptions',
            response_type: 'code'
        })
        .always(function() {
            this.close();
        })
        .done(function(code) {
            alert(code);
        });

    function windowOpener(url: string): JQueryPromise<string> {
        var authWindow = window.open(url, '_blank');
        var defer = $.Deferred();

        authWindow.onloadstart = function(e) {
            defer.resolveWith(authWindow, e.url)
        };

        return defer.promise();
    };
});
