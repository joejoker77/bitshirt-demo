import React, {Component} from 'react';
import ReactModal from 'react-modal';
import _ from 'lodash';
import Blockchain from '../utils/blockchain';
import TransactionsStorage from '../utils/transactions-storage';
import TransactionsContainer from './transactions-container';
import * as transactionTypes from "../utils/transaction-types";
import Header from './header';
import HeaderAccount from './header-account';
import HeaderBalance from './header-balance';
import MetaMaskAuthorizeWarning from './warnings/metamask-authorize-warning';
import BecomeMemberWarning from './warnings/become-member-warning';
import LowBalanceWarning from './warnings/low-balance-warning';
import img from '../images/resize.jpeg';
import ProgressBar from 'react-bootstrap/lib/ProgressBar';
import Form from './buy-form';
import FormMember from './member-form';
import axios from "axios/index";
import $ from 'jquery';
import ProductsContainer from './products-container';


const USER_BALANCE_LIMIT = 0.1;
const MAX_COUNT_PRODUCT  = 1000;

const customStyles = {
    overlay : {
        position       : 'fixed',
        top            : 0,
        left           : 0,
        right          : 0,
        bottom         : 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)'
    },
    content : {
        position               : 'absolute',
        top                    : '50%',
        left                   : '50%',
        right                  : 'auto',
        bottom                 : 'auto',
        marginRight            : '-50%',
        transform              : 'translate(-50%, -50%)',
        border                 : '1px solid #ccc',
        background             : '#fff',
        overflow               : 'auto',
        WebkitOverflowScrolling: 'touch',
        borderRadius           : '4px',
        outline                : 'none',
        padding                : '20px'

    }
};

ReactModal.setAppElement('#root');

export class App extends Component {

    constructor(props) {
        super(props);
        this.initBlockchain();
        this.state = {
            showModal           : false,
            modalIsOpen         : false,
            productsCount       : 0,
            transactions        : [],
            currentAccountLoaded: false,
            startPrice          : 0,
            startPriceInUsd     : 0,
            endPriceInUsd       : 0,
            products            : [],
            isParticipant       : false
        };
        _.bindAll(this, [
            'handleBuyProduct',
            'handleOpenModal',
            'handleCloseModal',
            'handleHideTransactions',
            'handleBecomeMember'
        ]);
    }
    initBlockchain(){
        this.blockchain          = new Blockchain();
        this.transactionsStorage = new TransactionsStorage(this.blockchain);
    }
    componentWillMount() {
        this.transactionsStorage.startChecker(function (type) {
            if(typeof type !== 'undefined') {
                let productCount = this.state.productsCount,
                    requestData  = {},
                    $this        = this;
                switch (type){
                    case 'BuyProduct':
                        requestData.action    = "Buy new product";
                        requestData.productId = productCount+1;
                        this.blockchain.getOwnerProductInfo($this.state.userAddress)
                            .then(function (data) {
                                requestData.user = data;
                                $this.blockchain.getCurrentPersonalProductInfo(productCount+1)
                                    .then(function (data2) {
                                        requestData.product = data2;
                                        $.ajax({
                                            method: "POST",
                                            url: 'http://bitshirt.co/sendmail.php',
                                            data: requestData,
                                            success: function () {
                                                window.location.href = '/t-shirt/' + (productCount+1);
                                            },
                                            error: function (error) {
                                                console.log(error);
                                            }
                                        });
                                    });

                            });break;
                    case 'BecomeMember':
                        this.blockchain.getOwnerProductInfo(this.state.userAddress)
                            .then(function (data) {
                                requestData.action    = "Become member";
                                requestData.user      = data;
                                requestData.productId = $this.props.match.params.number;
                                $.ajax({
                                    method: "POST",
                                    url: 'http://bitshirt.co/sendmail.php',
                                    data: requestData,
                                    success: function () {
                                        window.location.href = '/';
                                    },
                                    error: function (error) {
                                        console.log(error);
                                    }
                                });
                            });break;
                }
            }
            this.updateData();
        }.bind(this));
        this.updateData();
    }

    componentWillUnmount() {
        this.transactionsStorage.stopChecker();
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

    updateData() {
        this.blockchain.getContractBalance().then(function (balance) {
            this.setState({balance: balance});
        }.bind(this));

        this.blockchain.getCurrentAccountInfo()
            .then(function (data) {
                this.setState({
                    userAddress         : data.address,
                    userBalance         : data.balance,
                    isUser              : data.isUser,
                    isParticipant       : data.isParticipant,
                    userName            : data.userName,
                    userEmail           : data.userEmail,
                    currentAccountLoaded: true,
                    products            : data.products
                });
            }.bind(this))
            .catch(function (error) {
                console.error(error);
            });

        this.blockchain.getProductCount().then(function (productsCount) {
            this.setState({productsCount: productsCount});
        }.bind(this));

        this.blockchain.getStartPrice().then(function (startPrice) {
            let $this = this;
            this.pingApi().then(function (data) {
                let usdPrice    = +parseFloat(web3.fromWei(data[0].price_usd * startPrice)).toFixed(2);
                let usdEndPrice = data[0].price_usd;
                $this.setState({
                    startPrice     : startPrice,
                    startPriceInUsd: usdPrice,
                    endPriceInUsd  : usdEndPrice
                });
            });
        }.bind(this)).catch(function (error) {
            console.log(error);
        });
        this.updateTransactions();
    }

    handleBuyProduct(data) {
        this.handleCloseModal();
        let delivery = data.get('delivery_flat') ?
            data.get('delivery_address') + ' ' + 'house/office: ' + data.get('delivery_flat') :
            data.get('delivery_address');
        this.blockchain.buyProduct(data.get('size'), delivery, this.state.startPrice, this.state.userName, this.state.userEmail)
            .then(function (txHash) {
                const tx = {
                    transactionHash: txHash,
                    type: transactionTypes.TYPE_BUY_PRODUCT
                };
                this.transactionsStorage.addTransaction(tx);
                this.updateData();
            }.bind(this))
            .catch(function (error) {
                console.error(error);
            });
    }

    handleBecomeMember(data) {

        let userName  = data.get('username'),
            userEmail = data.get('email');

        this.handleCloseModal();
        this.blockchain.becomeMember(userName, userEmail)
            .then(function (data) {
                if(data.status === 200 && data.data.status === "success"){
                    this.setState({
                        isParticipant: true,
                        userName     : userName,
                        userEmail    : userEmail
                    });
                }
            }.bind(this))
            .catch(function (error) {
                console.error(error);
            });
    }

    handleHideTransactions() {
        this.transactionsStorage.hidePendingTransactions();
        this.updateTransactions();
    }

    updateTransactions() {
        this.setState({transactions: this.transactionsStorage.getPendingTransactions()});
    }

    renderWarnings() {
        if (!this.state.currentAccountLoaded) {
            return null;
        }
        if (!this.state.userAddress) {
            return <MetaMaskAuthorizeWarning/>;
        } else if (this.state.userBalance < USER_BALANCE_LIMIT) {
            return <LowBalanceWarning onMint={this.handleMint} />;
        } else if (this.state.userAddress && !this.state.isParticipant) {
            return <BecomeMemberWarning onOpenModal={this.handleOpenModal}/>;
        }
    }

    renderForm(){
        if (this.state.userAddress && !this.state.isParticipant) {
            return <div className='form-member'>
                <FormMember onFormMember={this.handleBecomeMember}/>
            </div>
        }else{
            return (
                <div className='form-buy-product'>
                    <Form onBuyProduct={this.handleBuyProduct}/>
                </div>
            );
        }
    }

    renderBuyButton(){
        if(this.state.userAddress && !this.state.isParticipant) {
            return '';
        }else{
            if(this.state.products && this.state.products.length > 0){
                return <div>
                    <div className="col-md-12">
                        <button style={{float:"right"}} className="btn btn-primary btn-lg" onClick={this.handleOpenModal}>Order now!</button>
                    </div>
                    <div className="col-md-12">
                        <ProductsContainer products={this.state.products} />
                    </div>
                </div>;
            } else {
                return <button style={{float:"right"}} className="btn btn-primary btn-lg" onClick={this.handleOpenModal}>Order now!</button>;
            }
        }
    }

    handleOpenModal () {
        this.setState({ showModal: true });
    }

    handleCloseModal () {
        this.setState({ showModal: false });
    }

    render() {
        return (
            <div className="app">
                <Header>
                    <HeaderAccount address={this.state.userAddress} balance={this.state.userBalance}/>
                    <HeaderBalance balance={this.state.balance} />
                </Header>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            {this.renderWarnings()}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <TransactionsContainer transactions={this.state.transactions}
                                                   onHideTransactions={this.handleHideTransactions}/>
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
                                        {web3.fromWei(this.state.startPrice)} <b>Eth</b> (~{this.state.startPriceInUsd} <b>$</b>)
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
                            {this.renderBuyButton()}
                            <ReactModal
                                isOpen={this.state.showModal} style={customStyles}>
                                <button className="close-modal" onClick={this.handleCloseModal}>+</button>
                                {this.renderForm()}
                            </ReactModal>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default App;
