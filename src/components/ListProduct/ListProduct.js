import React, { Component } from 'react';
import Product from '../Product/Product';
class ListProduct extends Component {
    render() {
        return (
            <div>
                <Product/>
                <Product/>
                <Product/>
                <Product/>
            </div>
        );
    }
}
export default ListProduct;