import React, {Component} from 'react';
import PropTypes from 'prop-types';

import ProductsList from './products-list';

export class ProductsContainer extends Component {
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
        if (this.props.products.length === 0) {
            return null;
        }
        return (
            <div className="message-container info">
                <p>You are owner of following t-shirts: <ProductsList products={this.props.products} /></p>
                <button className="close-alert" onClick={this.props.onCloseAlert}>+</button>
            </div>
        );
    }
}

ProductsContainer.propTypes = {
    products: PropTypes.array.isRequired,
    onCloseAlert: PropTypes.func.isRequired
};

export default ProductsContainer;
