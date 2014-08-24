/// <reference path="interfaces.d.ts" />

class LongUrlRepository implements ILongUrlRepository {
    constructor(private storage: Storage) {
    }

    find(shortUrl: string): string {
        return this.storage.getItem('shortUrl.' + shortUrl);
    }

    store(shortUrl: string, longUrl: string): void {
        this.storage.setItem('shortUrl.' + shortUrl, longUrl);
    }
}

export = LongUrlRepository;
