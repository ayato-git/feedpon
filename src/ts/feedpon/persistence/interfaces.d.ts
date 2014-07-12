/// <reference path="../cloud/interfaces.d.ts" />

interface ICredentialRepository {
    get(): Credential;

    exists(): boolean;

    store(credential: Credential): void;

    delete(): void;
}

interface Credential extends ExchangeTokenResponse {
    authorized: number;
}
