/// <reference path="interfaces.d.ts" />

class Authentication {
    constructor(private endPoint: string = 'http://cloud.feedly.com') {
    }

    authenticate(windowOpener: AuthenticationWindowOpener, params: AuthenticationParams): JQueryPromise<string> {
        var authUrl = this.endPoint + '/v3/auth/auth?' + $.param(params);

        return windowOpener(authUrl).then<string>(function(url) {
            var defer = $.Deferred();
            var matchesForCode = url.match(/[?&]code=([^&]+)/);

            if (matchesForCode) {
                defer.resolveWith(this, matchesForCode[1]);
            } else {
                var matchesForError = url.match(/[&?]error=([^&]+)/);
                if (matchesForError) {
                    defer.rejectWith(this, matchesForError[1]);
                }
            }

            return defer.promise();
        })
    }
}

export = Authentication;
