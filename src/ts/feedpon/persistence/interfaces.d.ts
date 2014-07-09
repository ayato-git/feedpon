/// <reference path="../cloud/interfaces.d.ts" />

interface ICredentialRepository {
    findCredential(): AuthenticationExchangeResponse;

    storeCredential(credential: AuthenticationExchangeResponse): void;

    deleteCredential(): void;
}
