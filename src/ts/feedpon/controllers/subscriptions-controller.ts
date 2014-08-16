/// <reference path="interfaces.d.ts" />

import $ = require('jquery');
import Enumerable = require('linqjs');

class SubscritionsController implements ISubscriptionsController{
    private $el: JQuery;

    private subscriptionItemTemplate: any = require('hgn!../templates/subscription-item.mustache');

    constructor(el: JQuery, gateway: IGateway, mediator: IControllerMediator);
    constructor(el: HTMLElement, gateway: IGateway, mediator: IControllerMediator);
    constructor(el: any, private gateway: IGateway, private mediator: IControllerMediator) {
        mediator.registerSubscriptionsController(this);

        this.$el = $(el)
            .on('click', '.subscription', this.subscriptionClicked.bind(this));
    }

    load(): JQueryPromise<any> {
        return $
            .when(this.gateway.allSubscriptions(), this.gateway.unreadCounts())
            .done((data1: any[], data2: any[]) => {
                this.handleResponses(data1[0], data2[0].unreadcounts)
            });
    }

    private subscriptionClicked(event: JQueryEventObject): void {
        var $subscription = $(event.currentTarget);
        var subscriptionId = $subscription.attr('id');

        this.mediator.fetchStream(subscriptionId);
    }

    private handleResponses(subscriptions: Subscription[], unreadCounts: UnreadCount[]): void {
        this.$el.empty();

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
                    .defaultIfEmpty({label: 'Uncategorized', id: null})
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
            .attr('id', item.subscription.id)
            .addClass('subscription')
            .html(subscriptionItem)
            .appendTo($list);
    }
}

export = SubscritionsController;
