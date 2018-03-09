import React, {Component} from 'react';
import ReactModal from 'react-modal';
import {isMobile} from 'react-device-detect';
import * as contract from '../contracts/TShirt.json';
import _ from 'lodash';
import Web3 from "web3";
import axios from "axios/index";

import SmallTshirtBg from '../images/lending/small-tshirt-bg.png';
import Table from '../images/lending/table.png';

import Header from './header';
import Footer from './footer';
import PreContent from './pre-content';
import StaticContent from './static-content';

import '../utils/tabulous.js';
import '../utils/woco.accordion.min.js';
import '../utils/lightbox-plus-jquery.min.js';
import '../utils/jquery.appear.js';

import '../styles/style.scss';
import ProgressBar from 'react-bootstrap/lib/ProgressBar';
import $ from "jquery";
import PropTypes from "prop-types";

class Disconnected extends Component{

    constructor(props){
        super(props);
        this.state = {
            productsCount       : 0,
            startPrice          : 0,
            startPriceInUsd     : 0,
            endPriceInUsd       : 0,
            showModal           : false,
            showAlert           : true
        };
        _.bindAll(this, [
            'handleOpenModal',
            'handleCloseModal',
            'handleCloseAlert'
        ]);
    }
    componentWillUpdate(){
        if(this.state.startPrice === 0) {
            this.updateData();
        }
    }

    componentDidMount() {
        this.updateData();
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

    updateData(){
        let $this = this;
        this.testInfura().then(function (data) {
            $this.setState({
                startPrice     : data.startPrice,
                productsCount  : data.productsCount,
                startPriceInUsd: data.startPriceInUsd,
                endPriceInUsd  : data.endPriceInUsd
            });
        }).catch(function (error) {
            // console.log(error);
        });
    }

    testInfura(){
        let $this = this;
        if(this.state.startPrice === 0){
            return new Promise(function (resolve, reject) {
                let web3         = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/7dH3Pu3mNLGa9Dvqbasp')),
                    ContractAddr = contract.address,
                    fixPrice     = web3.eth.getStorageAt(ContractAddr, 5),
                    productId    = web3.eth.getStorageAt(ContractAddr, 7);

                $this.pingApi().then(function (data2) {
                    let web3          = new Web3(),
                        minPrice      = parseFloat(web3.fromWei(parseInt(fixPrice, 16))),
                        productCount  = parseInt(productId, 16),
                        priceInUsd    = (data2[0].price_usd * (minPrice * productCount)).toFixed(2),
                        maxPriceInUsd = (data2[0].price_usd * (minPrice * 100)).toFixed(2);

                    resolve({
                        startPrice      : productCount > 0 ? parseFloat(((productCount * minPrice) + minPrice).toFixed(9)) : minPrice,
                        productsCount   : productCount,
                        startPriceInUsd : priceInUsd,
                        endPriceInUsd   : maxPriceInUsd
                    });
                });
            });
        }else{
            return this.state;
        }
    }

    handleOpenModal () {
        this.setState({showModal: true});
    }

    handleCloseModal () {
        this.setState({showModal: false});
    }
    handleCloseAlert(){
        this.setState({showAlert: false});
    }

    render(){
        return (
            <div className="app">
                <Header size="M" shareHandler={function () {
                    return null;
                }} />
                <span id="behavior" />
                <div id="header">
                    <div className="container">
                        <div className="header_container">
                            <h1><span>BITSHIRT</span> is the first ever <br/>crypto project with a real<br/> product</h1>
                            <h5>Each t-shirt sold means the rest of them rise in value</h5>
                            <p>ICOs keep making promises and the market gets flooded with<br />
                                countless virtual collectibles. We offer the other way. Bitshirt<br />
                                is the first ever crypto project with a real product: a limited<br />
                                collection of amazing T-shirts that are impossible to fake up.</p>
                            <div className="header_box">
                                <p>
                                    <span>
                                        {this.state.startPrice}&nbsp;<small>ETH</small>
                                    </span>Current price
                                </p>
                                <p><span>{1} <small>ETH</small></span> Final price</p>
                                <p><span>{100 - (this.state.productsCount)}</span> T-shirt left</p>
                            </div>
                            <a onClick={this.handleOpenModal} className="blue_btn">
                                <span>Buy now for {this.state.startPrice} ETH</span>
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
                            <a onClick={this.handleOpenModal} className="blue_btn">Buy now for {this.state.startPrice} ETH</a>
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
                                            <big>{this.state.startPrice} <small>ETH</small></big>
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
                {this.state.showAlert ? <div className="window-message">
                    <div className="message">
                        <div className="message-container danger">
                            <p>
                                {this.props.otherNetwork ?
                                    'Network not supported. Please use the Main Network' :
                                    'There is no connection to the MetaMask plugin. Install the plugin for your MetaMask browser and refresh the page.'}
                            </p>
                            <button
                                className="close-alert"
                                onClick={this.handleCloseAlert}
                            >+</button>
                        </div>
                    </div>
                </div> : null}
                <ReactModal isOpen={this.state.showModal} id="buy" className="reveal-modal" >
                    <div className="form-alert">
                        <p style={{textAlign: 'center'}}>
                            {!isMobile ?
                                this.props.otherNetwork ?
                                    "Network not supported. Please use the Main Network" :
                                    "There is no connection to the MetaMask plugin. Install the plugin for your MetaMask browser and refresh the page." :
                                "You can only purchase t-shirt on a desktop browser like Chrome, Firefox or Opera"}</p>
                    </div>
                    <a className="close-reveal-modal" onClick={this.handleCloseModal} />
                </ReactModal>
            </div>
        );
    }
}
Disconnected.propTypes = {
    otherNetwork: PropTypes.bool.isRequired
};
export default Disconnected;
