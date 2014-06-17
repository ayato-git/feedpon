/// <reference path="../../feedly/interfaces.d.ts" />
/// <reference path="../repositories/interfaces.d.ts" />

class AuthenticationService {
    constructor(private authentication: IAuthentication, private tokenRepository: ITokenRepository) {
    }

    authenticate(windowOpener: AuthenticationWindowOpener): JQueryPromise<AuthenticationExchangeResponse> {
        return this.authentication
            .authenticate({
                client_id: 'feedly',
                redirect_uri: 'http://localhost',
                scope: 'https://cloud.feedly.com/subscriptions',
                response_type: 'code'
            }, windowOpener)
            .then<AuthenticationExchangeResponse>((response) => {
                return this.authentication.exchange({
                    code: response.code,
                    client_id: 'feedly',
                    client_secret: '0XP4XQ07VVMDWBKUHTJM4WUQ',
                    redirect_uri: 'http://www.feedly.com/feedly.html',
                    grant_type: 'authorization_code'
                });
            })
            .done((response) => {
                this.tokenRepository.storeTokens(response);
            });
    }
}

export = AuthenticationService;
