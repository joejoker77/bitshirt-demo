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
        this.state = {
            address: '',
            checked: ''
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onChange = (address) => this.setState({ address })
    }

    _checkState(event){
        let radioId = event.target.parentElement.getAttribute('for'),
            radioEl = window.document.getElementById(radioId);

        console.log(radioEl.defaultValue);

        this.setState({checked: radioId, sizeValue: radioEl.defaultValue});
    }

    handleSubmit(event) {

        event.preventDefault();

        geocodeByAddress(this.state.address)
            .then(results => getLatLng(results[0]))
            .then(latLng => console.log('Success', latLng))
            .catch(error => console.error('Error', error));

        if (!event.target.checkValidity()) {
            this.setState({
                invalid      : true,
                displayErrors: true,
                sizeValue    : ''
            });
            return;
        }

        const form = event.target;
        const data = new FormData(form);

        for (let name of data.keys()) {
            if(typeof form.elements.name !== 'undefined'){
                const input = form.elements[name];
                const parserName = input.dataset.parse;
                if (parserName) {
                    const parsedValue = inputParsers[parserName](data.get(name));
                    data.set(name, parsedValue);
                }
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
                    <h4>BUYING A T-SHIRT</h4>
                    <form onSubmit={this.handleSubmit} noValidate className={displayErrors ? 'displayErrors' : ''} id="contact_form" >
                        <label>SELECT SIZE</label>
                        <div id="group1" className="ui-buttonset">
                            <input
                                type="radio" name="size" id="radio1"
                                checked={this.state.checked.toString() === "radio1"}
                                className="ui-helper-hidden-accessible"
                                defaultValue="xs"
                            />
                            <label
                                htmlFor="radio1"
                                role="button"
                                aria-disabled="false"
                                className={this.state.checked.toString() === "radio1" ?
                                    "ui-button ui-widget ui-state-default ui-button-text-only ui-state-active" :
                                    "ui-button ui-widget ui-state-default ui-button-text-only"
                                }
                                onClick={(event) => this._checkState(event)}
                            >
                                <span className="ui-button-text">xs</span>
                            </label>

                            <input
                                type="radio" name="size" id="radio2"
                                checked={this.state.checked.toString() === "radio2"}
                                className="ui-helper-hidden-accessible"
                                defaultValue="s"
                            />
                            <label
                                htmlFor="radio2"
                                role="button"
                                aria-disabled="false"
                                className={this.state.checked.toString() === "radio2" ?
                                    "ui-button ui-widget ui-state-default ui-button-text-only ui-state-active" :
                                    "ui-button ui-widget ui-state-default ui-button-text-only"
                                }
                                onClick={(event) => this._checkState(event)}
                            >
                                <span className="ui-button-text">s</span>
                            </label>

                            <input
                                type="radio" name="size" id="radio3"
                                checked={this.state.checked.toString() === "radio3"}
                                className="ui-helper-hidden-accessible"
                                defaultValue="m"
                            />
                            <label
                                htmlFor="radio3"
                                role="button"
                                aria-disabled="false"
                                className={this.state.checked.toString() === "radio3" ?
                                    "ui-button ui-widget ui-state-default ui-button-text-only ui-state-active" :
                                    "ui-button ui-widget ui-state-default ui-button-text-only"
                                }
                                onClick={(event) => this._checkState(event)}
                            >
                                <span className="ui-button-text">m</span>
                            </label>

                            <input
                                type="radio" name="size" id="radio4"
                                checked={this.state.checked.toString() === "radio4"}
                                className="ui-helper-hidden-accessible"
                                defaultValue="l"
                            />
                            <label
                                htmlFor="radio4"
                                role="button"
                                aria-disabled="false"
                                className={this.state.checked.toString() === "radio4" ?
                                    "ui-button ui-widget ui-state-default ui-button-text-only ui-state-active" :
                                    "ui-button ui-widget ui-state-default ui-button-text-only"
                                }
                                onClick={(event) => this._checkState(event)}
                            >
                                <span className="ui-button-text">l</span>
                            </label>

                            <input
                                type="radio" name="size" id="radio5"
                                checked={this.state.checked.toString() === "radio5"}
                                className="ui-helper-hidden-accessible"
                                defaultValue="xl"
                            />
                            <label
                                htmlFor="radio5"
                                role="button"
                                aria-disabled="false"
                                className={this.state.checked.toString() === "radio5" ?
                                    "ui-button ui-widget ui-state-default ui-button-text-only ui-state-active" :
                                    "ui-button ui-widget ui-state-default ui-button-text-only"
                                }
                                onClick={(event) => this._checkState(event)}
                            >
                                <span className="ui-button-text">xl</span>
                            </label>

                            <input
                                type="radio" name="size" id="radio6"
                                checked={this.state.checked.toString() === "radio6"}
                                className="ui-helper-hidden-accessible"
                                defaultValue="2xl"
                            />
                            <label
                                htmlFor="radio6"
                                role="button"
                                aria-disabled="false"
                                className={this.state.checked.toString() === "radio6" ?
                                    "ui-button ui-widget ui-state-default ui-button-text-only ui-state-active" :
                                    "ui-button ui-widget ui-state-default ui-button-text-only"
                                }
                                onClick={(event) => this._checkState(event)}
                            >
                                <span className="ui-button-text">2xl</span>
                            </label>

                            <input
                                type="radio" name="size" id="radio7"
                                checked={this.state.checked.toString() === "radio7"}
                                className="ui-helper-hidden-accessible"
                                defaultValue="3xl"
                            />
                            <label
                                htmlFor="radio7"
                                role="button"
                                aria-disabled="false"
                                className={this.state.checked.toString() === "radio7" ?
                                    "ui-button ui-widget ui-state-default ui-button-text-only ui-state-active" :
                                    "ui-button ui-widget ui-state-default ui-button-text-only"
                                }
                                onClick={(event) => this._checkState(event)}
                            >
                                <span className="ui-button-text">3xl</span>
                            </label>

                            <input
                                type="radio" name="size" id="radio8"
                                checked={this.state.checked.toString() === "radio8"}
                                className="ui-helper-hidden-accessible"
                                defaultValue="4xl"
                            />
                            <label
                                htmlFor="radio8"
                                role="button"
                                aria-disabled="false"
                                className={this.state.checked.toString() === "radio8" ?
                                    "ui-button ui-widget ui-state-default ui-button-text-only ui-state-active" :
                                    "ui-button ui-widget ui-state-default ui-button-text-only"
                                }
                                onClick={(event) => this._checkState(event)}
                            >
                                <span className="ui-button-text">4xl</span>
                            </label>
                            <input type='hidden' name='sizeValue' value={this.state.sizeValue} />
                        </div>
                        <label htmlFor="PlacesAutocomplete__root">DELIVERY ADDRESS</label>
                        <PlacesAutocomplete className={'form-control'} inputProps={inputProps} />
                        <input id="delivery_address" name="delivery_address" type="hidden" value={this.state.address} required />

                        <label htmlFor="delivery_flat">ENTER THE NUMBER OF THE APARTMENT</label>
                        <input
                            className="form-control"
                            type={'number'}
                            min={0}
                            max={9999}
                            name="delivery_flat"
                            id="delivery_flat"
                        />
                        <button className="blue_btn" type="submit">Send data!</button>
                        <span className="modal_comment">You pay {this.props.price} ETH for #{this.props.poductId}/1000 T-Shirt</span>
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
    productId   : PropTypes.string,
    price       : PropTypes.string
};
export default BuyForm;


