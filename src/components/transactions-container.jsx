import React, {Component} from 'react';
import PropTypes from 'prop-types';

import TransactionsList from './transactions-list';

export class TransactionsContainer extends Component {
    constructor(props) {
        super(props);

        _.bindAll(this, [
            'handleHideTransactionsClick'
        ]);
    }

    handleHideTransactionsClick(e) {
        e.preventDefault();
        this.props.onHideTransactions();
    }

    render() {
        if (this.props.transactions.length === 0) {
            return null;
        }
        return (
            <div className="message-container transactions">
                <h4>Pending transaction: </h4>
                <div className="panel panel-info">
                    <div className="panel-body">
                        <TransactionsList transactions={this.props.transactions} />
                    </div>
                </div>
                <button
                    className="btn btn-warning btn-xs authorize-btn"
                    onClick={this.handleHideTransactionsClick}
                    style={{
                        marginTop: "10px",
                        float: "right"
                    }}
                >Hide Pending Transaction</button>
            </div>
        );
    }
}

TransactionsContainer.propTypes = {
    transactions: PropTypes.array.isRequired,
    onHideTransactions: PropTypes.func.isRequired
};

export default TransactionsContainer;
