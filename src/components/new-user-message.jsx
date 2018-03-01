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
            <div className="message-container">
                <h4>Message: </h4>
                <div className="panel panel-success">
                    <div className="panel-body">
                        <div className="alert alert-success">
                            <p style={{margin: "0 15px"}}>You have successfully become a member of the system.</p>
                        </div>
                    </div>
                </div>
                <button
                    className="btn btn-success btn-xs authorize-btn"
                    onClick={this.handleClick}
                    style={{
                        marginTop: "10px",
                        float: "right"
                    }}
                >Close</button>
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
