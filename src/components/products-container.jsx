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
            <div className="message-container products-container">
                <h4>Your Owner: </h4>
                <ProductsList products={this.props.products} />
            </div>
        );
    }
}

ProductsContainer.propTypes = {
    products: PropTypes.array.isRequired
};

export default ProductsContainer;
