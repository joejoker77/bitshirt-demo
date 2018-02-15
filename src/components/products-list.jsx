import React from 'react';
import PropTypes from 'prop-types';
import Product from './product';

export function ProductsList(props) {
    return props.products.map(function (value, index) {
        return <Product key={index} productId={value}/>
    });
}
ProductsList.propTypes = {
    products: PropTypes.array.isRequired
};
export default ProductsList;
