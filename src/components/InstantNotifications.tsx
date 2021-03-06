import CSSTransitionGroup from 'react-addons-css-transition-group';
import React, { PureComponent } from 'react';

import InstantNotificationComponent from 'components/parts/InstantNotification';
import bindActions from 'utils/flux/bindActions';
import connect from 'utils/flux/react/connect';
import { InstantNotification, State } from 'messaging/types';
import { dismissInstantNotification } from 'messaging/instantNotifications/actions';

interface InstantNotificationsProps {
    instantNotification: InstantNotification | null;
    onDismissInstantNotification: typeof dismissInstantNotification;
}

class InstantNotifications extends PureComponent<InstantNotificationsProps, {}> {
    timer: number | null = null;

    componentDidMount() {
        const { instantNotification } = this.props;

        if (instantNotification) {
            this.startTimer(instantNotification);
        }
    }

    componentDidUpdate(prevProps: InstantNotificationsProps, prevState: {}) {
        const { instantNotification } = this.props;

        if (instantNotification
            && instantNotification !== prevProps.instantNotification) {
            this.restartTimer(instantNotification);
        }
    }

    componentWillUnmount() {
        this.stopTimer();
    }

    startTimer(instantNotification: InstantNotification) {
        if (instantNotification.dismissAfter > 0) {
            const { onDismissInstantNotification } = this.props;

            this.timer = setTimeout(() => {
                onDismissInstantNotification();
                this.timer = null;
            }, instantNotification.dismissAfter);
        }
    }

    restartTimer(instantNotification: InstantNotification) {
        this.stopTimer();
        this.startTimer(instantNotification);
    }

    stopTimer() {
        if (this.timer !== null) {
            clearTimeout(this.timer);
            this.timer = null;
        }
    }

    render() {
        const { instantNotification } = this.props;

        return (
            <CSSTransitionGroup
                component="div"
                transitionName="instant-notification"
                transitionEnterTimeout={200}
                transitionLeaveTimeout={200}>
                {instantNotification &&
                    <InstantNotificationComponent
                        instantNotification={instantNotification} />}
            </CSSTransitionGroup>
        );
    }
}

export default connect({
    mapStateToProps: (state: State) => ({
        instantNotification: state.instantNotifications.item
    }),
    mapDispatchToProps: bindActions({
        onDismissInstantNotification: dismissInstantNotification
    })
})(InstantNotifications);
