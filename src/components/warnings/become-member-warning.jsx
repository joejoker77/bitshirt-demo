import React, { Component } from 'react';
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
      <div className="alert alert-warning text-center">
        <p>You are not a member yet. You can not make a purchase.</p>
        <button className="btn btn-warning authorize-btn" onClick={this.handleClick}>Become a member</button>
      </div>
    );
  }
}

BecomeMemberWarning.propTypes = {
    onOpenModal: PropTypes.func.isRequired
};

export default BecomeMemberWarning;
