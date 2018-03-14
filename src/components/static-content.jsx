import React, {Component} from 'react';
import PropTypes from "prop-types";

import Proof1 from '../images/lending/proof1.png';
import Proof2 from '../images/lending/proof2.png';
import Proof3 from '../images/lending/proof3.png';
import Proof4 from '../images/lending/proof4.png';
import Proof5 from '../images/lending/proof5.png';
import Proof6 from '../images/lending/proof6.png';
import Proof7 from '../images/lending/proof7.png';
import Proof8 from '../images/lending/proof8.png';

export class StaticContent extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div style={{width:"100%", overflow: "hidden"}}>
                <section id="proof">
                    <div className="container">
                        <div className="proof_container">
                            <h2><span>100% counterfeit-proof </span><br/>
                                is the future of the fashion<br/>
                                industry
                            </h2>
                            <p>Blockchain technology secures every purchase and<br />
                                sale at all stages. A unique QR code on every single<br />
                                T-shirt out of 100 opens up the information about<br />
                                all previous owners.
                            </p>
                            <p>A product like this can’t be faked up, replicated to a<br/>
                                million copies or be a subject in other widespread <br/>
                                scams.
                            </p>
                        </div>
                        <div className="proof_video">
                            <video
                                width="100%"
                                height={450}
                                id="video4"
                                className="video-react-video"
                                preload="true"
                                autoPlay={true}
                                muted={true}
                                playsInline={true}
                                loop={true} src="../media/iphone.mp4" />
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
                                <li><span>can see promising start-ups<br />and know their potential</span></li>
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
                                <span className="faq_head">What do I need to buy a T-shirt?</span>
                                <div>Here’s what you need to get started:
                                    <ol>
                                        <li>A computer or laptop running the desktop version of Chrome, Firefox or Opera</li>
                                        <li>MetaMask, a digital wallet used specifically with web apps</li>
                                        <li>Ether, the cryptocurrency used to buy T-shirt</li>
                                    </ol>
                                    If you have any questions, please don’t hesitate to contact us. </div>
                                <span className="faq_head">What if several people buy one and the same T-shirt simultaneously?</span>
                                <div>It’s impossible to buy one and the same T-shirt. The payment made first is considered the purchase. All the others get their money back automatically due to the smart contract.</div>
                                <span className="faq_head">How can I resell my T-shirt?</span>
                                <div>After successful purchase, a web page is created from where it is possible to resell the T-shirt.</div>
                                <span className="faq_head">When a public catalogue of T-shirts will be available?</span>
                                <div>We will launch as soon as all the 100 T-shirts are sold.  Until then the resell function is performed from the webpage of your purchased T-shirt.</div>
                                <span className="faq_head">What if somebody replicates it and starts selling it cheap?</span>
                                <div>It is impossible due to unique QR-codes. All operations with every T-shirt will be saved into the Blockchain.</div>
                                <span className="faq_head">Why haven’t major fashion brands done it yet?</span>
                                <div>Large companies are not easy to adopt new technologies and integrate them into their efficient process. Our success is going to be the first step on the way to the new era in the fashion industry.</div>
                                <span className="faq_head">What if I don’t like the T-shirt I bought or it comes imperfect?</span>
                                <div>You can return your T-shirt within 30 days after the purchase.</div>
                                <span className="faq_head">Where can you deliver my T-shirt? How long does it take?</span>
                                <div>We submit your T-shirt to worldwide express delivery services immediately after purchase and provide you with a tracking number.</div>
                                <span className="faq_head">Is it some kind of scam?</span>
                                <div>No, this is a real project we have dedicated months of work to. Our system is transparent and every action is validated thanks to the blockchain technology and open source.</div>
                                <span className="faq_head">How do I reach you regarding a project, partnership or question?</span>
                                <div>Please feel free to contact us via email: team@bitshirt.co</div>
                            </div>
                        </div>
                    </div>
                </section>
                <section id="time">
                    <div className="container">
                        <div className="time_container wow fadeInUp">
                            <h3>It’s time to <span>turn the fashion industry</span> and<br/> both real and crypto worlds</h3>
                            <p>We created the first concept of truly impossible to fabricate clothing. World market leaders and developing companies will soon take up the initiative and adopt our idea. Be among the first, while others ponder!</p>
                            <a className="blue_btn">I want one right now!</a>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}
StaticContent.propTypes = {
    size      : PropTypes.string,
    userName  : PropTypes.string,
    number    : PropTypes.number
};
export default StaticContent;
