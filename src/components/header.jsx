import React, {Component} from 'react';
import Gallery1 from '../images/lending/gallery/1.jpg';
import Gallery2 from '../images/lending/gallery/2.jpg';
import Gallery3 from '../images/lending/gallery/3.jpg';
import Gallery4 from '../images/lending/gallery/4.jpg';
import Gallery5 from '../images/lending/gallery/5.jpg';
import Gallery6 from '../images/lending/gallery/6.jpg';
import Gallery7 from '../images/lending/gallery/7.jpg';
import Logo from '../images/lending/logo.png';
import Logo2 from '../images/lending/logo2.png';
import LogoFix from '../images/lending/logo_fix.png';
import PropTypes from "prop-types";
import Utils from "../utils/utils";

import {DropdownButton} from 'react-bootstrap';
import {FacebookShareButton,GooglePlusShareButton,LinkedinShareButton,TwitterShareButton,
    TelegramShareButton,WhatsappShareButton,PinterestShareButton,RedditShareButton,TumblrShareButton,EmailShareButton
} from 'react-share';
import {FacebookIcon,TwitterIcon,GooglePlusIcon,LinkedinIcon,PinterestIcon,TelegramIcon,WhatsappIcon,
    RedditIcon,TumblrIcon,EmailIcon} from 'react-share';

import SmallTshirt from '../images/lending/small-tshirt-wo-shadows-bg.png';

export class Header extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const versionText = 'MetaMask';
        return (
            <div className="top_container">
                <div className="container">
                    <div className="logo_container">
                        <a href="/"><img className="logo" src={this.props.secondPage ? Logo2 : Logo} alt="" />
                            <img className="logo_fix" src={LogoFix} alt=""/>
                        </a>
                    </div>
                    {this.props.secondPage ? <div className="btn_container">
                        <div className="social share_btn">
                            <DropdownButton key={1} title={"Share!"} id={`dropdown-basic-${1}`} noCaret pullRight >
                                <div className="facebook share-button">
                                    <div className="Demo__some-network">
                                        <FacebookShareButton
                                            url={"https://bitshirt.co/t-shirt/" + this.props.number}
                                            quote={<p>Check my T-shirt out!<br/> Unique number – {this.props.number}. Size: {this.props.size}</p>}
                                            className="Demo__some-network__share-button">
                                            <FacebookIcon  size={32} round />
                                        </FacebookShareButton>
                                    </div>
                                </div>
                                <div className="twitter share-button">
                                    <div className="Demo__some-network">
                                        <TwitterShareButton
                                            url={"https://bitshirt.co/t-shirt/" + this.props.number}
                                            title={<p>Check my T-shirt out!<br/> Unique number – {this.props.number}. Size: {this.props.size}</p>}
                                            className="Demo__some-network__share-button">
                                            <TwitterIcon size={32} round />
                                        </TwitterShareButton>
                                    </div>
                                </div>
                                <div className="telegram share-button">
                                    <div className="Demo__some-network">
                                        <TelegramShareButton
                                            url={"https://bitshirt.co/t-shirt/" + this.props.number}
                                            title={<p>Check my T-shirt out!<br/> Unique number – {this.props.number}. Size: {this.props.size}</p>}
                                            className="Demo__some-network__share-button">
                                            <TelegramIcon size={32} round />
                                        </TelegramShareButton>
                                    </div>
                                </div>
                                <div className="whatsaap share-button">
                                    <div className="Demo__some-network">
                                        <WhatsappShareButton
                                            url={"https://bitshirt.co/t-shirt/" + this.props.number}
                                            title={<p>Check my T-shirt out!<br/> Unique number – {this.props.number}. Size: {this.props.size}</p>}
                                            separator=":: "
                                            className="Demo__some-network__share-button">
                                            <WhatsappIcon size={32} round />
                                        </WhatsappShareButton>
                                    </div>
                                </div>
                                <div className="google-plus share-button">
                                    <div className="Demo__some-network">
                                        <GooglePlusShareButton
                                            url={"https://bitshirt.co/t-shirt/" + this.props.number}
                                            className="Demo__some-network__share-button">
                                            <GooglePlusIcon size={32} round />
                                        </GooglePlusShareButton>
                                    </div>
                                </div>
                                <div className="linkedin share-button">
                                    <div className="Demo__some-network">
                                        <LinkedinShareButton
                                            url={"https://bitshirt.co/t-shirt/" + this.props.number}
                                            title={<p>Check my T-shirt out!<br/> Unique number – {this.props.number}. Size: {this.props.size}</p>}
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
                                            media={`${String(window.location)}/${<img src={SmallTshirt} width="100%" height="auto"/>}`}
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
                                            url={"https://bitshirt.co/t-shirt/" + this.props.number}
                                            title={<p>Check my T-shirt out!<br/> Unique number – {this.props.number}. Size: {this.props.size}</p>}
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
                                            url={"https://bitshirt.co/t-shirt/" + this.props.number}
                                            title={<p>Check my T-shirt out!<br/> Unique number – {this.props.number}. Size: {this.props.size}</p>}
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
                                            url={"https://bitshirt.co/sendmail.php"}
                                            subject={"Share page: " +
                                            Utils.capitalizeFirstLetter(this.props.userName) + 's t-shirt Size: ' + this.props.size}
                                            className="Demo__some-network__share-button"
                                            onClick={this.props.shareHandler}
                                        >
                                            <EmailIcon size={32} round />
                                        </EmailShareButton>
                                    </div>
                                </div>
                            </DropdownButton>
                        </div>
                    </div> : null}
                    <div className="menu_container">
                        <a id="touch-menu" className="mobile-menu" />
                        <nav className="menu_top">
                            <ul>
                                <li><a href="#header">Watch video</a></li>
                                <li><a href="#works">About</a></li>
                                <li><a href="#proof">Features</a></li>
                                <li><a href="#faq">FAQ</a></li>
                                <li>
                                    <a className="example-image-link" href={Gallery1} data-lightbox="example-set">Gallery</a>
                                    <a className="example-image-link hide" href={Gallery4} data-lightbox="example-set">&nbsp;</a>
                                    <a className="example-image-link hide" href={Gallery6} data-lightbox="example-set">&nbsp;</a>
                                    <a className="example-image-link hide" href={Gallery7} data-lightbox="example-set">&nbsp;</a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        );
    }
}
Header.propTypes = {
    secondPage  : PropTypes.bool,
    size        : PropTypes.string,
    userName    : PropTypes.string,
    number      : PropTypes.number,
    shareHandler: PropTypes.func.isRequired
};
export default Header;
