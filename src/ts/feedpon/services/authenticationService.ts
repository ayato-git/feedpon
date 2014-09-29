import angular = require('angular');

class AuthenticationService implements IAuthenticationService {
    /**
     * @ngInject
     */
    constructor(private $q: ng.IQService,
                private credentialRepository: ICredentialRepository,
                private feedlyAuthenticator: IFeedlyAuthenticator,
                private timeProvider: ITimeProvider,
                private windowOpener: IWindowOpener) {
    }

    authenticate(): ng.IPromise<Credential> {
        return this.credentialRepository.get()
            .then((credential) => {
                if (credential == null) {
                    // Not authenticated yet.
                    return this.doAuthenticate();
                } else if (this.isTokenExpired(credential)) {
                    // Require token refreshing.
                    return this.doRefreshToken(credential);
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

    isAuthorized(): ng.IPromise<boolean> {
        return this.credentialRepository.get()
            .then((credential) => {
                if (credential == null) {
                    return false;
                }

                if (this.isTokenExpired(credential)) {
                    return false;
                }

                return true;
            });
    }

    private doAuthenticate(): ng.IPromise<Credential> {
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
                credential.created = this.timeProvider();

                return this.credentialRepository.put(credential).then(() => credential);
            });
    }

    private doRefreshToken(credential: Credential): ng.IPromise<Credential> {
        return this.feedlyAuthenticator.refreshToken({
                refresh_token: credential.refresh_token,
                client_id: 'feedly',
                client_secret: '0XP4XQ07VVMDWBKUHTJM4WUQ',
                grant_type: 'refresh_token',
            })
            .then((response) => {
                var newCredential: Credential = angular.extend({}, credential, response);
                newCredential.created = this.timeProvider();

                return this.credentialRepository.put(newCredential)
                    .then<Credential>(() => newCredential);
            });
    }

    private isTokenExpired(credential: Credential): boolean {
        return credential.created + (credential.expires_in * 1000) <
            this.timeProvider();
    }
}

export = AuthenticationService;
