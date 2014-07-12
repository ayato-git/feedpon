/// <reference path="interfaces.d.ts" />

class CredentialRepository implements ICredentialRepository {
    constructor(private storage: Storage) {
    }

    get(): Credential {
        var credential = this.storage.getItem('credential');
        return credential != null ? JSON.parse(credential) : null;
    }

    exists(): boolean {
        return !!this.storage.getItem('credential');
    }

    store(credential: Credential): void {
        this.storage.setItem('credential', JSON.stringify(credential));
    }

    delete(): void {
        this.storage.removeItem('credential');
    }
}

export = CredentialRepository;
