import React, {Component} from 'react';
import PropTypes from "prop-types";

import Gallery8 from '../images/lending/gallery/8.jpg';
import Soc1 from '../images/lending/soc1.png';
import Soc2 from '../images/lending/soc2.png';
import Soc3 from '../images/lending/soc3.png';

export class Footer extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <footer>
                <div className="container">
                    <div className="footer_container">
                        <div className="copy">© 2018 bitshirt.co. All rights reserved.</div>
                        <div className="footer_menu">
                            <a href="#">Watch video</a>
                            <a className="example-image-link" href={Gallery8} data-lightbox="example-set">Gallery</a>
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
        );
    }
}
Footer.propTypes = {
    size      : PropTypes.string,
    userName  : PropTypes.string,
    number    : PropTypes.number
};
export default Footer;
