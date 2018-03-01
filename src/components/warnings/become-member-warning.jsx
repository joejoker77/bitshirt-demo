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
            <div className="message-container warnings">
                <h4>Warning: </h4>
                <div className="panel panel-warning">
                    <div className="panel-body">
                        <div className="alert alert-warning">
                            <p style={{margin: "0 15px"}}>You are not a member yet. You can not make a purchase.</p>
                        </div>
                    </div>
                </div>
                <button
                    className="btn btn-warning btn-xs authorize-btn"
                    onClick={this.handleClick}
                    style={{
                        marginTop: "10px",
                        float: "right"
                    }}
                >Become a member</button>
            </div>
        );
    }
}

BecomeMemberWarning.propTypes = {
    onOpenModal: PropTypes.func.isRequired
};

export default BecomeMemberWarning;
