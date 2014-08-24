interface ICredentialRepository {
    get(): Credential;

    store(credential: Credential): void;

    delete(): void;
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
