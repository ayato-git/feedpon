/// <reference path="interfaces.d.ts" />

class Authentication implements IAuthentication {
    constructor(private endPoint: string = 'http://cloud.feedly.com') {
    }

    authenticate(params: AuthenticationAuthenticateParams, windowOpener: AuthenticationWindowOpener): JQueryPromise<AuthenticationAuthenticateResponse> {
        var authUrl = this.endPoint + '/v3/auth/auth?' + $.param(params);

        return windowOpener(authUrl).then<AuthenticationAuthenticateResponse>(function(url) {
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

    exchange(params: AuthenticationExchangeParams): JQueryPromise<AuthenticationExchangeResponse> {
        return this.request('POST', '/v3/auth/token', params);
    }

    refresh(params: AuthenticationRefreshParams): JQueryPromise<AuthenticationRefreshResponse> {
        return this.request('POST', '/v3/auth/token', params);
    }

    revoke(params: AuthenticationRevokeParams): JQueryPromise<AuthenticationRevokeResponse> {
        return this.request('POST', '/v3/auth/token', params);
    }

    private request<T>(method: string, path: string, data?: any): JQueryPromise<T> {
        return $.ajax({
            data: data,
            dataType: 'json',
            type: method,
            url: this.endPoint + path,
        });
    }
}

export = Authentication;
