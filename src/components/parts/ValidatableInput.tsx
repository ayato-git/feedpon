import React, { PureComponent } from 'react';
import classnames from 'classnames';

interface ValidatableInputProps extends React.HTMLAttributes<HTMLInputElement> {
    invalidClassName?: string | null;
    validClassName?: string | null;
    validations?: { rule: (value: string) => boolean, message: string }[];
}

interface ValidatableInputState {
    status: 'empty' | 'valid' | 'invalid';
}

export default class ValidatableInput extends PureComponent<ValidatableInputProps, ValidatableInputState> {
    static defaultProps = {
        invalidClassName: 'has-error',
        validClassName: 'has-success',
        validations: []
    };

    private inputElement: HTMLInputElement | null;

    constructor(props: ValidatableInputProps, context: any) {
        super(props, context);

        this.handleChange = this.handleChange.bind(this);

        this.state = { status: 'empty' };
    }

    componentDidMount() {
        this.update();
    }

    componentDidUpdate(prevProps: ValidatableInputProps, prevState: ValidatableInputState) {
        if (this.props.value !== prevProps.value) {
            this.update();
        }
    }

    update() {
        if (!this.inputElement) {
            return;
        }

        const input = this.inputElement;

        if (input.value) {
            const { validations } = this.props;
            let error = '';

            for (const validation of validations!) {
                if (!validation.rule(input.value)) {
                    error = validation.message;
                    break;
                }
            }

            input.setCustomValidity(error);

            this.setState({
                status: input.validity.valid ? 'valid' : 'invalid'
            });
        } else {
            input.setCustomValidity('');

            this.setState({ status: 'empty' });
        }
    }

    handleChange(event: React.FormEvent<HTMLInputElement>) {
        this.update();

        const { onChange } = this.props;

        if (onChange) {
            onChange(event);
        }
    }

    render() {
        const { className, invalidClassName, validClassName, validations, ...restProps } = this.props;
        const { status } = this.state;

        return (
            <input
                {...restProps}
                ref={(element) => this.inputElement = element}
                className={classnames(className, {
                    [invalidClassName!]: status === 'invalid',
                    [validClassName!]: status === 'valid'
                })}
                onChange={this.handleChange} />
        );
    }
}