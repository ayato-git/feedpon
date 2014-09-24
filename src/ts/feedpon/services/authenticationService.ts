import angular = require('angular');

class AuthenticationService implements IAuthenticationService {
    /**
     * @ngInject
     */
    constructor(private $q: ng.IQService,
                private credentialRepository: ICredentialRepository,
                private feedlyAuthenticator: IFeedlyAuthenticator,
                private windowOpener: IWindowOpener) {
    }

    authenticate(now: number): ng.IPromise<Credential> {
        return this.credentialRepository.get()
            .then((credential) => {
                if (credential == null) {
                    // Not authenticated yet.
                    return this.doAuthenticate(now);
                } else if (isTokenExpired(credential, now)) {
                    // Require token refreshing.
                    return this.doRefreshToken(credential, now);
                } else {
                    var deferred = this.$q.defer();
                    deferred.resolve(credential);
                    return deferred.promise;
                }
            });
    }

    expire(): ng.IPromise<void> {
        return this.credentialRepository.delete();
    }

    isAuthorized(now: number): ng.IPromise<boolean> {
        return this.credentialRepository.get()
            .then((credential) => {
                if (credential == null) {
                    return false;
                }

                if (isTokenExpired(credential, now)) {
                    return false;
                }

                return true;
            });
    }

    private doAuthenticate(now: number): ng.IPromise<Credential> {
        return this.feedlyAuthenticator
            .authenticate({
                client_id: 'feedly',
                redirect_uri: 'http://localhost',
                scope: 'https://cloud.feedly.com/subscriptions',
                response_type: 'code'
            }, this.windowOpener)
            .then((response) => {
                return this.feedlyAuthenticator.exchangeToken({
                    code: response.code,
                    client_id: 'feedly',
                    client_secret: '0XP4XQ07VVMDWBKUHTJM4WUQ',
                    redirect_uri: 'http://www.feedly.com/feedly.html',
                    grant_type: 'authorization_code'
                });
            })
            .then((response) => {
                var credential: Credential = <Credential> angular.copy(response);
                credential.created = now;

                return this.credentialRepository.put(credential).then(() => credential);
            });
    }

    private doRefreshToken(credential: Credential, now: number): ng.IPromise<Credential> {
        return this.feedlyAuthenticator.refreshToken({
                refresh_token: credential.refresh_token,
                client_id: 'feedly',
                client_secret: '0XP4XQ07VVMDWBKUHTJM4WUQ',
                grant_type: 'refresh_token',
            })
            .then((response) => {
                var newCredential: Credential = angular.extend({}, credential, response);
                newCredential.created = now;

                return this.credentialRepository.put(newCredential)
                    .then<Credential>(() => newCredential);
            });
    }
}

function isTokenExpired(credential: Credential, now: number): boolean {
    return credential.created + (credential.expires_in * 1000) < now;
}

export = AuthenticationService;
