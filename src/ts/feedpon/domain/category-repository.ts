/// <reference path="interfaces.d.ts" />
/// <reference path="../infrastructure/interfaces.d.ts" />

class CategoryRepository implements ICategoryRepository {
    constructor(private client: IFeedlyClient) {
    }

    findAll(): JQueryPromise<Category[]> {
        return this.client.request('GET', '/v3/categories');
    }
}

export = CategoryRepository;
