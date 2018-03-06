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
            <div className="message-container info">
                <TransactionsList transactions={this.props.transactions} />
                <button className="close-alert" onClick={this.handleHideTransactionsClick}>+</button>
            </div>
        );
    }
}

TransactionsContainer.propTypes = {
    transactions: PropTypes.array.isRequired,
    onHideTransactions: PropTypes.func.isRequired
};

export default TransactionsContainer;
