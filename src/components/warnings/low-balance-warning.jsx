import React, {Component} from 'react';

export class LowBalanceWarning extends Component {
    render() {
        return (
            <div className="message-container warning">
                <h4>Warning: </h4>
                <div className="panel panel-warning">
                    <div className="panel-body">
                        <div className="alert alert-warning">
                            <p style={{margin: "0 15px"}}>Balance of your account is too low.</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default LowBalanceWarning;
