import React, {Component} from 'react';
import PropTypes from 'prop-types';

class Product extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return <div className="panel-body">
            <a href={"http://bitshirt.co/t-shirt/" + this.props.productId} target="_self">
                T-Shirt # {this.props.productId}
            </a>
        </div>
    };
}
Product.propTypes = {
    productId: PropTypes.number.isRequired
};
export default Product;