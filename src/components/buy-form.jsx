import React, {Component} from 'react';
import PropTypes from 'prop-types';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import Utils from '../utils/utils';

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

class BuyForm extends Component {
    constructor(props) {
        super(props);
        this.state = {address: ''};
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onChange = (address) => this.setState({ address })
    }

    handleSubmit(event) {
        event.preventDefault();
        geocodeByAddress(this.state.address)
            .then(results => getLatLng(results[0]))
            .then(latLng => console.log('Success', latLng))
            .catch(error => console.error('Error', error));
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
        this.props.onBuyProduct(data);
    }

    render() {
        const { res, invalid, displayErrors } = this.state;
        const inputProps = {
            value: this.state.address,
            onChange: this.onChange,
        };
        if(!this.props.hiddenInput){
            return (
                <div>
                    <form onSubmit={this.handleSubmit} noValidate className={displayErrors ? 'displayErrors' : ''} >
                        <div className="form-group">
                            <label htmlFor="size">Change size:</label>
                            <select className="form-control" id="size" name="size">
                                <option value="S" >S</option>
                                <option value="M">M</option>
                                <option value="L">L</option>
                                <option value="XL">XL</option>
                                <option value="2XL">2XL</option>
                                <option value="4XL">4XL</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="PlacesAutocomplete__root">
                                Delivery address&nbsp;
                                <span style={{fontSize: "12px"}}>
                                    (You must select an address from the list)
                                </span>
                            </label>
                            <PlacesAutocomplete classNames={'form-control'} inputProps={inputProps} />
                            <input id="delivery_address" name="delivery_address" type="hidden" value={this.state.address} required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="delivery_flat">
                                Enter the number of the apartment or office (Optional)
                            </label>
                            <input
                                className="form-control"
                                type={'number'}
                                min={0}
                                max={9999}
                                name="delivery_flat"
                                id="delivery_flat" />
                        </div>

                        <div className="form-group" style={{textAlign:"center"}}>
                            <button className="form-control btn btn-primary btn-lg">Send data!</button>
                        </div>
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
        }else{
            const ownerAddress = Utils.formatAddressLong(this.props.owner);
            return (
                <div>
                    <form onSubmit={this.handleSubmit} noValidate className={displayErrors ? 'displayErrors' : ''} >
                        <div className="form-group">
                            <p style={{textAlign: "center"}}>By clicking the button below, you will transfer</p>
                            <p style={{textAlign: "center"}}>{this.props.price} <b>Eth</b> (~{this.props.priceUsd} <b>$</b>) to {ownerAddress}</p>
                            <p style={{textAlign: "center"}}>and you will become the owner fo a T-shirt #{this.props.productId}</p>
                            <input id="size" name="size" type="hidden" value={this.props.size} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="PlacesAutocomplete__root">
                                Delivery address&nbsp;
                                <span style={{fontSize: "12px"}}>
                                    (You must select an address from the list)
                                </span>
                            </label>
                            <PlacesAutocomplete classNames={'form-control'} inputProps={inputProps} />
                            <input id="delivery_address" name="delivery_address" type="hidden" value={this.state.address} required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="delivery_flat">
                                Enter the number of the apartment or office (Optional)
                            </label>
                            <input
                                className="form-control"
                                type={'number'}
                                min={0}
                                max={9999}
                                name="delivery_flat"
                                id="delivery_flat" />
                        </div>
                        <div className="form-group">
                            <button className="form-control btn btn-primary btn-lg">Order now!</button>
                        </div>
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
}
BuyForm.propTypes = {
    onBuyProduct: PropTypes.func.isRequired,
    hiddenInput : PropTypes.bool,
    size        : PropTypes.string,
    poductId    : PropTypes.string
};
export default BuyForm;


