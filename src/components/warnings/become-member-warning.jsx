import React, {Component} from 'react';
import PropTypes from 'prop-types';

export class BecomeMemberWarning extends Component {
    constructor(props) {
        super(props);
        _.bindAll(this, [
            'handleClick'
        ]);
    }

    handleClick(e) {
        e.preventDefault();
        this.props.onOpenModal();
    }

    render() {
        return (
            <div className="message-container warning">
                <p>
                    You are not a member yet. You can not make a purchase.
                    <button
                        className="btn btn-warning btn-xs authorize-btn"
                        onClick={this.handleClick}
                    >Become a member</button>
                </p>
                <button className="close-alert" onClick={this.props.onCloseAlert}>+</button>
            </div>
        );
    }
}

BecomeMemberWarning.propTypes = {
    onOpenModal: PropTypes.func.isRequired,
    onCloseAlert: PropTypes.func.isRequired
};

export default BecomeMemberWarning;
