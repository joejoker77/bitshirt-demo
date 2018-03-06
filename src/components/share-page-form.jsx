import React, {Component} from 'react';
import PropTypes from 'prop-types';

const inputParsers = {
    date(input) {
        const split = input.split('/');
        const day   = split[1];
        const month = split[0];
        const year  = split[2];
        return `${year}-${month}-${day}`;
    },
    uppercase(input) {
        return input.toUpperCase();
    },
    number(input) {
        return parseFloat(input);
    },
};

class ShakingError extends Component {

    constructor() { super(); this.state = { key: 0 }; }

    componentWillReceiveProps() {
        this.setState({ key: ++this.state.key });
    }

    render() {
        return <div key={this.state.key} className="bounce">{this.props.text}</div>;
    }
}

class MyForm extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();

        if (!event.target.checkValidity()) {
            this.setState({
                invalid: true,
                displayErrors: true,
            });
            return;
        }
        const form = event.target;
        const data = new FormData(form);

        for (let name of data.keys()) {

            const input      = form.elements[name];
            const parserName = input.dataset.parse;

            if (parserName) {
                const parsedValue = inputParsers[parserName](data.get(name));
                data.set(name, parsedValue);
            }
        }

        function stringifyFormData(fd) {
            const data = {};
            for (let key of fd.keys()) {
                data[key] = fd.get(key);
            }
            return JSON.stringify(data, null, 2);
        }

        this.setState({
            res: stringifyFormData(data),
            invalid: false,
            displayErrors: false,
        });
        this.props.onFormMember(data);
    }

    render() {
        const { res, invalid, displayErrors } = this.state;
        return (
            <div>
                <form onSubmit={this.handleSubmit} noValidate className={displayErrors ? 'displayErrors' : ''} >
                    <label htmlFor="email">Email:</label>
                    <input className="form-control" id="email" name="email" type="email" required />
                    <button className="blue_btn">Send data!</button>
                </form>

                <div className="res-block">
                    {invalid && (
                        <ShakingError text="Form is not valid" />
                    )}
                    {!invalid && res && (
                        <div>
                            <h3>Transformed data to be sent:</h3>
                            <pre>FormData {res}</pre>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
MyForm.propTypes = {
    onFormMember: PropTypes.func.isRequired
};
export default MyForm;


