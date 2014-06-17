/// <reference path="../../DefinitelyTyped/cordova/cordova.d.ts" />
/// <reference path="../../DefinitelyTyped/requirejs/require.d.ts" />
/// <reference path="../framework7/framework7.d.ts" />
/// <amd-dependency path="hgn!templates/subscription-item.mustache" />

import $ = require('jquery');
import ApplicationRepository = require('feedpon/repositories/application-repository');
import AuthenticationService = require('feedpon/services/authentication-service');
import FeedlyAuthentication = require('feedly/authentication');
import FeedlyClient = require('feedly/client');
import Framework7 = require('framework7');

var app: any = new Framework7();

var mainView = app.addView('.view-main', {
    dynamicNavbar: true
});

$(document).on('deviceready', function() {
    var authenticationService = new AuthenticationService(
        new FeedlyAuthentication(),
        new ApplicationRepository(window.localStorage)
    );

    authenticationService
        .authenticate(windowOpener)
        .done((response) => {
            var client = new FeedlyClient(response.access_token);
            var subscriptionItemTemplate: any = require('hgn!templates/subscription-item.mustache');

            client.allSubscriptions().done((subscriptions) => {
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
