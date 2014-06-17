/// <reference path="../../feedly/interfaces.d.ts" />

interface ITokenRepository {
    findTokens(): AuthenticationExchangeResponse;

    storeTokens(tokens: AuthenticationExchangeResponse): void;

    deleteTokens(): void;
}
