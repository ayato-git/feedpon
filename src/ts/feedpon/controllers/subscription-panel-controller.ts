/// <reference path="../interfaces.d.ts" />

import $ = require('jquery');
import Enumerable = require('linqjs');

class SubscritionPanelController {
    private $el: JQuery;

    private subscriptionItemTemplate: any = require('hgn!../templates/subscription-item.mustache');

    constructor(el: JQuery, gateway: IGateway);
    constructor(el: HTMLElement, gateway: IGateway);
    constructor(el: any, private gateway: IGateway) {
        this.$el = $(el);
    }

    reload(): JQueryPromise<any> {
        return $
            .when(this.gateway.allSubscriptions(), this.gateway.unreadCounts())
            .done((data1: any[], data2: any[]) => {
                this.handleResponses(data1[0], data2[0].unreadcounts)
            });
    }

    private handleResponses(subscriptions: Subscription[], unreadCounts: UnreadCount[]): void {
        Enumerable
            .from(subscriptions)
            .join(
                unreadCounts,
                (subscription) => subscription.id,
                (unreadCount) => unreadCount.id,
                (subscription, unreadCount) => {
                    return {
                        subscription: subscription,
                        unreadCount: unreadCount
                    };
                })
            .selectMany(item => {
                return Enumerable
                    .from(item.subscription.categories)
                    .defaultIfEmpty({label: "Uncategorized", id: null})
                    .select((category) => {
                        return {
                            category: category,
                            subscription: item.subscription,
                            unreadCount: item.unreadCount
                        };
                    });
            })
            .forEach(this.renderItem.bind(this));
    }

    private renderItem(item: {category: Category; subscription: Subscription; unreadCount: UnreadCount}): void {
        var categoryElement = document.getElementById(item.category.id);
        var $list: JQuery;

        if (categoryElement) {
            $list = $(categoryElement).find('.list-block ul');
        } else {
            var $category = $('<div>')
                .attr('id', item.category.id)
                .appendTo(this.$el);

            $('<div>')
                .addClass('content-block-title')
                .text(item.category.label)
                .appendTo($category);

            var $listBlock = $('<div>')
                .addClass('list-block')
                .appendTo($category);

            $list = $('<ul>')
                .addClass('subscription-list')
                .appendTo($listBlock);
        }

        var subscriptionItem = this.subscriptionItemTemplate.render({
            title: item.subscription.title,
            unreadCount: item.unreadCount.count,
            website: item.subscription.website
        });

        $('<li>')
            .data('id', item.subscription.id)
            .addClass('subscription')
            .append(subscriptionItem)
            .appendTo($list);
    }
}

export = SubscritionPanelController;
