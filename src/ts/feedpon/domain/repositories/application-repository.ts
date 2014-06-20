/// <reference path="interfaces.d.ts" />

class ApplicationRepository implements ITokenRepository {
    constructor(private storage: Storage) {
    }

    findTokens(): AuthenticationExchangeResponse {
        return this.storage['authentication'];
    }

    storeTokens(tokens: AuthenticationExchangeResponse): void {
        this.storage['authentication'] = tokens;
    }

    deleteTokens(): void {
        delete this.storage['authentication'];
    }
}

export = ApplicationRepository;
