/// <reference path="../cloud/interfaces.d.ts" />
/// <reference path="../persistence/interfaces.d.ts" />

import $ = require('jquery');

function isTokenExpired(credential: Credential, now: number): boolean {
    return credential.created + (credential.expires_in * 1000) < now;
}

class AuthenticationService {
    constructor(private authentication: IAuthentication, private credentialRepository: ICredentialRepository) {
    }

    authenticate(windowOpener: WindowOpener, now: number = Date.now()): JQueryPromise<Credential> {
        var credential = this.credentialRepository.get();
        if (credential == null) {
            // Not authenticated yet.
            return this.doAuthenticate(windowOpener, now);
        }

        if (isTokenExpired(credential, now)) {
            // Require token refreshing.
            return this.doRefreshToken(credential, now);
        }

        return $.Deferred().resolve(credential).promise();
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

    private doAuthenticate(windowOpener: WindowOpener, now: number): JQueryPromise<Credential> {
        return this.authentication
            .authenticate({
                client_id: 'feedly',
                redirect_uri: 'http://localhost',
                scope: 'https://cloud.feedly.com/subscriptions',
                response_type: 'code'
            }, windowOpener)
            .then<ExchangeTokenResponse>((response) => {
                return this.authentication.exchange({
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

    private doRefreshToken(credential: Credential, now: number): JQueryPromise<Credential> {
        return this.authentication.refresh({
                refresh_token: credential.refresh_token,
                client_id: 'feedly',
                client_secret: '0XP4XQ07VVMDWBKUHTJM4WUQ',
                grant_type: 'refresh_token',
            })
            .then<Credential>((response) => {
                var newCredential: Credential = $.extend({}, credential, response);

                return newCredential;
            });
    }
}

export = AuthenticationService;
