import React, {Component} from 'react';
import Icon1 from '../images/lending/icon1.png';
import Icon2 from '../images/lending/icon2.png';
import Icon3 from '../images/lending/icon3.png';

export class PreContent extends Component {

    _playPause(event){
        let videoBlockId = 'video' + event.target.parentElement.dataset.play,
            video        = document.getElementById(videoBlockId);
        video.play();
    }

    render() {
        return (
            <div>
                <div className="header_bottom">
                    <p>
                        <img src={Icon1} alt=""/>
                        Limited collection:<br/>
                        100 pcs only
                    </p>
                    <p>
                        <img src={Icon2} alt=""/>
                        The first T-shirt for 0.1 ETH,<br/>
                        the last one for 10 ETH
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
                                            <video width="368px" id="video1" autoPlay={true} muted={true} playsInline={true} loop={true} src="../media/display_animate_01.mp4" />
                                        </span>
                                    </div>
                                    <div id="tabs-2">
                                        <span className="tab_video">
                                           <video width="368px" id="video2" autoPlay={true} muted={true} playsInline={true} loop={true} src="../media/display_animate_02.mp4" />
                                        </span>
                                    </div>
                                    <div id="tabs-3">
                                        <span className="tab_video">
                                            <video width="368px" id="video3" autoPlay={true} muted={true} playsInline={true} loop={true} src="../media/display_animate_03.mp4" />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}
export default PreContent;
