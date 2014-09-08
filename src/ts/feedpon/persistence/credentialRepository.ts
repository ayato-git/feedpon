class CredentialRepository implements ICredentialRepository {
    /**
     * @ngInject
     */
    constructor(private storage: Storage) {
    }

    get(): Credential {
        var credential = this.storage['credential'];
        return credential != null ? JSON.parse(credential) : null;
    }

    store(credential: Credential): void {
        this.storage['credential'] = JSON.stringify(credential);
    }

    delete(): void {
        delete this.storage['credential'];
    }
}

export = CredentialRepository;
