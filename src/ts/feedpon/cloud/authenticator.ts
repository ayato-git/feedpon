/// <reference path="interfaces.d.ts" />

import $ = require('jquery');

class Authenticator implements IAuthentication {
    constructor(private client: IClient) {
    }

    authenticate(input: AuthenticateInput, windowOpener: WindowOpener): JQueryPromise<AuthenticateResponse> {
        var authUrl = this.client.endPoint + '/v3/auth/auth?' + $.param(input);

        return windowOpener(authUrl).then<AuthenticateResponse>(function(url) {
            var defer = $.Deferred();
            var matchesForCode = url.match(/[?&]code=([^&]*)/);
            var matchesForState = url.match(/[?&]state=([^&]*)/);

            if (matchesForCode) {
                defer.resolveWith(this, [{
                    code: matchesForCode[1],
                    state: matchesForState ? matchesForState[1] : null
                }]);
            } else {
                var matchesForError = url.match(/[&?]error=([^&]+)/);
                if (matchesForError) {
                    defer.rejectWith(this, [{
                        code: matchesForCode[1],
                        state: matchesForState ? matchesForState[1] : null
                    }]);
                }
            }

            return defer.promise();
        })
    }

    exchange(input: ExchangeTokenInput): JQueryPromise<ExchangeTokenResponse> {
        return this.client.request('POST', '/v3/auth/token', input);
    }

    refresh(input: RefreshTokenInput): JQueryPromise<RefreshTokenResponse> {
        return this.client.request('POST', '/v3/auth/token', input);
    }

    revoke(input: RevokeTokenInput): JQueryPromise<RevokeTokenResponse> {
        return this.client.request('POST', '/v3/auth/token', input);
    }
}

export = Authenticator;
