import React, {Component} from 'react';
import { Player } from 'video-react';
import $ from 'jquery';

import Gallery1 from '../images/lending/gallery/1.jpg';
import Gallery2 from '../images/lending/gallery/2.jpg';
import Gallery3 from '../images/lending/gallery/3.jpg';
import Gallery4 from '../images/lending/gallery/4.jpg';
import Gallery5 from '../images/lending/gallery/5.jpg';
import Gallery6 from '../images/lending/gallery/6.jpg';
import Gallery7 from '../images/lending/gallery/7.jpg';
import Gallery8 from '../images/lending/gallery/8.jpg';

import Bullet from '../images/lending/bullet.png';
import Icon1 from '../images/lending/icon1.png';
import Icon2 from '../images/lending/icon2.png';
import Icon3 from '../images/lending/icon3.png';
import Logo from '../images/lending/logo.png';
import LogoFix from '../images/lending/logo_fix.png';
import Proof1 from '../images/lending/proof1.svg';
import Proof2 from '../images/lending/proof2.svg';
import Proof3 from '../images/lending/proof3.svg';
import Proof4 from '../images/lending/proof4.svg';
import Proof5 from '../images/lending/proof5.svg';
import Proof6 from '../images/lending/proof6.svg';
import Proof7 from '../images/lending/proof7.svg';
import Proof8 from '../images/lending/proof8.svg';
import SmallTshirtBg from '../images/lending/small-tshirt-bg.png';
import Soc1 from '../images/lending/soc1.png';
import Soc2 from '../images/lending/soc2.png';
import Soc3 from '../images/lending/soc3.png';
import Table from '../images/lending/table.png';

import '../utils/tabulous.js';
import '../utils/woco.accordion.min.js';
import '../utils/lightbox-plus-jquery.min.js';
import '../utils/jquery.appear.js';

import '../styles/style.scss';

export class Home extends Component {

    constructor(props) {
        super(props);
    }

    _playPause(event){

    }

    componentDidMount() {

        let wow = new WOW(
            {
                boxClass:     'wow',
                animateClass: 'animated',
                offset:       0,
                mobile:       true,
                live:         true,
                callback:     function(box) {
                },
                scrollContainer: null
            }),
            $accordion = $(".accordion"),
            $tabs      = $("#tabs"),
            $body      = $("body"),
            touch      = $('#touch-menu'),
            menu       = $('.menu_top');

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

    render() {
        return (
            <div className="app">
                <div className="top_container">
                    <div className="container">
                        <div className="logo_container">
                            <a href=""><img className="logo" src={Logo} alt=""/>
                                <img className="logo_fix" src={LogoFix} alt=""/>
                            </a>
                        </div>
                        <div className="menu_container">
                            <a id="touch-menu" className="mobile-menu">&nbsp;</a>
                            <nav className="menu_top">
                                <ul>
                                    <li><a href="#header">Watch video</a></li>
                                    <li><a href="#works">About</a></li>
                                    <li><a href="#proof">Features</a></li>
                                    <li><a href="#faq">FAQ</a></li>
                                    <li>
                                        <a className="example-image-link" href={Gallery1} data-lightbox="example-set">Gallery</a>
                                        <a className="example-image-link hide" href={Gallery2} data-lightbox="example-set">&nbsp;</a>
                                        <a className="example-image-link hide" href={Gallery3} data-lightbox="example-set">&nbsp;</a>
                                        <a className="example-image-link hide" href={Gallery4} data-lightbox="example-set">&nbsp;</a>
                                        <a className="example-image-link hide" href={Gallery5} data-lightbox="example-set">&nbsp;</a>
                                        <a className="example-image-link hide" href={Gallery6} data-lightbox="example-set">&nbsp;</a>
                                        <a className="example-image-link hide" href={Gallery7} data-lightbox="example-set">&nbsp;</a>
                                        <a className="example-image-link hide" href={Gallery8} data-lightbox="example-set">&nbsp;</a>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
                <span id="behavior"></span>
                <header id="header">
                    <div className="container">
                        <div className="header_container">
                            <h1><span>BITSHIRT</span> is the first ever <br/>crypto project with a real<br/> product</h1>
                            <h5>Each t-shirt sold means the rest of them rise in value</h5>
                            <p>While others make promises, we act up to ours. Bitshirt is the first<br/>
                                ever crypto project with a real product: a limited collection of <br/>
                                amazing T-shirts that are impossible to fake up.</p>
                            <div className="header_box">
                                <p><span>0.55 <small>ETH</small></span> Current price</p>
                                <p><span>1 <small>ETH</small></span> Final price</p>
                                <p><span>450</span> T-shirt left</p>
                            </div>
                            <a href="#" data-reveal-id="buy" className="blue_btn">Buy now for 0.55 ETH</a>
                            <a href="#" className="header_video">Watch video</a>
                        </div>
                        <div className="header_img">
                            <img src={SmallTshirtBg} alt=""/>
                        </div>
                    </div>
                </header>
                <div className="header_bottom">
                    <p>
                        <img src={Icon1} alt=""/>
                        Limited collection:<br/>
                        1,000 pcs only
                    </p>
                    <p>
                        <img src={Icon2} alt=""/>
                        The first T-shirt for 0.01 ETH,<br/>
                        the last one for 1 ETH
                    </p>
                    <p>
                        <img src={Icon3} alt=""/>
                        Counterfeit-proof<br/>
                        due to the Blockchain
                    </p>
                </div>
                <section id="works">
                    <div className="container">
                        <div className="works_container">
                            <h2 className="wow fadeInUp" data-wow-delay="0.3s"><span>What</span> is it and <span>how</span> it works?</h2>
                            <div className="collum">
                                <div className="coll_2 wow fadeInUp" data-wow-delay="0.3s">
                                    <p>98% of present-day crypto projects launch without having a real product behind them. The give promises they can’t keep.</p>
                                    <p>We do vice versa. We created a truly revolutionary product employing all the good things the Blockchain technology offers.</p>
                                </div>
                                <div className="coll_2 wow fadeInUp" data-wow-delay="0.3s">
                                    <p>One stylish minimalistic Bitshirt will turn the fashion industry upside down. We guarantee that the number of T-shirts is limited and their price will rise with every purchase. </p>
                                    <p>A T-shirt can’t be faked up and our unique distribution model ensures you get what’s yours.</p>
                                </div>
                            </div>
                            <div id="tabs">
                                <ul>
                                    <li>
                                        <p>The model is simple as can be:</p>
                                    </li>
                                    <li className="wow fadeInUp" data-wow-delay="0.3s">
                                        <a href="#tabs-1" className="tabulous_active" onClick={(event) => this._playPause(event)} data-play="1" title="">
                                            <span>1</span>
                                            <small>You place an order — We save the date into the Blockchain and no one can edit it even the authors. </small>
                                        </a>
                                    </li>
                                    <li className="wow fadeInUp" data-wow-delay="0.3s">
                                        <a href="#tabs-2" onClick={(event) => this._playPause(event)} data-play="2" title="">
                                            <span>2</span>
                                            <small>You get a T-shirt with a unique QR code that you can use to check if it’s genuine.</small>
                                        </a>
                                    </li>
                                    <li className="wow fadeInUp" data-wow-delay="0.3s">
                                        <a href="#tabs-3" onClick={(event) => this._playPause(event)} data-play="3" title="">
                                            <span>3</span>
                                            <small>You can sell the T-shirt whenever you want and the right of possession will go over to the buyer according to our smart contract. However, the Blockchain will store the information forever and remember that you were the first to own the T-shirt.</small>
                                        </a>
                                    </li>
                                </ul>
                                <div id="tabs_container">
                                    <div id="tabs-1" className="showscale">
                                        <span className="tab_video">
                                            <Player
                                                id="video1"
                                                playsInline
                                                poster=""
                                                src="../media/display_animate_01.mp4"
                                                playsinline
                                                webkit-playsinline
                                                loop={true}
                                                autoPlay={true}
                                            />
                                        </span>
                                    </div>
                                    <div id="tabs-2">
                                        <span className="tab_video">
                                           <Player
                                               id="video2"
                                               playsInline
                                               poster=""
                                               src="../media/display_animate_02.mp4"
                                               playsinline
                                               webkit-playsinline
                                               loop={true}
                                               autoPlay={true}
                                           />
                                        </span>
                                    </div>
                                    <div id="tabs-3">
                                        <span className="tab_video">
                                           <Player
                                               id="video3"
                                               playsInline
                                               poster=""
                                               src="../media/display_animate_03.mp4"
                                               playsinline
                                               webkit-playsinline
                                               loop={true}
                                               autoPlay={true}
                                           />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section id="stock">
                    <div className="container">
                        <div className="stock_container">
                            <h2>Less in stock, higher price</h2>
                            <p>We created a limited collection of T-shirt that will never be restocked. It means that that the price will go unbelievably high when the T-shirts are sold out. </p>
                            <p>With every T-shirt sold its price increases by $1. Just imagine, you buy a T-shirt for $3 and within a month it takes a jump and costs $1000. Sounds juicy, right?</p>
                            <a href="#" className="blue_btn">Buy now for 0.55 ETH</a>
                        </div>
                        <div className="stock_img">
                            <img className="stock_img_t" src={Table} alt=""/>
                            <img className="stock_img_b" src={Bullet} alt=""/>
                            <div className="stock_img_c">&nbsp;</div>
                            <div className="stock_graph wow bounceIn" data-wow-delay="3s">
                                <big>0.55 <small>ETH</small></big>
                                <small>Current price</small>
                                <span>450 T-SHIRT LEFT</span>
                            </div>
                        </div>
                    </div>
                </section>
                <section id="proof">
                    <div className="container">
                        <div className="proof_container">
                            <h2><span>100% counterfeit-proof </span><br/>
                                is the future of the fashion<br/>
                                industry
                            </h2>
                            <p>Blockchain technology secures every purchase and sale<br/>
                                at all stages. A unique QR code on every single T-shirt <br/>
                                out of 1,000 opens up the information about all <br/>
                                previous owners.
                            </p>
                            <p>A product like this can’t be faked up, replicated to a<br/>
                                million copies or be a subject in other widespread <br/>
                                scams.
                            </p>
                        </div>
                        <div className="proof_video">
                            <Player
                                id="video4"
                                playsInline
                                poster=""
                                src="../media/iphone.mp4"
                                playsinline
                                webkit-playsinline
                                loop={true}
                                autoPlay={true}
                            />
                        </div>
                        <div className="proof_adv">
                            <div className="proof_adv_block wow fadeInUp" data-wow-delay="0.1s">
                                <div className="proof_adv_img">
                                    <img src={Proof1} alt=""/>
                                </div>
                                <p>BITSHIRT it’s <br/>a perfect gift</p>
                                <span>It is not just a unique thing to<br/>
                                    give, it’s going to<br/>
                                    bring profit to the owner.
                                </span>
                            </div>
                            <div className="proof_adv_block wow fadeInUp" data-wow-delay="0.2s">
                                <div className="proof_adv_img">
                                    <img src={Proof2} alt=""/>
                                </div>
                                <p>Revolutionary <br/>and catchy</p>
                                <span>A takeover in the world of<br/>
                                    fashion will start from the<br/>
                                    Bitshirt.
                                </span>
                            </div>
                            <div className="proof_adv_block wow fadeInUp" data-wow-delay="0.3s">
                                <div className="proof_adv_img">
                                    <img src={Proof3} alt=""/>
                                </div>
                                <p>
                                    Premium quality cotton<br/>
                                    produced in Nicaragua
                                </p>
                                <span>Simple design combined with<br/>
                                    high quality material.
                                </span>
                            </div>
                            <div className="proof_adv_block wow fadeInUp" data-wow-delay="0.1s">
                                <div className="proof_adv_img">
                                    <img src={Proof4} alt=""/>
                                </div>
                                <p>Any size</p>
                                <span>There are items from S to 4XL.</span>
                            </div>
                            <div className="proof_adv_block wow fadeInUp" data-wow-delay="0.2s">
                                <div className="proof_adv_img">
                                    <img src={Proof5} alt=""/>
                                </div>
                                <p>Sound liquidity</p>
                                <span>
                                    Limitedness will cause<br/>
                                    excitement around collection<br/>
                                    and will drive up the price.
                                </span>
                            </div>
                            <div className="proof_adv_block wow fadeInUp" data-wow-delay="0.3s">
                                <div className="proof_adv_img">
                                    <img src={Proof6} alt=""/>
                                </div>
                                <p>Quantity control</p>
                                <span>
                                    You always know how many <br/>
                                    T-shirts are there due to the<br/>
                                    Blockchain technology.
                                </span>
                            </div>
                            <div className="proof_adv_block wow fadeInUp" data-wow-delay="0.1s">
                                <div className="proof_adv_img">
                                    <img src={Proof7} alt=""/>
                                </div>
                                <p>Universal</p>
                                <span>
                                    A unisex-styled T-shirt will fit<br/>
                                    men and women of all ages,<br/>
                                    which is perfect for reselling.
                                </span>
                            </div>
                            <div className="proof_adv_block wow fadeInUp" data-wow-delay="0.2s">
                                <div className="proof_adv_img">
                                    <img src={Proof8} alt=""/>
                                </div>
                                <p>International delivery</p>
                                <span>
                                    We deliver our product<br/>
                                    worldwide in two days from<br/>
                                    the day of purchase.
                                </span>
                            </div>
                        </div>
                    </div>
                </section>
                <section id="chance">
                    <div className="container">
                        <div className="chance_container wow fadeIn" data-wow-delay="0.2s">
                            <h2>You <span>won’t miss the chance</span><br/>
                                to buy one of our T-shirts if<br/>
                                you’re among these people
                            </h2>
                            <p>
                                We did a nice job combining the world of new technology with a<br/>
                                material possession. The result is going to gain a great number of<br/>
                                supporters from people who...
                            </p>
                            <ul>
                                <li><span>made a fortune with cryptocurrency</span></li>
                                <li>
                                    <span>
                                        are trying to find a perfect present for a<br/>
                                        person who can buy anything himself
                                    </span>
                                </li>
                                <li><span>want to invest in a highly liquid product</span></li>
                                <li><span>live in the crypto world and know a lot<br/> about the Blockchain</span></li>
                            </ul>
                            <ul>
                                <li><span>wants to make an impact</span></li>
                                <li><span>can see promising start-ups and know their<br/> potential</span></li>
                                <li><span>follow fashion trends</span></li>
                                <li><span>value exclusive things</span></li>
                            </ul>
                        </div>
                    </div>
                </section>
                <section id="faq">
                    <div className="container">
                        <div className="faq_container">
                            <h2>FAQ</h2>
                            <div className="accordion">
                                <span className="faq_head">What if several people buy one and the same T-shirt simultaneously?</span>
                                <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</div>
                                <span className="faq_head">How can I resell my T-shirt?</span>
                                <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</div>
                                <span className="faq_head">What if somebody replicates it in China and starts selling it cheap?</span>
                                <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</div>
                                <span className="faq_head">Why haven’t major fashion brands done it yet?</span>
                                <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</div>
                                <span className="faq_head">What if I don’t like the T-shirt I bought or it comes imperfect?</span>
                                <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</div>
                                <span className="faq_head">Where can you deliver my T-shirt?</span>
                                <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</div>
                            </div>
                        </div>
                    </div>
                </section>
                <section id="time">
                    <div className="container">
                        <div className="time_container wow fadeInUp">
                            <h3>It’s time to <span>turn the fashion industry</span> and<br/> both real and crypto worlds</h3>
                            <p>
                                We created the first product of the future. World market leaders and developing<br/>
                                companies will soon take up the initiative and adopt our idea. By that time Bitshirts will<br/>
                                cost as much as bars of gold. Be among the first to start shift profitability vector in the<br/>
                                world of fashion. Choose your size and style right now, while others ponder!
                            </p>
                            <a href="#" className="blue_btn">I want one right now!</a>
                        </div>
                    </div>
                </section>
                <footer>
                    <div className="container">
                        <div className="footer_container">
                            <div className="copy">© 2018 Bitshirt.co. All rights reserved.</div>
                            <div className="footer_menu"><a href="#">Watch video</a>
                                <a href="#">Gallery</a>
                            </div>
                            <div className="social">
                                <a href="#">
                                    <img src={Soc1} alt="" />
                                </a>
                                <a href="#">
                                    <img src={Soc2} alt="" />
                                </a>
                                <a href="#">
                                    <img src={Soc3} alt="" />
                                </a>
                            </div>
                        </div>
                    </div>
                </footer>
                <div id="buy" className="reveal-modal">
                    <h4>BUYING A T-SHIRT</h4>
                    <form id="contact_form">
                        <label>SELECT SIZE</label>
                        <div id="group1">
                            <input type="radio" name="radio" id="radio1"/>
                            <label htmlFor="radio1">XS</label>

                            <input type="radio" name="radio" id="radio2"/>
                            <label htmlFor="radio2">S</label>

                            <input type="radio" name="radio" id="radio3"/>
                            <label htmlFor="radio3">m</label>

                            <input type="radio" name="radio" id="radio4"/>
                            <label htmlFor="radio4">l</label>

                            <input type="radio" name="radio" id="radio5"/>
                            <label htmlFor="radio5">xl</label>

                            <input type="radio" name="radio" id="radio6"/>
                            <label htmlFor="radio6">2xl</label>

                            <input type="radio" name="radio" id="radio7"/>
                            <label htmlFor="radio7">3xl</label>

                            <input type="radio" name="radio" id="radio8"/>
                            <label htmlFor="radio8">4xl</label>
                        </div>
                        <label>E-MAIL</label>
                        <input type="text" value="" required placeholder="Your e-mail" />
                        <label>NAME</label>
                        <input type="text" value="" required placeholder="Your name" />
                        <label>DELIVERY ADDESS</label>
                        <input type="text" value="" required placeholder="Your address" />
                        <button className="blue_btn" type="submit">Pay 0.10 ETH</button>
                        <span className="modal_comment">You pay 0.10 ETH for #100/1000 T-Shirt</span>
                    </form>
                    <a className="close-reveal-modal"></a>
                </div>
            </div>);
    }
}
export default Home;
