import React, {Component} from 'react';
import PropTypes from 'prop-types';

class Product extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return <a href={"http://bitshirt.co/t-shirt/" + this.props.productId} target="_self">
            T-Shirt # {this.props.productId}
        </a>
    };
}
Product.propTypes = {
    productId: PropTypes.number.isRequired
};
export default Product;