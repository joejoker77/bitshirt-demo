import React, { Component } from 'react';

export class LowBalanceWarning extends Component {

  render() {
    return (
      <div className="alert alert-warning text-center">
        <p>Balance of your account is too low.</p>

      </div>
    );
  }
}

export default LowBalanceWarning;
