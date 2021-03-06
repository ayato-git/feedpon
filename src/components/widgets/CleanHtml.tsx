import React, { PureComponent } from 'react';
import { findDOMNode } from 'react-dom';

import cleanNode from 'utils/dom/cleanNode';
import walkNode from 'utils/dom/walkNode';

interface CleanHtmlProps {
    className?: string;
    baseUrl: string;
    html: string | null;
}

export default class CleanHtml extends PureComponent<CleanHtmlProps, {}> {
    componentDidMount() {
        this.updateContent();
    }

    componentDidUpdate() {
        this.updateContent();
    }

    updateContent() {
        const { baseUrl, html } = this.props;

        const content = document.createElement('div');

        if (html) {
            content.insertAdjacentHTML('beforeend', html);

            walkNode(content, (child) => cleanNode(child, baseUrl));
        }

        this.replaceContent(content);
    }

    replaceContent(element: HTMLElement) {
        const container = findDOMNode(this);

        if (container.firstChild) {
            container.replaceChild(element, container.firstChild);
        } else {
            container.appendChild(element);
        }
    }

    render() {
        const { className } = this.props;

        return (
            <div className={className}></div>
        );
    }
}
