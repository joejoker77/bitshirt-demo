import React from 'react';
import PropTypes from 'prop-types';

import * as types from '../utils/transaction-types';

export function Transaction(props) {
  let txName = '';
  switch (props.type) {
    case types.TYPE_BUY_PRODUCT: txName   = 'Buy a product transaction'; break;
    case types.TYPE_BECOME_MEMBER: txName = 'Create user account';       break;
    case types.TYPE_PUT_IN_SALE: txName   = 'Put up for sale';           break;
    case types.TYPE_CHANGE_OWNER: txName  = 'Change owner product';      break;
  }

  return (
    <div className="panel panel-info">
      <div className="panel-body">
        {txName} - <a href={"https://ropsten.etherscan.io/tx/" + props.address} target="_blank">{props.address}</a>
      </div>
    </div>
  );
}
Transaction.propTypes = {
  type: PropTypes.oneOf(_.values(types)).isRequired,
  address: PropTypes.string.isRequired
};
export default Transaction;