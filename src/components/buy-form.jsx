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
    empty(input){
        return input && typeof input !== 'undefined' && input !== '' ? input : false;
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

class BuyForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            address        : '',
            placeId        : '',
            checked        : '',
            sizeValue      : ''
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onChange = (address) => this.setState({ address });
        this.onSelect = (address, placeId) => {this.setState({ address, placeId });this.setState({selected: address})};
    }

    _checkState(event){
        let radioId = event.target.parentElement.getAttribute('for'),
            radioEl = window.document.getElementById(radioId);
        this.setState({checked: radioId, sizeValue: radioEl.defaultValue});
    }

    handleSubmit(event) {
        event.preventDefault();

        let $this = this;

        if(
            !geocodeByAddress(this.state.address)
                .then(results => getLatLng(results[0]))
                .catch(function () {
                    $this.setState({
                        invalid      : true,
                        displayErrors: true,
                    });
                    return false;
                })
        ){return}

        if (!event.target.checkValidity()) {
            this.setState({
                invalid      : true,
                displayErrors: true,
            });
            return;
        }

        const form = event.target;
        const data = new FormData(form);

        for (let name of data.keys()) {
            const input = form.elements[name];
            if(typeof input.dataset !== 'undefined' && typeof input.dataset.parse !== 'undefined'){
                const parserName = input.dataset.parse;
                if (parserName) {
                    const parsedValue = inputParsers[parserName](data.get(name));
                    if(parsedValue){
                        data.set(name, parsedValue);
                    }else{
                        this.setState({
                            invalid      : true,
                            displayErrors: true,
                        });
                        return;
                    }
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
            onChange: this.onChange
        };
        if(!this.props.hiddenInput){
            return (
                <div>
                    <h4>BUYING A T-SHIRT</h4>
                    <form onSubmit={this.handleSubmit} noValidate className={displayErrors ? 'displayErrors' : ''} id="contact_form" >
                        <label>SELECT SIZE <span className="required" style={{color:'red'}}>*</span></label>
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
                            <input type='hidden' name='sizeValue' data-parse="empty" value={this.state.sizeValue} required={true} />
                        </div>
                        <label htmlFor="PlacesAutocomplete__root">DELIVERY ADDRESS <span className="required" style={{color:'red'}}>*</span></label>
                        <PlacesAutocomplete className={'form-control'} inputProps={inputProps} highlightFirstSuggestion={true} onSelect={this.onSelect} />
                        <input id="delivery_address" name="delivery_address" type="hidden" value={this.state.selected} data-parse="empty" required />

                        <label htmlFor="delivery_flat">APARTMENT NUMBER</label>
                        <input
                            className="form-control"
                            type={'number'}
                            min={0}
                            max={9999}
                            name="delivery_flat"
                            id="delivery_flat"
                        />
                        <button className="blue_btn" type="submit">Pay {this.props.price} ETH</button>
                        <span className="modal_comment">You pay ${this.props.priceInUsd} for #{this.props.poductId}/1000 T-Shirt</span>
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
                            <p style={{textAlign: "center",marginBottom: "0"}}>By clicking the button below, you will transfer</p>
                            <p style={{textAlign: "center",marginBottom: "0"}}>{this.props.price} <b>Eth</b> (~{this.props.priceUsd} <b>$</b>) to {ownerAddress}</p>
                            <p style={{textAlign: "center",marginBottom: "0"}}>and you will become the owner for a T-shirt #{this.props.productId}</p>
                            <input id="size" name="size" type="hidden" value={this.props.size} required />
                        </div>
                        <label htmlFor="PlacesAutocomplete__root">
                            <span>DELIVERY ADDRESS</span>
                        </label>
                        <PlacesAutocomplete classNames={'form-control'} inputProps={inputProps} />
                        <input id="delivery_address" name="delivery_address" type="hidden" value={this.state.address} data-parse="empty" required />
                        <label htmlFor="delivery_flat">
                            <span>APARTMENT NUMBER</span>
                        </label>
                        <input className="form-control" type={'number'} min={0} max={9999} name="delivery_flat" id="delivery_flat" />
                        <div style={{float: "left", width: "100%"}}>
                            <button className="blue_btn" type="submit" style={{margin: "0 auto", display: "block", float: "none"}}>Pay {this.props.price} ETH</button>
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
    price       : PropTypes.string,
    priceInUsd  : PropTypes.string
};
export default BuyForm;


