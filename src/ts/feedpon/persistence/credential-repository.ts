/// <reference path="interfaces.d.ts" />

class CredentialRepository implements ICredentialRepository {
    constructor(private storage: Storage) {
    }

    findCredential(): AuthenticationExchangeResponse {
        var credential = this.storage.getItem('credential');
        return credential != null ? JSON.parse(credential) : null;
    }

    storeCredential(credential: AuthenticationExchangeResponse): void {
        this.storage.setItem('credential', JSON.stringify(credential));
    }

    deleteCredential(): void {
        this.storage.removeItem('credential');
    }
}

export = CredentialRepository;
