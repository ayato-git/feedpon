import React, { Children, PureComponent, cloneElement } from 'react';
import classnames from 'classnames';

import createChainedFunction from 'utils/createChainedFunction';

interface MenuProps {
    children?: React.ReactNode;
    onSelect?: (value?: any) => void;
    onClose?: () => void;
    pullRight?: boolean;
}

export class Menu extends PureComponent<MenuProps, {}> {
    static defaultProps = {
        pullRight: false
    };

    renderChild(child: React.ReactElement<any>) {
        if (child.type === MenuItem) {
            const { onSelect } = this.props;

            return cloneElement(child, {
                ...child.props,
                onSelect: createChainedFunction(
                    child.props.onSelect,
                    onSelect
                )
            });
        }

        if (child.type === MenuForm) {
            const { onClose } = this.props;

            return cloneElement(child, {
                ...child.props,
                onSubmit: createChainedFunction(
                    child.props.onSubmit,
                    onClose
                )
            });
        }

        return child;
    }

    render() {
        const { children, pullRight } = this.props;

        return (
            <div className={classnames('menu', {
                'menu-pull-right': pullRight!,
            })}>
                {Children.map(children, this.renderChild.bind(this))}
            </div>
        );
    }
}

interface MenuItemProps {
    icon?: React.ReactNode;
    isDisabled?: boolean;
    onSelect?: (value?: any) => void;
    primaryText: string;
    secondaryText?: string;
    value?: any;
}

export class MenuItem extends PureComponent<MenuItemProps, {}> {
    static defaultProps = {
        isDisabled: false
    };

    handleSelect(event: React.SyntheticEvent<any>) {
        event.preventDefault();

        const { onSelect, value } = this.props;

        if (onSelect) {
            onSelect(value);
        }
    }

    render() {
        const { icon, isDisabled, primaryText, secondaryText } = this.props;

        const iconElement = icon ? <span className="menu-item-icon">{icon}</span> : null;
        const primaryTextElement = <span className="menu-item-primary-text">{primaryText}</span>;
        const secondaryTextElement = <span className="menu-item-secondary-text">{secondaryText}</span>;

        if (isDisabled) {
            return (
                <div className="menu-item is-disabled">
                    {iconElement}
                    {primaryTextElement}
                    {secondaryTextElement}
                </div>
            );
        } else {
            return (
                <a className="menu-item" href="#" onClick={this.handleSelect.bind(this)}>
                    {iconElement}
                    {primaryTextElement}
                    {secondaryTextElement}
                </a>
            );
        }
    }
}

interface MenuFormProps {
    onSubmit?: () => void;
}

export class MenuForm extends PureComponent<MenuFormProps, {}> {
    constructor(props: MenuFormProps, context: any) {
        super(props, context);

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event: React.SyntheticEvent<any>) {
        event.preventDefault();

        const { onSubmit } = this.props;

        if (onSubmit) {
            onSubmit();
        }
    }

    render() {
        const { children } = this.props;

        return (
            <form className="menu-form" onSubmit={this.handleSubmit}>
                {children}
            </form>
        );
    }
}
