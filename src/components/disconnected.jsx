import React, {Component} from 'react';
import Web3 from "web3";
import ProgressBar from 'react-bootstrap/lib/ProgressBar';
import img from '../images/resize.jpeg';
import axios from "axios/index";

const MAX_COUNT_PRODUCT  = 1000;

class Disconnected extends Component{

    constructor(props){
        super(props);
        this.state = {
            productsCount       : 0,
            startPrice          : 0,
            startPriceInUsd     : 0,
            endPriceInUsd       : 0
        };
    }
    componentWillMount(){
        this.init();
    }
    componentWillUpdate(){
        if(this.state.productsCount === 0){
            this.init();
        }
    }
    pingApi() {
        return new Promise(function (resolve, reject) {
            axios.get('https://api.coinmarketcap.com/v1/ticker/ethereum/?convert=USD')
                .then(function (response) {
                    if (response.status === 200) {
                        resolve(response.data);
                    }
                }).catch(function (error) {
                resolve(error);
            });
        });
    }

    init(){
        let $this = this;
        this.testInfura()
            .then(function (data) {
                $this.setState({
                    startPrice     : data.startPrice,
                    productsCount  : data.productsCount,
                    startPriceInUsd: data.startPriceInUsd,
                    endPriceInUsd  : data.endPriceInUsd
                });
        })
    }

    testInfura(){
        let $this = this;
        return new Promise(function (resolve, reject) {

            let web3         = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/7dH3Pu3mNLGa9Dvqbasp')),
                ContractAddr = "0x5c8eec1a5faeb8f7bb821584525c688fa130b1a6",
                fixPrice     = web3.eth.getStorageAt(ContractAddr, 5),
                productId    = web3.eth.getStorageAt(ContractAddr, 7);

            $this.pingApi().then(function (data2) {
                let web3          = new Web3(),
                    minPrice      = web3.fromWei(parseInt(fixPrice, 16)),
                    productCount  = parseInt(productId, 16),
                    priceInUsd    = (data2[0].price_usd * (minPrice * productCount)).toFixed(2),
                    maxPriceInUsd = (data2[0].price_usd * (minPrice * 1000)).toFixed(2);

                resolve({
                    startPrice      : minPrice * productCount,
                    productsCount   : productId,
                    startPriceInUsd : priceInUsd,
                    endPriceInUsd   : maxPriceInUsd
                });
            });
        });
    }

    render(){
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="alert alert-danger text-left">
                            <h4>Cannot connect to the blockchain.</h4>
                            <h5>Check your MetaMask plugin and connection to the Ropsten Test Network.</h5>
                            <p>In order to make purchases, install an extension for your browser
                                <a href="https://metamask.io/" target="_blank" > MetaMask </a> and reload the page.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4">
                        <img src={img} width="100%" height="auto" />
                    </div>
                    <div className="col-md-8">
                        <div className="app-title">
                            <h2>Title</h2>
                        </div>
                        <div className="app-desc">
                            <p>Description</p>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <p>Current price</p>
                                <p className="current-price">
                                    {this.state.startPrice} <b>Eth</b> (~{this.state.startPriceInUsd} <b>$</b>)
                                </p>
                            </div>
                            <div className="col-md-6" style={{textAlign: 'right'}}>
                                <p>Final price</p>
                                <p className="final-price">
                                    1 <b>Eth </b> (~{this.state.endPriceInUsd} <b>$</b>)
                                </p>
                            </div>
                        </div>
                        <div className="tshirt-left" style={{float:"left", width:"100%", marginBottom: "20px"}}>
                            <h3>T-Shirt left: # {1000 - this.state.productsCount} pieces</h3>
                            <ProgressBar className="right" active now={(this.state.productsCount / MAX_COUNT_PRODUCT) * 100} />
                            <div className="start-left" style={{float:"left"}}>1</div>
                            <div className="stop-left" style={{float:"right"}}>1000</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default Disconnected;
