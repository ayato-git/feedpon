interface ICredentialRepository {
    get(): ng.IPromise<Credential>;

    put(credential: Credential): ng.IPromise<void>;

    delete(): ng.IPromise<void>;
}

interface Credential extends ExchangeTokenResponse {
    /**
     * Unix time when this credential was created.
     */
    created: number;
}

interface ILongUrlRepository {
    find(shortUrl: string): string;

    store(shortUrl: string, longUrl: string): void;
}

interface IStorageBackend {
    get(key: string): ng.IPromise<{[key: string]: any}>;
    get(keys: string[]): ng.IPromise<{[key: string]: any}>;

    set(items: {[key: string]: any}): ng.IPromise<void>;

    remove(key: string): ng.IPromise<void>;
    remove(keys: string[]): ng.IPromise<void>;
}
