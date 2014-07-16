/// <reference path="../cloud/interfaces.d.ts" />
/// <reference path="../persistence/interfaces.d.ts" />

class AuthenticationService {
    constructor(private authentication: IAuthentication, private credentialRepository: ICredentialRepository) {
    }

    authenticate(windowOpener: WindowOpener, now: number = Date.now()): JQueryPromise<ExchangeTokenResponse> {
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
            .done((response) => {
                var credential: Credential = <Credential> response;
                credential.created = now;

                this.credentialRepository.store(credential);
            });
    }

    isAuthorized(): boolean {
        return this.credentialRepository.exists();
    }

    isTokenExpired(now: number = Date.now()): boolean {
        var credential = this.credentialRepository.get();
        var lifetime = credential.created + (credential.expires_in * 1000);

        return lifetime < now;
    }
}

export = AuthenticationService;
