class CredentialRepository implements ICredentialRepository {
    /**
     * @ngInject
     */
    constructor(private storage: IStorageBackend) {
    }

    get(): ng.IPromise<Credential> {
        return this.storage.get('credential');
    }

    put(credential: Credential): ng.IPromise<void> {
        return this.storage.set('credential', credential);
    }

    delete(): ng.IPromise<void> {
        return this.storage.remove('credential');
    }
}

export = CredentialRepository;
