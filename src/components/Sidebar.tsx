import React, { PureComponent } from 'react';
import classnames from 'classnames';
import { History } from 'history';

import Dropdown from 'components/parts/Dropdown';
import MenuItem from 'components/parts/MenuItem';
import RelativeTime from 'components/parts/RelativeTime';
import Tree from 'components/parts/Tree';
import TreeBranch from 'components/parts/TreeBranch';
import TreeHeader from 'components/parts/TreeHeader';
import TreeLeaf from 'components/parts/TreeLeaf';
import bindAction from 'utils/bindAction';
import connect from 'utils/react/connect';
import { Category, State, Subscriptions, Subscription } from 'messaging/types';
import { fetchSubscriptions } from 'messaging/subscription/actions';

interface SidebarProps {
    isLoading: boolean;
    lastUpdatedAt: string | null;
    onFetchSubscriptions: () => void;
    router: History;
    selectedValue?: string;
    subscriptions: Subscriptions;
}

class Sidebar extends PureComponent<SidebarProps, {}> {
    componentWillMount() {
        const { lastUpdatedAt, onFetchSubscriptions } = this.props;

        if (lastUpdatedAt == null) {
            onFetchSubscriptions();
        }
    }

    handleSelect(selectedValue: string) {
        const { router } = this.props;

        router.replace(selectedValue);
    }

    handleReload(event: React.SyntheticEvent<any>) {
        event.preventDefault();

        const { isLoading, onFetchSubscriptions } = this.props;

        if (!isLoading) {
            onFetchSubscriptions();
        }
    }

    renderCategory(category: Category) {
        return (
                <TreeBranch key={`/streams/${encodeURIComponent(category.streamId)}`}
                            value={`/streams/${encodeURIComponent(category.streamId)}`}
                            className={classnames({ 'is-important': category.unreadCount > 0 })}
                            primaryText={category.label}
                            secondaryText={category.unreadCount > 0 ? Number(category.unreadCount).toLocaleString() : ''}>
                {category.subscriptions.map(subscription => this.renderSubscription(subscription))}
            </TreeBranch>
        );
    }

    renderSubscription(subscription: Subscription) {
        const icon = subscription.iconUrl
            ? <img alt={subscription.title} src={subscription.iconUrl} width={16} height={16} />
            : <i className="icon icon-16 icon-file" />;

        return (
            <TreeLeaf key={`/streams/${encodeURIComponent(subscription.streamId)}`}
                      value={`/streams/${encodeURIComponent(subscription.streamId)}`}
                      className={classnames({ 'is-important': subscription.unreadCount > 0 })}
                      primaryText={subscription.title}
                      secondaryText={subscription.unreadCount > 0 ? Number(subscription.unreadCount).toLocaleString() : ''}
                      icon={icon} />
        );
    }

    renderTree() {
        const { isLoading, lastUpdatedAt, selectedValue, subscriptions } = this.props;

        const categories = subscriptions.categories
            .map((category) => this.renderCategory(category));

        const lastUpdate = lastUpdatedAt
            ? <span>Updated <RelativeTime time={lastUpdatedAt} /></span>
            : 'Not updated yet';

        return (
            <Tree value={selectedValue}
                  onSelect={this.handleSelect.bind(this)}>
                <TreeLeaf key="/" value="/" primaryText="Dashboard" />
                <TreeLeaf key="/streams/all/" value="/streams/all/" primaryText="All" secondaryText={Number(subscriptions.totalUnreadCount).toLocaleString()} />
                <TreeLeaf key="/streams/pins/" value="/streams/pins/" primaryText="Pins" />
                <TreeHeader>
                    <button className="tree-node-icon" disabled={isLoading} onClick={this.handleReload.bind(this)}>
                        <i className={classnames('icon', 'icon-16', 'icon-refresh', {
                            'animation-clockwise-rotation': isLoading
                        })} />
                    </button>
                    <span className="tree-node-label">{lastUpdate}</span>
                    <Dropdown
                        pullRight={true}
                        className="tree-node-icon"
                        toggleButton={<button><i className="icon icon-16 icon-more" /></button>}>
                        <div className="menu-heading">Order</div>
                        <MenuItem primaryText="Newest First" />
                        <MenuItem primaryText="Oldest First" />
                        <div className="menu-divider" />
                        <MenuItem primaryText="Unread only" />
                    </Dropdown>
                </TreeHeader>
                {categories}
                <TreeLeaf key="/settings/" value="/settings/" primaryText="Settings" />
                <TreeLeaf key="/about/" value="/about/" primaryText="About..." />
            </Tree>
        );
    }

    render() {
        return (
            <nav className="sidebar">
                <div className="sidebar-group">
                    <input type="text" className="form-search-box" placeholder="Search for feeds ..." />
                </div>
                <div className="sidebar-group">
                    {this.renderTree()}
                </div>
                <div className="sidebar-group">
                    <button type="button" className="button button-block button-outline-default">New Subscription</button>
                </div>
                <div className="sidebar-group u-text-center">
                    <ul className="list-inline list-inline-slashed">
                        <li className="list-inline-item"><a href="#">emonkak@gmail.com</a></li>
                        <li className="list-inline-item"><a href="#">Logout</a></li>
                    </ul>
                </div>
            </nav>
        );
    }
}

export default connect(
    (state: State) => ({
        subscriptions: state.subscriptions,
        isLoading: state.subscriptions.isLoading,
        lastUpdatedAt: state.subscriptions.lastUpdatedAt
    }),
    (dispatch) => ({
        onFetchSubscriptions: bindAction(fetchSubscriptions, dispatch)
    })
)(Sidebar);
