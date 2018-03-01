import React, {Component} from 'react';
import ReactModal from 'react-modal';
import _ from 'lodash';
import Web3 from "web3";
import axios from "axios/index";
import $ from 'jquery';

import SmallTshirtBg from '../images/lending/small-tshirt-bg.png';
import Table from '../images/lending/table.png';

import Header from './header';
import Form from './buy-form'
import FormMember from './member-form';
import MetaMaskAuthorizeWarning from './warnings/metamask-authorize-warning';
import BecomeMemberWarning from './warnings/become-member-warning';
import LowBalanceWarning from './warnings/low-balance-warning';
import Footer from './footer';
import PreContent from './pre-content';
import StaticContent from './static-content';
import ProductsContainer from './products-container';
import NewUserContainer from './new-user-message';

import '../utils/tabulous.js';
import '../utils/woco.accordion.min.js';
import '../utils/lightbox-plus-jquery.min.js';
import '../utils/jquery.appear.js';


import '../styles/style.scss';
import * as transactionTypes from "../utils/transaction-types";
import TransactionsStorage from "../utils/transactions-storage";
import TransactionsContainer from './transactions-container';
import Blockchain from "../utils/blockchain";
import ProgressBar from 'react-bootstrap/lib/ProgressBar';

export class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            productsCount       : '',
            startPrice          : 0,
            startPriceInUsd     : '',
            endPriceInUsd       : '',
            showModal           : false,
            modalIsOpen         : false,
            currentAccountLoaded: false,
            userAddress         : "",
            isWarning           : false,
            transactions        : [],
            products            : [],
            newUser             : false
        };
        this.initBlockchain();
        _.bindAll(this, [
            'handleOpenModal',
            'handleCloseModal',
            'handleBuyProduct',
            'handleBecomeMember',
            'handleHideTransactions',
            'handleHideNewUser'
        ]);
    }

    componentWillMount(){
        this.transactionsStorage.startChecker(function (type) {

            if(typeof type !== 'undefined') {

                let productCount = this.state.productsCount,
                    requestData  = {},
                    $this        = this;

                switch (type){
                    case 'BuyProduct':
                        requestData.action    = "Buy new product";
                        requestData.productId = productCount+1;
                        this.blockchain.getOwnerProductInfo($this.state.userAddress).then(function (data) {
                            requestData.user = data;
                            $this.blockchain.getCurrentPersonalProductInfo(productCount+1).then(function (data2) {
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
                }
            }

            this.updateData();
        }.bind(this));
        this.updateData();
    }

    initBlockchain(){
        this.blockchain          = new Blockchain();
        this.transactionsStorage = new TransactionsStorage(this.blockchain);
    }

    componentDidMount() {
        let wow = new WOW(
            {
                boxClass:     'wow',
                animateClass: 'animated',
                offset:       0,
                mobile:       true,
                live:         true,
                callback:     function(box) {},
                scrollContainer: null
            }),
            $accordion = $(".accordion"),
            $tabs      = $("#tabs"),
            $body      = $("body"),
            touch      = $('#touch-menu'),
            menu       = $('.menu_top'),
            $this      = this;

        wow.init();

        if($accordion.length > 0){
            $accordion.accordion();

            let mh = 0,
                $accordionHeader = $(".accordion-header");
            $accordionHeader.each(function () {
                let h_block = parseInt($(this).height());
                if(h_block > mh) {
                    mh = h_block;
                }
            });
            $accordionHeader.height(mh);
        }

        if($tabs.length > 0){
            $tabs.tabulous({
                effect: 'scale'
            });
        }

        if($body.length > 0){
            $(window).scroll(function() {
                if ($(this).scrollTop() > 5) {
                    $body.addClass("f-nav");
                } else {
                    $body.removeClass("f-nav");
                }
            });
        }

        $('#stock .blue_btn').appear(function () {

            $("#stock").addClass("graph_start");

            let width  = $("#stock.graph_start .stock_img_t").width();
            $("#stock.graph_start .stock_img_c").width((width / 100) * $this.state.productsCount);
            $('#stock.graph_start .progress-bar.active').css({width: ($this.state.productsCount) + '%', background: "transparent" });
            $('#stock.graph_start .stock_graph').css({
                opacity: '1',
                transform: "scale(1, 1) rotate(27.6deg)"
            });
        });

        $('.works_container').appear(function () {
            $(".works_container").addClass("start");
        });
        $('.proof_container').appear(function () {
            $(".proof_container").addClass("start");
        });
        $('.chance_container').appear(function () {
            $(".chance_container").addClass("start");
        });
        $('.time_container ').appear(function () {
            $(".time_container").addClass("start");
        });

        $('.menu_top a[href^="#"]').click(function(){
            let target = $(this).attr('href');
            $('html, body').animate({scrollTop: $(target).offset().top-50}, 800);
            return false;
        });

        $(".time_container a").click(function (d) {
            d.preventDefault();
            $("html, body").animate({ scrollTop: 0 }, "slow");
        });

        $(touch).click(function(e) {
            e.preventDefault();
            menu.slideToggle();
        });
        $(window).resize(function(){
            let w = jQuery(window).width();
            if(w > 760 && menu.is(':hidden')) {
                menu.removeAttr('style');
            }
        });
    }

    componentWillUnmount() {
        this.transactionsStorage.stopChecker();
    }

    updateData(){

        if(this.blockchain.address && this.blockchain.address !=="") {

            this.blockchain.getProductCount().then(function (productsCount) {
                this.setState({productsCount: productsCount});
            }.bind(this));

            this.blockchain.getContractBalance().then(function (balance) {
                this.setState({balance: balance});
            }.bind(this));

            this.blockchain.getCurrentAccountInfo().then(function (data) {
                this.setState({
                    userAddress         : data.address,
                    userBalance         : data.balance,
                    isUser              : data.isUser,
                    isParticipant       : data.isParticipant,
                    userName            : data.userName,
                    userEmail           : data.userEmail,
                    currentAccountLoaded: data.isParticipant,
                    isWarning           : !data.isParticipant,
                    products            : data.products
                });
            }.bind(this)).catch(function (error) {
                console.error(error);
            });

            this.blockchain.getStartPrice().then(function (startPrice) {
                let $this = this;
                this.pingApi().then(function (data) {
                    let usdPrice    = +parseFloat(web3.fromWei(data[0].price_usd * startPrice)).toFixed(2);
                    let usdEndPrice = data[0].price_usd;
                    $this.setState({
                        startPrice     : web3.fromWei(startPrice),
                        startPriceInUsd: usdPrice,
                        endPriceInUsd  : usdEndPrice
                    });
                });
            }.bind(this)).catch(function (error) {
                console.log(error);
            });
        }else{
            let $this = this;
            this.testInfura().then(function (data) {
                $this.setState({
                    startPrice          : data.startPrice,
                    productsCount       : data.productsCount,
                    startPriceInUsd     : data.startPriceInUsd,
                    endPriceInUsd       : data.endPriceInUsd,
                    currentAccountLoaded: false,
                    isWarning           : true,
                    isParticipant       : false,
                    userName            : '',
                    userEmail           : ''
                });
            }).catch(function (error) {
                console.log(error);
            })
        }
        this.updateTransactions();
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

    testInfura() {
        let $this = this;
        return new Promise(function (resolve, reject) {
            let web3         = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/7dH3Pu3mNLGa9Dvqbasp')),
                ContractAddr = "0xc1cf7f5344b2223bf2ef065ee281ad874e025085",
                fixPrice     = web3.eth.getStorageAt(ContractAddr, 5),
                productId    = web3.eth.getStorageAt(ContractAddr, 7);

            $this.pingApi().then(function (data2) {
                let web3          = new Web3(),
                    minPrice      = web3.fromWei(parseInt(fixPrice, 16)),
                    productCount  = parseInt(productId, 16),
                    priceInUsd    = (data2[0].price_usd * (minPrice * productCount)).toFixed(2),
                    maxPriceInUsd = (data2[0].price_usd * (minPrice * 100)).toFixed(2);

                resolve({
                    startPrice      : parseFloat((productCount * parseFloat(minPrice)).toFixed(9)),
                    productsCount   : productCount,
                    startPriceInUsd : priceInUsd,
                    endPriceInUsd   : maxPriceInUsd
                });
            });
        });
    }

    handleHideTransactions() {
        this.transactionsStorage.hidePendingTransactions();
        this.updateTransactions();
    }

    updateTransactions() {
        this.setState({transactions: this.transactionsStorage.getPendingTransactions()});
    }

    handleBuyProduct(data) {
        this.handleCloseModal();
        let delivery = data.get('delivery_flat') ?
            data.get('delivery_address') + ' ' + 'house/office: ' + data.get('delivery_flat') :
            data.get('delivery_address');
        this.blockchain.buyProduct(data.get('sizeValue'), delivery, this.state.startPrice, this.state.userName, this.state.userEmail)
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

    handleOpenModal () {
        this.setState({showModal: true});
    }

    handleCloseModal () {
        this.setState({showModal: false});
    }

    handleHideNewUser(){
        this.setState({newUser: false});
    }

    handleBecomeMember(data) {

        let userName  = data.get('username'),
            userEmail = data.get('email');

        this.handleCloseModal();
        this.blockchain.becomeMember(userName, userEmail)
            .then(function (data) {
                if(data.status === 200 && data.data.status === "success") {

                    let requestData = {};
                    this.blockchain.getOwnerProductInfo(this.state.userAddress)
                        .then(function (data) {
                            requestData.action    = "Become member";
                            requestData.user      = data;
                            requestData.productId = $this.props.match.params.number;
                            $.ajax({
                                method: "POST",
                                url: 'http://bitshirt.co/sendmail.php',
                                data: requestData,
                                success: function () {},
                                error: function (error) {
                                    console.log(error);
                                }
                            });
                        });

                    this.setState({
                        isParticipant: true,
                        isWarning    : false,
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

    renderForm(){
        if(this.state.userAddress === "") {
            return <div className="form-alert">
                <h4>Attention!</h4>
                <h5>You are not logged in the system!</h5>
                <p>In order to make purchases you must be authorized!</p>
                <p>Authorization:</p>
                <ol>
                    <li>Install the plugin for your MetaMask browser;</li>
                    <li>Unlock one of your wallets;</li>
                    <li>Update the application page;</li>
                    <li>Complete a simple registration;</li>
                </ol>
            </div>;
        }else if(this.state.isParticipant) {
            return <div className='form-buy-product'>
                <Form
                    onBuyProduct={this.handleBuyProduct}
                    price={this.state.startPrice}
                    poductId={this.state.productsCount + 1}
                />
            </div>;
        }else if(!this.state.currentAccountLoaded){
            return <div className='form-member'>
                <FormMember onFormMember={this.handleBecomeMember} />
            </div>;
        }
    }

    renderWarnings() {
        if(this.state.userAddress === "") {
            return <MetaMaskAuthorizeWarning />;
        }else if(this.state.userBalance < this.state.startPrice){
            return <LowBalanceWarning />;
        }else if(!this.state.currentAccountLoaded){
            return <BecomeMemberWarning onOpenModal={this.handleOpenModal} />;
        }
    }

    render() {
        return (
            <div className="app">
                <Header size="M" />
                <span id="behavior" className="hide" />
                <div id="header">
                    <div className="container">
                        <div className="header_container">
                            <h1><span>BITSHIRT</span> is the first ever <br/>crypto project with a real<br/> product</h1>
                            <h5>Each t-shirt sold means the rest of them rise in value</h5>
                            <p>While others make promises, we act up to ours. Bitshirt is the first<br/>
                                ever crypto project with a real product: a limited collection of <br/>
                                amazing T-shirts that are impossible to fake up.</p>
                            <div className="header_box">
                                <p><span>{this.state.userAddress && this.state.userAddress !== "" ? this.state.startPrice : this.state.startPrice + 0.1} <small>ETH</small></span> Current price</p>
                                <p><span>{1} <small>ETH</small></span> Final price</p>
                                <p><span>{100 - (this.state.productsCount)}</span> T-shirt left</p>
                            </div>
                            <a onClick={this.handleOpenModal} className="blue_btn">
                                <span>Buy now for {this.state.userAddress && this.state.userAddress !== "" ? this.state.startPrice : this.state.startPrice + 0.1} ETH</span>
                            </a>
                            <a href="#" className="header_video">Watch video</a>
                        </div>
                        <div className="header_img">
                            <img src={SmallTshirtBg} alt=""/>
                        </div>
                    </div>
                </div>
                <PreContent />
                <section id="stock">
                    <div className="container">
                        <div className="stock_container">
                            <h2>Less in stock, higher price</h2>
                            <p>We created a limited collection of T-shirt that will never be restocked. It means that that the price will go unbelievably high when the T-shirts are sold out. </p>
                            <p>With every T-shirt sold its price increases by $1. Just imagine, you buy a T-shirt for $3 and within a month it takes a jump and costs $100. Sounds juicy, right?</p>
                            <a onClick={this.handleOpenModal} className="blue_btn">Buy now for {this.state.userAddress && this.state.userAddress !== "" ? this.state.startPrice : this.state.startPrice + 0.1} ETH</a>
                        </div>
                        <div className="stock_img">
                            <div className="graph-wrapper" style={{display: 'table', position:'relative'}}>
                                <ProgressBar
                                    className="as-graph"
                                    active
                                    now={0}
                                    min={0}
                                    max={100}
                                    label={
                                        <div className="stock_graph">
                                            <big>{this.state.userAddress && this.state.userAddress !== "" ? this.state.startPrice : this.state.startPrice + 0.1} <small>ETH</small></big>
                                            <small>Current price</small>
                                            <span>{100 - this.state.productsCount} T-SHIRT LEFT</span>
                                        </div>
                                    } />
                                <img className="stock_img_t" src={Table} alt=""/>
                                <div className="stock_img_c" />
                            </div>
                        </div>
                    </div>
                </section>
                <StaticContent />
                <Footer />
                {this.state.isWarning || this.state.products.length > 0 || this.state.newUser || this.state.transactions.length > 0 ? <div className="window-message">
                    {this.state.isWarning ? <div className="message" >
                        {this.renderWarnings()}
                    </div> : null }
                    {this.state.newUser ? <div className="message" >
                        <NewUserContainer userName={this.state.userName} userEmail={this.state.userEmail} onHideNewUser={this.handleHideNewUser} />
                    </div> : null }
                    {this.state.transactions.length > 0 ? <div className="message" >
                        <TransactionsContainer transactions={this.state.transactions} onHideTransactions={this.handleHideTransactions} />
                    </div> : null }
                    {this.state.products.length > 0 ? <div className="message">
                        <ProductsContainer products={this.state.products} />
                    </div> : null }
                </div> : null }
                <ReactModal isOpen={this.state.showModal} id="buy" className="reveal-modal" >
                    {this.renderForm()}
                    <a className="close-reveal-modal" onClick={this.handleCloseModal} />
                </ReactModal>
            </div>);
    }
}
export default Home;
