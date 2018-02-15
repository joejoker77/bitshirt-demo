import React, {Component} from 'react';

export class Header extends Component {
    render() {
        const versionText = 'MetaMask';
        return (
            <nav className="navbar navbar-default navbar-static-top">
                <div className="container">
                    <div className="navbar-header">
                        <a className="navbar-brand" href="/">T-Shirt {versionText}</a>
                    </div>
                    <div className="navbar-collapse collapse">
                        {this.props.children}
                    </div>
                </div>
            </nav>
        );
    }
}
export default Header;
