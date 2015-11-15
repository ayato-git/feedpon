import Enumerable from 'linq'
import React from 'react'
import SubscriptionCategory from './subscriptionCategory'

class Sidebar extends React.Component {
    static propTypes = {
        subscriptions: React.PropTypes.array.isRequired,
        unreadcounts: React.PropTypes.array.isRequired,
        categories: React.PropTypes.array.isRequired,
        selectedStreamId: React.PropTypes.string
    }

    constructor(props) {
        super(props)

        this.state = { filter: '' }
    }

    handleFilterChanged(event) {
        this.setState({ filter: event.target.value })
    }

    render() {
        const { filter } = this.state

        const uncategorized = { label: 'Uncategorized', id: 'global.uncategorized' }
        const subscriptions = Enumerable.from(this.props.subscriptions)
            .where(subscription => (subscription.title && subscription.title.indexOf(filter) !== -1) || (subscription.website && subscription.website.indexOf(filter) !== -1))
            .join(
                Enumerable.from(this.props.unreadcounts),
                subscription => subscription.id,
                unreadcount => unreadcount.id,
                (subscription, unreadcount) => ({ subscription, unreadcount })
            )
            .selectMany(({ subscription, unreadcount }) => {
                return Enumerable.from(subscription.categories)
                    .defaultIfEmpty(uncategorized)
                    .select(category => ({ category, subscription, unreadcount }));
            })
        const categories = Enumerable.from(this.props.categories)
            .concat(Enumerable.make(uncategorized))
            .groupJoin(
                subscriptions,
                category => category.id,
                ({ category }) => category.id,
                (category, subscriptions) => ({ category, subscriptions: subscriptions.toArray() })
            )
            .where(({ subscriptions }) => subscriptions.length > 0)

        return (
            <div className="l-sidebar">
                <input className="subscription-filter" type="text" onChange={::this.handleFilterChanged} />
                <ul className="subscription-category-list">
                    {categories.select(::this.renderCategory).toArray()}
                </ul>
            </div>
        )
    }

    renderCategory({ category, subscriptions }) {
        const { selectedStreamId } = this.props

        return (
            <SubscriptionCategory key={category.id}
                                  category={category}
                                  subscriptions={subscriptions}
                                  selected={category.id === selectedStreamId}
                                  selectedStreamId={selectedStreamId} />
        )
    }
}

export default Sidebar
