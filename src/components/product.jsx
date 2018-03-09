import React, {Component} from 'react';
import PropTypes from 'prop-types';

class Product extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return <a href={"https://bitshirt.co/t-shirt/" + this.props.productId} className="product-link" target="_self">
            T-Shirt # {this.props.productId}
        </a>
    };
}
Product.propTypes = {
    productId: PropTypes.number.isRequired
};
export default Product;