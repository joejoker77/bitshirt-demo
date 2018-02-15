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
import axios from "axios/index";
import Utils from "../utils/utils";
import PutSaleForm from './put-sale-form';
import FormMember from './member-form';
import Form from './buy-form';
import History from './history';
import {DropdownButton} from 'react-bootstrap';
import $ from "jquery";
import SharePageForm from './share-page-form';
import {FacebookShareButton,GooglePlusShareButton,LinkedinShareButton,TwitterShareButton,
    TelegramShareButton,WhatsappShareButton,PinterestShareButton,RedditShareButton,TumblrShareButton,EmailShareButton
} from 'react-share';
import {FacebookIcon,TwitterIcon,GooglePlusIcon,LinkedinIcon,PinterestIcon,TelegramIcon,WhatsappIcon,
    RedditIcon,TumblrIcon,EmailIcon} from 'react-share';

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
                    if (response.status) {
                        resolve(response.data);
                    }
                }).catch(function (error) {
                resolve(error);
            });
        });
    }
    updateData() {

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

    handleOpenModal () {
        this.setState({ showModal: true });
    }

    handleCloseModal () {
        this.setState({ showModal: false });
    }

    handleBuyProduct(data) {

        console.log(this.state);

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

    renderWarnings() {
        if (!this.state.currentAccountLoaded) {return null;}
        if (!this.state.userAddress) {
            return <MetaMaskAuthorizeWarning/>;
        } else if (this.state.userBalance < this.state.price) {
            return <LowBalanceWarning />;
        } else if (this.state.userAddress && !this.state.isParticipant) {
            return <BecomeMemberWarning onOpenModal={this.handleOpenModal} />;
        }
    }

    renderPrise() {
        if (!this.state.inSale) {
            if(this.state.userAddress !== this.state.ownerAddress){
                return <p className="current-price">
                    This T-shirt was bought for:&nbsp;
                    {this.state.price} <b>Eth</b> (~{this.state.priceInUsd} <b>$</b>)
                </p>
            }else{
                return <p className="current-price">
                    You bought this t-shirt for:&nbsp;
                    {this.state.price} <b>Eth</b> (~{this.state.priceInUsd} <b>$</b>)
                </p>
            }
        } else {
            return <p className="current-price">
                This t-shirt is for sale for:&nbsp;
                {this.state.price} <b>Eth</b> (~{this.state.priceInUsd} <b>$</b>)
            </p>
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
                    <button
                        style={{float: "right"}}
                        className="btn btn-primary btn-lg"
                        onClick={this.handleOpenModal}
                    >Order now!</button>
                </div>
            }else if(this.state.userAddress !== this.state.ownerAddress && !this.state.isParticipant){
                return <div>
                    <div className='danger'>You must become a member!</div>
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
                    <SharePageForm onFormMember={this.sendMessageSharePage}/>
                </div>
            }
        }
    }

    render() {
        if (!this.state.isProduct) {
            return (
                <div className="app">
                    <Header>
                        <HeaderAccount address={this.state.userAddress} balance={this.state.userBalance} />
                        <HeaderBalance balance={this.state.balance} />
                    </Header>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">Error: 404 Page not found!</div>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="app">
                    <Header>
                        <HeaderAccount address={this.state.userAddress} balance={this.state.userBalance} />
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
                                <TransactionsContainer
                                    transactions={this.state.transactions}
                                    onHideTransactions={this.handleHideTransactions} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-4">
                                <img src={img} width="100%" height="auto"/>
                            </div>
                            <div className="col-md-8">
                                <div className="app-title">
                                    <h1>
                                        {Utils.capitalizeFirstLetter(this.state.userName)}'s t-shirt Size: {this.state.size}
                                        <div className="social">
                                            <DropdownButton key={1} title={""} id={`dropdown-basic-${1}`} noCaret pullRight >
                                                <div className="facebook share-button">
                                                    <div className="Demo__some-network">
                                                        <FacebookShareButton
                                                            url={"http://bitshirt.co/t-shirt/" + this.props.match.params.number}
                                                            quote={Utils.capitalizeFirstLetter(this.state.userName) + 's t-shirt Size: ' + this.state.size}
                                                            className="Demo__some-network__share-button">
                                                            <FacebookIcon  size={32} round />
                                                        </FacebookShareButton>
                                                    </div>
                                                </div>
                                                <div className="twitter share-button">
                                                    <div className="Demo__some-network">
                                                        <TwitterShareButton
                                                            url={"/t-shirt/" + this.props.match.params.number}
                                                            title={Utils.capitalizeFirstLetter(this.state.userName) + 's t-shirt Size: ' + this.state.size}
                                                            className="Demo__some-network__share-button">
                                                            <TwitterIcon size={32} round />
                                                        </TwitterShareButton>
                                                    </div>
                                                </div>
                                                <div className="telegram share-button">
                                                    <div className="Demo__some-network">
                                                        <TelegramShareButton
                                                            url={"/t-shirt/" + this.props.match.params.number}
                                                            title={Utils.capitalizeFirstLetter(this.state.userName) + 's t-shirt Size: ' + this.state.size}
                                                            className="Demo__some-network__share-button">
                                                            <TelegramIcon size={32} round />
                                                        </TelegramShareButton>
                                                    </div>
                                                </div>
                                                <div className="whatsaap share-button">
                                                    <div className="Demo__some-network">
                                                        <WhatsappShareButton
                                                            url={"/t-shirt/" + this.props.match.params.number}
                                                            title={Utils.capitalizeFirstLetter(this.state.userName) + 's t-shirt Size: ' + this.state.size}
                                                            separator=":: "
                                                            className="Demo__some-network__share-button">
                                                            <WhatsappIcon size={32} round />
                                                        </WhatsappShareButton>
                                                    </div>
                                                </div>
                                                <div className="google-plus share-button">
                                                    <div className="Demo__some-network">
                                                        <GooglePlusShareButton
                                                            url={"http://bitshirt.co/t-shirt/" + this.props.match.params.number}
                                                            className="Demo__some-network__share-button">
                                                            <GooglePlusIcon size={32} round />
                                                        </GooglePlusShareButton>
                                                    </div>
                                                </div>
                                                <div className="linkedin share-button">
                                                    <div className="Demo__some-network">
                                                        <LinkedinShareButton
                                                            url={"http://bitshirt.co/t-shirt/" + this.props.match.params.number}
                                                            title={Utils.capitalizeFirstLetter(this.state.userName) + 's t-shirt Size: ' + this.state.size}
                                                            windowWidth={750}
                                                            windowHeight={600}
                                                            className="Demo__some-network__share-button">
                                                            <LinkedinIcon size={32} round />
                                                        </LinkedinShareButton>
                                                    </div>
                                                </div>
                                                <div className="pinterest share-button">
                                                    <div className="Demo__some-network">
                                                        <PinterestShareButton
                                                            url={String(window.location)}
                                                            media={`${String(window.location)}/${<img src={img} width="100%" height="auto"/>}`}
                                                            windowWidth={1000}
                                                            windowHeight={730}
                                                            className="Demo__some-network__share-button">
                                                            <PinterestIcon size={32} round />
                                                        </PinterestShareButton>
                                                    </div>
                                                </div>
                                                <div className="reddit share-button">
                                                    <div className="Demo__some-network">
                                                        <RedditShareButton
                                                            url={"http://bitshirt.co/t-shirt/" + this.props.match.params.number}
                                                            title={Utils.capitalizeFirstLetter(this.state.userName) + 's t-shirt Size: ' + this.state.size}
                                                            windowWidth={660}
                                                            windowHeight={460}
                                                            className="Demo__some-network__share-button">
                                                            <RedditIcon size={32} round />
                                                        </RedditShareButton>
                                                    </div>
                                                </div>
                                                <div className="tumblr share-button">
                                                    <div className="Demo__some-network">
                                                        <TumblrShareButton
                                                            url={"http://bitshirt.co/t-shirt/" + this.props.match.params.number}
                                                            title={Utils.capitalizeFirstLetter(this.state.userName) + 's t-shirt Size: ' + this.state.size}
                                                            windowWidth={660}
                                                            windowHeight={460}
                                                            className="Demo__some-network__share-button">
                                                            <TumblrIcon size={32} round />
                                                        </TumblrShareButton>
                                                    </div>
                                                </div>
                                                <div className="email share-button">
                                                    <div className="Demo__some-network">
                                                        <EmailShareButton
                                                            url={"http://bitshirt.co/sendmail.php"}
                                                            subject={"Share page: " +
                                                            Utils.capitalizeFirstLetter(this.state.userName) +
                                                            's t-shirt Size: ' + this.state.size
                                                            }
                                                            className="Demo__some-network__share-button"
                                                            onClick={this.handleSharePage}
                                                        >
                                                            <EmailIcon size={32} round />
                                                        </EmailShareButton>
                                                    </div>
                                                </div>
                                            </DropdownButton>
                                        </div>
                                    </h1>
                                </div>
                                <div className="app-desc">
                                    <p>The product is genuine</p>
                                    <h2># {this.props.match.params.number}</h2>
                                </div>
                                <div className="row">
                                    <div className="col-md-12">{this.renderPrise()}</div>
                                </div>
                                {this.renderPutSaleActions()}
                            </div>
                        </div>
                        <ReactModal id={1} key={1}
                            isOpen={this.state.showModal} style={customStyles}>
                            <button className="close-modal" onClick={this.handleCloseModal}>+</button>
                            {this.renderForm()}
                        </ReactModal>
                    </div>
                </div>
            );
        }
    }
}
export default App;