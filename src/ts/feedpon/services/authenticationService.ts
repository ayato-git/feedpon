/// <reference path="../cloud/interfaces.d.ts" />
/// <reference path="../persistence/interfaces.d.ts" />

import angular = require('angular');

function isTokenExpired(credential: Credential, now: number): boolean {
    return credential.created + (credential.expires_in * 1000) < now;
}

class AuthenticationService {
    constructor(private $q: ng.IQService,
                private windowOpener: IWindowOpener,
                private feedlyGateway: IFeedlyGateway,
                private credentialRepository: ICredentialRepository) {
    }

    authenticate(now: number): ng.IPromise<Credential> {
        var credential = this.credentialRepository.get();
        var result: ng.IPromise<Credential>;

        if (credential == null) {
            // Not authenticated yet.
            result = this.doAuthenticate(now);
        } else if (isTokenExpired(credential, now)) {
            // Require token refreshing.
            result = this.doRefreshToken(credential, now);
        } else {
            var deferred = this.$q.defer();
            deferred.resolve(credential);
            result = deferred.promise;
        }

        return result.then((newCredential) => {
            this.feedlyGateway.client.credential = newCredential;
            return newCredential;
        });
    }

    isAuthorized(now: number = Date.now()): boolean {
        var credential = this.credentialRepository.get();
        if (credential == null) {
            return false;
        }

        if (isTokenExpired(credential, now)) {
            return false;
        }

        return true;
    }

    private doAuthenticate(now: number): ng.IPromise<Credential> {
        return this.feedlyGateway
            .authenticate({
                client_id: 'feedly',
                redirect_uri: 'http://localhost',
                scope: 'https://cloud.feedly.com/subscriptions',
                response_type: 'code'
            }, this.windowOpener)
            .then<ExchangeTokenResponse>((response) => {
                return this.feedlyGateway.exchange({
                    code: response.code,
                    client_id: 'feedly',
                    client_secret: '0XP4XQ07VVMDWBKUHTJM4WUQ',
                    redirect_uri: 'http://www.feedly.com/feedly.html',
                    grant_type: 'authorization_code'
                });
            })
            .then<Credential>((response) => {
                var credential: Credential = $.extend({}, response);
                credential.created = now;

                this.credentialRepository.store(credential);

                return credential;
            });
    }

    private doRefreshToken(credential: Credential, now: number): ng.IPromise<Credential> {
        return this.feedlyGateway.refresh({
                refresh_token: credential.refresh_token,
                client_id: 'feedly',
                client_secret: '0XP4XQ07VVMDWBKUHTJM4WUQ',
                grant_type: 'refresh_token',
            })
            .then<Credential>((response) => {
                var newCredential: Credential = angular.extend({}, credential, response);
                return newCredential;
            });
    }
}

export = AuthenticationService;
