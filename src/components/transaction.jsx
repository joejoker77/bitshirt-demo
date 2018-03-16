import React from 'react';
import PropTypes from 'prop-types';

import * as types from '../utils/transaction-types';

export function Transaction(props) {
    let txMessage = '';
    switch (props.type) {
        case types.TYPE_BUY_PRODUCT:
            txMessage = 'After TX confirmation you will become owner of T-shirt';
            break;
        case types.TYPE_BECOME_MEMBER:
            txMessage = '';
            break;
        case types.TYPE_PUT_IN_SALE:
            txMessage = 'After TX confirmation T-shirt will be available for purchase';
            break;
        case types.TYPE_CHANGE_OWNER:
            txMessage = 'After TX confirmation you will become new owner of T-shirt';
            break;
    }

    return (<p style={{whiteSpace: "no-wrap", margin: '0'}}>
        {txMessage}
        <a href={"https://etherscan.io/tx/" + props.address} target="_blank" className="transaction-link">
            Check status
            </a>
    </p>);
}

Transaction.propTypes = {
    type: PropTypes.oneOf(_.values(types)).isRequired,
    address: PropTypes.string.isRequired
};
export default Transaction;