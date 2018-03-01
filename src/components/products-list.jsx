import React from 'react';
import PropTypes from 'prop-types';
import Product from './product';

export function ProductsList(props) {
    return props.products.map(function (value, index) {
        return (<div className="panel panel-info" style={{marginRight: "10px"}}>
            <div className="panel-body">
                <div className="alert alert-info">
                    <Product key={index} productId={value}/>
                </div>
            </div>
        </div>);
    });
}
ProductsList.propTypes = {
    products: PropTypes.array.isRequired
};
export default ProductsList;
