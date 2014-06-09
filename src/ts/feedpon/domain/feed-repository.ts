/// <reference path="interfaces.d.ts" />
/// <reference path="../../jquery/jquery.d.ts" />

import $ = require('jquery');

class FeedRepository implements IFeedRepository {
    find(feedId: string): JQueryPromise<Feed> {
        return $.getJSON('v3/feeds/' + feedId);
    }
}

export = FeedRepository;
