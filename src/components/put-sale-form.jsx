import React, {Component} from 'react';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';
import axios from "axios/index";

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
    }
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

class PutSaleForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            profit: 0
        };
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
            const input = form.elements[name];
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
        this.props.onSendPutSale(data);
    }

    pingApi(value) {
        return new Promise(function (resolve, reject) {
            axios.get('https://api.coinmarketcap.com/v1/ticker/ethereum/?convert=USD')
                .then(function (response) {
                    if (response.status === 200) {
                        resolve("~"+parseFloat(response.data[0].price_usd * value).toFixed(0) + " $");
                    }
                }).catch(function (error) {
                resolve(error);
            });
        });
    }

    getUsd(value){
        this.pingApi(value).then(function (data) {
            this.setState({profit: data});
        }.bind(this));
    }

    renderField(){
        if(!this.state.profit || this.state.profit.toString() === "~0 $"){
            return null;
        }
        return <span style={{
            position: "absolute",
            top: "14px",
            right: "16px",
            fontSize: "10px",
            background: "#fff",
            padding: "2px"
        }}>(<b>{this.state.profit}</b>)</span>;
    }

    render() {
        const { res, invalid, displayErrors } = this.state;
        return (
            <div>
                <form
                    onSubmit={this.handleSubmit}
                    noValidate
                    className={displayErrors ? 'displayErrors put-sale-form' : 'put-sale-form'}
                >
                    <div className="custom-form-input" style={
                        {float:"left", marginTop: "-2px", position:"relative"}
                    }>
                        <NumberFormat
                            suffix          = {" Eth"}
                            isNumericString = {true}
                            decimalScale    = {4}
                            allowNegative   = {false}
                            placeholder     = "Type the selling price"
                            id              = "price"
                            name            = "price"
                            data-parse      = "number"
                            onValueChange   = {(values) => {
                                const {formattedValue, value} = values;
                                this.getUsd(value)
                            }} />
                        {this.renderField()}
                    </div>
                    <button className="btn btn-primary btn-large">Sell</button>
                </form>
                <div className="res-block">
                    {invalid && (
                        <ShakingError text="Form is not valid" />
                    )}
                </div>
            </div>
        );
    }
}
PutSaleForm.propTypes = {
    onSendPutSale: PropTypes.func.isRequired
};
export default PutSaleForm;


