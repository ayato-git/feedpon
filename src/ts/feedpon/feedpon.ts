/// <reference path="../../DefinitelyTyped/cordova/cordova.d.ts" />
/// <reference path="../framework7/framework7.d.ts" />

import Framework7 = require('framework7');
import FeedlyAuthentication = require('feedly/authentication');
import AuthenticationService = require('feedpon/services/authentication-service');

var app: any = new Framework7();

var mainView = app.addView('.view-main', {
    dynamicNavbar: true
});

$(document).one('deviceready', function() {
    var authenticationService = new AuthenticationService(new FeedlyAuthentication());

    authenticationService
        .authenticate(windowOpener)
        .done((response) => {
            alert(JSON.stringify(response));
        });

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
});
