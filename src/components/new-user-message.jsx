import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

export class NewUserMessage extends Component {
    constructor(props) {
        super(props);
        _.bindAll(this, [
            'handleClick'
        ]);
    }

    handleClick(e) {
        e.preventDefault();
        this.props.onHideNewUser();
    }

    render() {
        return (
            <div className="message-container success">
                <p>Thank you! You have successfully registered.</p>
                <button className="close-alert" onClick={this.handleClick}
                >+</button>
            </div>
        );
    }
}

NewUserMessage.propTypes = {
    onHideNewUser: PropTypes.func.isRequired,
    userName     : PropTypes.string.isRequired,
    userEmail    : PropTypes.string.isRequired
};

export default NewUserMessage;
