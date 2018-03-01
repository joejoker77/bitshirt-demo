import React from 'react';

export function MetaMaskAuthorizeWarning(props) {
  return (
      <div className="message-container warnings">
          <h4>Warning: </h4>
          <div className="panel panel-warning">
              <div className="panel-body">
                  <div className="alert alert-warning">
                      <p style={{margin: "0 15px"}}>
                          You are not authorized. Unlock your account in MetaMask and restart the page to be able to sign transactions.
                      </p>
                  </div>
              </div>
          </div>
      </div>
  );
}
export default MetaMaskAuthorizeWarning;
