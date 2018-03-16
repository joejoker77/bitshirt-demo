import React, {Component} from 'react';
import ReactModal from 'react-modal';
import {isMobile} from 'react-device-detect';
import _ from 'lodash';
import axios from "axios/index";
import Utils from "../utils/utils";
import * as contract from '../contracts/TShirt.json';
import Header from './header';
import SharePageForm from './share-page-form';
import Footer from './footer';
import SmallTshirt from '../images/lending/small-tshirt-wo-shadows-bg.png';
import Web3 from "web3";
import $ from "jquery";

ReactModal.setAppElement('#root');

export class App extends Component {
    constructor(props) {
        super(props);
        this.initBlockchain();
        this.state = {
            isWarning: true,
            productIndex: false,
            ownerAddress: '',
            size: '',
            price: '',
            delivery: '',
            inSale: false,
            historyData: {},
            formatHistory: [],
            userName: '',
            userEmail: '',
            pageShare: false,
            ethUsdRate: [{price_usd: 1}]
        };
        _.bindAll(this, [
            'handleCloseAlert',
            'handleSharePage',
            'handleOpenModal',
            'handleCloseModal'
        ]);
    }
    componentWillMount(){
        this.getProduct();
    }
    componentDidMount(){
        let body = document.querySelector('body');
        body.classList.add('second-page');
        window.onscroll = function () {
            window.pageYOffset > 5 ? body.classList.add('f-nav') : body.classList.remove('f-nav');
        };
    }
    componentWillUpdate(nextProps, nextState){
        if(nextState.ownerAddress !== '' && Object.keys(nextState.historyData).length === 0 && nextState.ownerAddress !== '0x0000000000000000000000000000000000000000'){
            this.getHistory();
            this.getOwner(nextState.ownerAddress);
        }
        if(Object.keys(nextState.historyData).length > 0 && this.state.formatHistory.length === 0){
            this.formatHistory();
        }
    }
    initBlockchain(){
        let web3         = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/7dH3Pu3mNLGa9Dvqbasp')),
            ContractAddr = contract.address,
            ABI          = contract.abi;

        this.blockchain = web3.eth.contract(ABI).at(ContractAddr);
        this.web3       = web3;
    }
    getProduct(){
        let self      = this,
            productId = Number(this.props.match.params.number).toString(16);

        new Promise(function (resolve, reject) {
            self.blockchain.productStructs(Utils.stringToBytes32(productId, true), function (err, res) {
                if(err){reject(err);}
                self.setState({
                    productIndex: res[0].toNumber(),
                    ownerAddress: Utils.productIdToAddress(res[1]),
                    size: Utils.hexToAscii(res[2]),
                    price: self.web3.fromWei(res[3].toNumber()),
                    delivery: res[4],
                    inSale: res[5]
                });
            });
        });
    }

    getOwner(address){
        let self     = this;
        const userId = Utils.addressToProductId(address);

        if (typeof address === 'undefined' || !address) {
            return Promise.resolve({});
        }
        new Promise(function () {
            self.blockchain.userStructs(userId, function (err, res) {
                self.setState({
                    userName: Utils.hexToAscii(res[2]),
                    userEmail: Utils.hexToAscii(res[1])
                });
            });
        });
    }

    getHistory(){
        let self      = this,
            productId = Number(this.props.match.params.number).toString(16);

        const historyUser = new Promise(function (rslv, rjct) {
            self.blockchain.getProductHistoryUser(Utils.stringToBytes32(productId, true), function (err, res) {
                err ? rjct(err) : rslv(res);
            });
        });
        const historyDate = new Promise(function (rslv, rjct) {
            self.blockchain.getProductHistoryDate(Utils.stringToBytes32(productId, true), function (err, res) {
                err ? rjct(err) : rslv(res);
            });
        });
        const historyPrice = new Promise(function (rslv, rjct) {
            self.blockchain.getProductHistoryPrice(Utils.stringToBytes32(productId, true), function (err, res) {
                err ? rjct(err) : rslv(res);
            });
        });
        new Promise(function (r, j) {
            Promise.all([historyUser, historyDate, historyPrice]).then(function (data) {
                if(data.length > 0) {
                    let count  = data[0].length,
                        res    = {};
                    for(let i=1; i <= count;i++){
                        for(let j in data){
                            if(typeof res[i] === 'undefined'){res[i] = [data[j][i]];}
                            res[i][j] = data[j][i-1];
                        }
                    }
                    self.setState({historyData: res});
                }else{
                    j('data is empty')
                }
            }.bind(this));
        });
    }
    formatHistory(){
        let promises = [],
            data     = this.state.historyData,
            self     = this;

        for(let i in data){
            let userId = Utils.addressToProductId(data[i][0]);
            const promise = new Promise(function (resolve, reject) {
                this.blockchain.userStructs(userId, function (err, res) {
                    err ? reject(err) : resolve(res);
                });
            }.bind(this));

            promises.push(promise);
        }

        const usdRate = new Promise(function (resolve, reject) {
            axios.get('https://api.coinmarketcap.com/v1/ticker/ethereum/?convert=USD')
                .then(function (response) {
                    if (response.status === 200) {
                        self.setState({ethUsdRate: response.data});
                        resolve(response.data);
                    }
                }).catch(function (error) {
                resolve(error);
            });
        });
        promises.push(usdRate);
        new Promise(function (resolve, reject) {
            let result = [];
            Promise.all(promises).then(function (answer) {
                let rateUsd = answer.pop();
                for(let j in data){
                    let userName  = Utils.capitalizeString(Utils.hexToAscii(answer[j-1][2])) + ' ' +
                        Utils.formatAddressLong(data[j][0]);
                    let userData  = Utils.formatDate(data[j][1].toNumber());
                    let userPrice = self.web3.fromWei(data[j][2].toNumber()) + ' Eth (' +
                        +parseFloat(rateUsd[0].price_usd * self.web3.fromWei(data[j][2].toNumber())).toFixed(2) + ' $)';
                    result.push([userName, userData, userPrice]);
                }
                self.setState({formatHistory: result});
            }).catch(function (error) {
                reject(error);
            });
        })
    }

    handleOpenModal () {
        this.setState({ showModal: true });
    }

    handleCloseModal () {
        this.setState({ showModal: false });
    }

    handleSharePage(){
        let mailData     = {},
            $this        = this,
            ownerAddress = Utils.addressToProductId($this.state.ownerAddress);

        mailData.action = 'Share page';

        new Promise(function () {
            this.blockchain.userStructs(ownerAddress, function (err, res) {
                mailData.user = {
                    userIndex: res[0].toNumber(),
                    userName: Utils.hexToAscii(res[2]),
                    userEmail: Utils.hexToAscii(res[1])
                };
                mailData.productId = $this.props.match.params.number;
                $this.setState({pageShare: true});
                $this.setState({mailData: mailData});
                $this.handleOpenModal();
            });
        }.bind(this));
    }

    sendMessageSharePage(data) {
        if(Object.keys(this.state.mailData).length === 0){
            return null;
        }
        if(!this.state.pageShare){
            return null;
        }
        let mailData = this.state.mailData,
            $this    = this;
        mailData.to = data.get('email');
        $.ajax({
            method: "POST",
            url: 'https://bitshirt.co/sendmail.php',
            data: mailData,
            success: function () {
                $this.setState({mailData: {}});
                $this.setState({pageShare: false});
                $this.handleCloseModal();
            },
            error: function (error) {
                console.log(error);
            }
        });
    }

    handleCloseAlert(){
        this.setState({isWarning: false});
    }

    renderPrise() {
        if (!this.state.inSale) {
            return <p className="current-price">
                <span className="sh_bought">THIS T-SHIRT WAS BOUGHT FOR:</span>
                <span className="sh_price">{this.state.price} ETH</span>
                <span className="sh_price_usd">~ $ {+parseFloat(this.state.ethUsdRate[0].price_usd * this.state.price).toFixed(2)}</span>
                <span className="clearfix" />
            </p>
        } else {
            return (<div>
                <span className="sh_moment">AT THE MOMENT THE OWNER IS<br />SELLING A T-SHIRT:</span>
                <div className="sh_buy">
                    <span>
                        <small>SELLING PRICE:</small>
                        <big>{this.state.price} ETH</big>
                        <span className="sh_price_usd">~ $ {this.state.priceInUsd}</span>
                        <span className="clearfix" />
                    </span>
                    <a className="blue_btn" onClick={this.handleOpenModal}>BUY T-SHIRT</a>
                </div>
            </div>);
        }
    }

    renderPutSaleActions() {
        if(this.state.formatHistory.length === 0){
            return null;
        }
        if(!this.state.inSale) {
            return <div>
                <div className='danger'>The owner did not put a T-shirt for sale.</div>
                {this.renderHistory()}
            </div>
        } else {
            return <div>
                <div className='danger sh_sell'>You must become a member!</div>
                {this.renderHistory()}
            </div>
        }
    }

    renderHistory(){
        return <div className="sh_table">
            <span className="sh_table_name">OWNERSHIP HISTORY:</span>
            <span className="sh_coll coll_numb">
                <big>#</big>
                {Array.prototype.map.call(this.state.formatHistory, function (val, index) {
                    return (<small key={index}>{index + 1}</small>)
                })}
            </span>
            <span className="sh_coll coll_owner">
                <big>Owner</big>
                {Array.prototype.map.call(this.state.formatHistory, function (val, index) {
                    return (<small key={index}>{
                        Array.prototype.map.call(val, function (value, indx) {
                            return( indx === 0 ? <td key={indx}>{value}</td> : null)
                        })
                    }</small>)
                })}
            </span>
            <span className="sh_coll coll_date">
                <big>Date of purchase</big>
                {Array.prototype.map.call(this.state.formatHistory, function (val, index) {
                    return (<small key={index}>{
                        Array.prototype.map.call(val, function (value, indx) {
                            return( indx === 1 ? <td key={indx}>{value}</td> : null)
                        })
                    }</small>)
                })}
            </span>
            <span className="sh_coll coll_cost">
                <big>Cost</big>
                {Array.prototype.map.call(this.state.formatHistory, function (val, index) {
                    return (<small key={index}>{
                        Array.prototype.map.call(val, function (value, indx) {
                            return( indx === 2 ? <td key={indx}>{value}</td> : null)
                        })
                    }</small>)
                })}
             </span>
        </div>;
    }

    renderForm() {
        if(!this.state.pageShare) {
            return <div className='form-buy-product' />
        }else{
            return <div className="form-share-page">
                <SharePageForm onFormMember={this.sendMessageSharePage} />
            </div>
        }
    }

    render() {
        if(this.state.ownerAddress === '0x0000000000000000000000000000000000000000') {
            return (
                <div className="app second_page">
                    <Header
                        secondPage={true}
                        size="M"
                        userName=""
                        number={this.props.match.params.number}
                        shareHandler={this.handleSharePage}
                    />
                    <div id="second_header">
                        <div className="container">
                            <div className="header_container">
                                <div className="col-md-12">Error 404! Page not found!</div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }else if (this.state.ownerAddress === '') {
            return (
                <div className="app second_page">
                    <Header
                        secondPage={true}
                        size={this.state.size}
                        userName={this.state.userName}
                        number={this.props.match.params.number}
                        shareHandler={this.handleSharePage}
                    />
                    <div id="second_header">
                        <div className="container">
                            <div className="header_container">
                                <div className="col-md-12">Please await!</div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="app second_page">
                    <Header
                        secondPage={true}
                        size={this.state.size}
                        userName={this.state.userName}
                        number={this.props.match.params.number}
                        shareHandler={this.handleSharePage}
                    />
                    <div id="second_header">
                        <div className="container">
                            <div className="header_container">
                                <h1>{Utils.capitalizeString(this.state.userName)}'s T-SHIRT</h1>
                                <p className="sh_pretext">This product is genuine</p>
                                <span className="sh_number">
                                    <big>{this.props.match.params.number}</big>
                                    <small>UNIQUE<br />NUMBER</small>
                                </span>
                                <span className="sh_size">
                                    <big style={{textTransform:'uppercase'}}>{this.state.size}</big>
                                    <small>T-SHIRT<br />SIZE</small>
                                </span>
                                {this.renderPrise()}
                                {this.renderPutSaleActions()}
                            </div>
                            <div className="header_img">
                                <img src={SmallTshirt} alt="" />
                            </div>
                        </div>
                        <div className="header_border" />
                    </div>
                    <Footer />
                    {this.state.isWarning ? <div className="window-message">
                        <div className="message">
                            <div className="message-container danger">
                                <p>{isMobile ?
                                    "You can only purchase t-shirt on a desktop browser like Chrome, Firefox or Opera" :
                                    "There is no connection to the MetaMask plugin. Install the plugin for your MetaMask browser and refresh the page."}</p>
                                <button
                                    className="close-alert"
                                    onClick={this.handleCloseAlert}
                                >+</button>
                            </div>
                        </div>
                    </div> : null}
                    <ReactModal isOpen={this.state.showModal} id="buy" className="reveal-modal">
                        {this.renderForm()}
                        <a className="close-reveal-modal" onClick={this.handleCloseModal} />
                    </ReactModal>
                </div>
            );
        }
    }
}
export default App;