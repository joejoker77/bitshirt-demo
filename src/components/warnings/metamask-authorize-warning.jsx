import React, {Component} from 'react';
import PropTypes from "prop-types";

class MetaMaskAuthorizeWarning extends Component {
    constructor(props){
        super(props);
        this.state = {
            isHide: false
        }
    }
    render(){
        if(this.state.isHide){return null}
        return <div className="message-container warning">
            <p>You are not authorized. Unlock your account in MetaMask and restart the page to be able to sign transactions.</p>
            <button className="close-alert" onClick={this.props.onCloseAlert}>+</button>
        </div>;
    }
}
MetaMaskAuthorizeWarning.propTypes = {
    onCloseAlert: PropTypes.func.isRequired
};
export default MetaMaskAuthorizeWarning;
