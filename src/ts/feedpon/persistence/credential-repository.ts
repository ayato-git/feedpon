/// <reference path="interfaces.d.ts" />

class CredentialRepository implements ICredentialRepository {
    constructor(private storage: Storage) {
    }

    findCredential(): AuthenticationExchangeResponse {
        return this.storage['credential'];
    }

    storeCredential(credential: AuthenticationExchangeResponse): void {
        this.storage['credential'] = credential;
    }

    deleteCredential(): void {
        delete this.storage['credential'];
    }
}

export = CredentialRepository;
