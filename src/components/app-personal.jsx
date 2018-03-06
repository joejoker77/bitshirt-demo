import React, {Component} from 'react';
import ReactModal from 'react-modal';
import _ from 'lodash';
import Blockchain from '../utils/blockchain';
import TransactionsStorage from '../utils/transactions-storage';
import TransactionsContainer from './transactions-container';
import * as transactionTypes from "../utils/transaction-types";
import Header from './header';
import MetaMaskAuthorizeWarning from './warnings/metamask-authorize-warning';
import BecomeMemberWarning from './warnings/become-member-warning';
import axios from "axios/index";
import Utils from "../utils/utils";
import PutSaleForm from './put-sale-form';
import FormMember from './member-form';
import Form from './buy-form';
import History from './history';
import $ from "jquery";
import SharePageForm from './share-page-form';
import Footer from './footer';

import SmallTshirt from '../images/lending/small-tshirt-wo-shadows-bg.png';

ReactModal.setAppElement('#root');

export class App extends Component {
    constructor(props) {
        super(props);
        this.initBlockchain();
        this.state = {
            showModal: false,
            modalIsOpen: false,
            productsCount: 0,
            transactions: [],
            historyProduct: [],
            currentAccountLoaded: false,
            priceInUsd: 0,
            price: 0,
            isUser: false,
            isProduct: false,
            inSale: false,
            ownerAddress: '',
            userName: '',
            userEmail:'',
            userGuestEmail: '',
            userGuestIndex: 0,
            userGuestName: '',
            size: '',
            pageShare: false,
            mailData: {},
            isParticipant: false
        };
        _.bindAll(this, [
            'handleBuyProduct',
            'handleHideTransactions',
            'handleBecomeMember',
            'handlePutSale',
            'handleOpenModal',
            'handleCloseModal',
            'handleSharePage',
            'sendMessageSharePage'
        ]);
    }
    initBlockchain() {
        this.blockchain          = new Blockchain();
        this.transactionsStorage = new TransactionsStorage(this.blockchain);
    }
    componentWillMount() {
        this.transactionsStorage.startChecker(function (type) {
            if(typeof type !== 'undefined') {
                let requestData  = {},
                    $this        = this;
                switch (type){
                    case 'PutUpInSale' :
                        this.blockchain.getCurrentPersonalProductInfo($this.props.match.params.number)
                            .then(function (data) {
                                requestData.action    = "Put in sale";
                                requestData.product   = data;
                                requestData.userEmail = $this.state.userEmail;
                                $.ajax({
                                    method: "POST",
                                    url: 'http://bitshirt.co/sendmail.php',
                                    data: requestData,
                                    success: function (data) {
                                        console.log('Server answer: ', data);
                                        window.location.reload(true);
                                    },
                                    error: function (error) {
                                        console.log(error);
                                    }
                                });
                        });break;
                    case 'ChangeOwner' :
                        this.blockchain.getOwnerProductInfo(this.state.userAddress)
                            .then(function (data) {
                                requestData.action    = "Change owner";
                                requestData.user      = data;
                                requestData.productId = $this.props.match.params.number;
                                $this.blockchain.getOwnerProductInfo($this.state.ownerAddress)
                                    .then(function (data3) {
                                        requestData.owner = data3;
                                        $this.blockchain.getCurrentPersonalProductInfo($this.props.match.params.number)
                                            .then(function (data2) {
                                                requestData.product = data2;
                                                $.ajax({
                                                    method: "POST",
                                                    url: 'http://bitshirt.co/sendmail.php',
                                                    data: requestData,
                                                    success: function (data) {
                                                        console.log('Server answer: ', data);
                                                        window.location.reload(true);
                                                    },
                                                    error: function (error) {
                                                        console.log(error);
                                                    }
                                                });
                                            });
                                    });

                            })
                        ;break;
                }
            }
            this.updateData();
        }.bind(this));
        this.updateData();
    }
    componentWillUnmount() {
        this.transactionsStorage.stopChecker();
    }

    componentDidMount(){

        let $body = $('body');

        if($body.length > 0){
            $body.addClass('second-page');
            $(window).scroll(function() {
                if ($(this).scrollTop() > 5) {
                    $body.addClass("f-nav");
                } else {
                    $body.removeClass("f-nav");
                }
            });
        }
    }

    pingApi() {
        return new Promise(function (resolve, reject) {
            axios.get('https://api.coinmarketcap.com/v1/ticker/ethereum/?convert=USD')
                .then(function (response) {
                    if (response.status) {
                        resolve(response.data);
                    }
                }).catch(function (error) {
                resolve(error);
            });
        });
    }

    updateData() {
        if(this.blockchain.address && this.blockchain.address !=="") {
            this.blockchain.checkProduct(this.props.match.params.number).then(function (isProduct) {
                this.setState({isProduct: isProduct});
            }.bind(this));

            this.blockchain.getContractBalance().then(function (balance) {
                this.setState({balance: balance});
            }.bind(this));

            this.blockchain.getCurrentPersonalAccountInfo()
                .then(function (data) {
                    this.setState({
                        isUser              : data.isUser,
                        isParticipant       : data.isParticipant,
                        userBalance         : data.userBalance,
                        userEmail           : data.userEmail,
                        userIndex           : data.userIndex,
                        userName            : Utils.capitalizeFirstLetter(data.userName),
                        userAddress         : data.userAddress,
                        currentAccountLoaded: true,
                        isWarning           : !data.isParticipant
                    });
                }.bind(this))
                .catch(function (error) {
                    console.error(error);
                });

            this.blockchain.getCurrentPersonalProductInfo(this.props.match.params.number)
                .then(function (data) {
                    this.setState({
                        productIndex: data.productIndex,
                        ownerAddress: data.ownerAddress,
                        size        : data.size,
                        price       : data.price,
                        delivery    : data.delivery,
                        inSale      : data.inSale
                    });

                    this.pingApi().then(function (data) {
                        let usdPrice = +parseFloat(data[0].price_usd * this.state.price).toFixed(2);
                        this.setState({
                            priceInUsd: usdPrice
                        });
                    }.bind(this));

                    if(this.state.ownerAddress !== this.state.userAddress) {
                        this.blockchain.getOwnerProductInfo(this.state.ownerAddress)
                            .then(function (data) {
                                this.setState({
                                    userGuestIndex: this.state.userIndex,
                                    userGuestName : this.state.userName,
                                    userGuestEmail: this.state.userEmail,
                                    userIndex     : data.userIndex,
                                    userName      : data.userName,
                                    userEmail     : data.userEmail
                                });
                            }.bind(this))
                            .catch(function (error) {
                                console.log(error);
                            });
                    }
                }.bind(this))
                .catch(function (error) {
                    console.error(error);
                });

            this.blockchain.getHistory(this.props.match.params.number)
                .then(function (data){
                    this.setState({historyProduct: data});
                }.bind(this))
                .catch(function (error) {
                    console.log(error);
                });

            this.blockchain.getProductCount().then(function (productsCount) {
                this.setState({productsCount: productsCount});
            }.bind(this));
            this.updateTransactions();
        }
    }

    handleOpenModal () {
        this.setState({ showModal: true });
    }

    handleCloseModal () {
        this.setState({ showModal: false });
    }

    handleBuyProduct(data) {

        this.handleCloseModal();
        let delivery = data.get("delivery_flat") ? data.get("delivery_address") + ' flat/office: ' + data.get("delivery_flat") :
            data.get("delivery_address");

        this.blockchain.changeOwner(
            this.props.match.params.number,
            this.state.ownerAddress,
            this.state.price,
            delivery,
            this.state.userGuestName,
            this.state.userGuestEmail
        ).then(function (txHash) {
            const tx = {
                transactionHash: txHash,
                type: transactionTypes.TYPE_CHANGE_OWNER
            };
            this.transactionsStorage.addTransaction(tx);
            this.updateTransactions();
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
                if(data.status === 200 && data.data.status === "success") {
                    let requestData = {user:{userEmail:userEmail,userName:userName},action:"Become member"};
                    $.ajax({
                        method: "POST",
                        url: 'http://bitshirt.co/sendmail.php',
                        data: requestData,
                        success: function () {
                            $("html, body").animate({ scrollTop: 0 }, "slow");
                        },
                        error: function (error) {
                            console.log(error);
                        }
                    });

                    this.setState({
                        isParticipant: true,
                        newUser      : true,
                        userName     : userName,
                        userEmail    : userEmail
                    });
                    this.updateData();
                }
            }.bind(this))
            .catch(function (error) {
                console.error(error);
            });
    }
    handlePutSale(data) {
        if(this.state.ownerAddress !== this.state.userAddress) {
            return null;
        }
        this.blockchain.changeInSale(
            this.props.match.params.number,
            data.get('price')
        ).then(function (txHash) {
            const tx = {
                transactionHash: txHash,
                type: transactionTypes.TYPE_PUT_IN_SALE
            };
            this.transactionsStorage.addTransaction(tx);
            this.updateTransactions();
        }.bind(this))
            .catch(function (error) {
                console.error('Error: ' + error);
            });
    }
    handleHideTransactions() {
        this.transactionsStorage.hidePendingTransactions();
        this.updateTransactions();
    }

    handleSharePage(){
        let mailData = {},
            $this    = this;
        mailData.action = 'Share page';
        this.blockchain.getOwnerProductInfo($this.state.userAddress)
            .then(function (data) {
                mailData.user      = data;
                mailData.productId = $this.props.match.params.number;
                $this.setState({pageShare: true});
                $this.setState({mailData: mailData});
                $this.handleOpenModal();
            });
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
            url: 'http://bitshirt.co/sendmail.php',
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

    updateTransactions() {
        this.setState({transactions: this.transactionsStorage.getPendingTransactions()});
    }

    handleCloseAlert(){
        this.setState({isWarning: false});
    }

    renderWarnings() {
        console.log(this.state);
        if(!this.state.isParticipant) {
            return <MetaMaskAuthorizeWarning  onCloseAlert={this.handleCloseAlert} />;
        }else if(!this.state.currentAccountLoaded){
            return <BecomeMemberWarning onOpenModal={this.handleOpenModal} onCloseAlert={this.handleCloseAlert} />;
        }else{
            this.setState({isWarning: false});
        }
    }

    renderPrise() {
        if (!this.state.inSale) {
            if(this.state.userAddress !== this.state.ownerAddress) {
                return <p className="current-price">
                    <span className="sh_bought">THIS T-SHIRT WAS BOUGHT FOR:</span>
                    <span className="sh_price">{this.state.price} ETH</span>
                    <span className="sh_price_usd">~ $ {this.state.priceInUsd}</span>
                    <span className="clearfix" />
                </p>
            }else{
                return <p className="current-price">
                    <span className="sh_bought">BOUGHT THIS T-SHIRT:</span>
                    <span className="sh_price">{this.state.price} ETH</span>
                    <span className="sh_price_usd">~ $ {this.state.priceInUsd}</span>
                    <span className="clearfix" />
                </p>
            }
        } else {
            if(this.state.userAddress !== this.state.ownerAddress) {
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
            }else{
                return <p className="current-price" />
            }
        }
    }

    renderPutSaleActions() {
        if(this.state.historyProduct.length === 0){
            return null;
        }

        if(!this.state.inSale) {
            if(this.state.userAddress !== this.state.ownerAddress){
                return <div>
                    <div className='danger'>The owner did not put a T-shirt for sale.</div>
                    <History historyData={this.state.historyProduct} />
                </div>
            }else{
                return <div>
                    <PutSaleForm onSendPutSale={this.handlePutSale} profit="" />
                    <History historyData={this.state.historyProduct} />
                </div>
            }
        } else {
            if(this.state.userAddress !== this.state.ownerAddress && this.state.isParticipant) {
                return <div>
                    <History historyData={this.state.historyProduct} />
                </div>
            }else if(this.state.userAddress !== this.state.ownerAddress && !this.state.isParticipant){
                return <div>
                    <div className='danger sh_sell'>You must become a member!</div>
                    <History historyData={this.state.historyProduct} />
                </div>
            }else{
                return <div>
                    <div className='danger'>You put a T-shirt on sale!</div>
                    <History historyData={this.state.historyProduct} />
                </div>
            }
        }
    }

    renderForm() {
        if (this.state.userAddress && !this.state.isParticipant) {
            return <FormMember onFormMember={this.handleBecomeMember} />
        }else{
            if(!this.state.pageShare){
                return <div className='form-buy-product'>
                    <Form
                        onBuyProduct={this.handleBuyProduct}
                        hiddenInput={true}
                        size={this.state.size}
                        price={this.state.price}
                        countProduct={this.state.productsCount}
                        priceUsd={this.state.priceInUsd}
                        owner={this.state.ownerAddress}
                        productId={this.props.match.params.number}
                    />
                </div>
            }else{
                return <div className="form-share-page">
                    <SharePageForm onFormMember={this.sendMessageSharePage} />
                </div>
            }
        }
    }

    render() {
        if (!this.state.isProduct) {
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
                                <div className="col-md-12">Error: 404 Page not found!</div>
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
                    {this.state.isWarning || this.state.transactions.length > 0 ? <div className="window-message">
                        {this.state.isWarning ? <div className="message" >
                            {this.renderWarnings()}
                        </div> : null }
                        {this.state.transactions.length > 0 ? <div className="message" >
                            <TransactionsContainer transactions={this.state.transactions} onHideTransactions={this.handleHideTransactions} />
                        </div> : null }
                    </div> : null }
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