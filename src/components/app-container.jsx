import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Web3 from 'web3';
import AppPersonal from './app-personal';
import Disconnected from './disconnected';
import DisconnectedProduct from './product-disconnected';
import Home from './home';

export class AppContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isConnecting: true,
            isConnected: false,
            otherNetwork: false
        };
    }

    componentWillMount() {
        this.initMetaMaskVersion(this.state.version);
    }

    componentWillUpdate(nextProps, nextState) {
        if (!this.state.isConnected && this.state.isConnecting) {
            this.initMetaMaskVersion(this.state.version);
        }
    }

    initMetaMaskVersion() {
        this.onPageLoadAsync()
            .then(this.initializeWeb3)
            .then(this.checkNetwork)
            .then(function (networkId) {
                this.setState({
                    isConnected: networkId.toString() === '3',
                    isConnecting: false,
                    otherNetwork: networkId.toString() !== '3'
                });
            }.bind(this))
            .catch(function () {
                this.setState({
                    isConnected: false,
                    isConnecting: false
                });
            }.bind(this));
    }

    onPageLoadAsync() {
        if (document.readyState === 'complete') {
            return Promise.resolve();
        }
        return new Promise(function (resolve, reject) {
            window.onload = resolve;
        });
    }

    initializeWeb3() {
        if (typeof web3 !== 'undefined') {
            const defaultAccount = web3.eth.defaultAccount;
            window.web3 = new Web3(web3.currentProvider);
            window.web3.eth.defaultAccount = defaultAccount;
            return Promise.resolve();
        }
    }

    checkNetwork() {
        return new Promise(function (resolve, reject) {
            web3.version.getNetwork(function (err, netId) {
                err ? reject(err) : resolve(netId);
            });
        });
    }

    render() {

        if (this.state.isConnecting) {
            return null;
        }
        if (this.state.isConnected) {
            return (
                <Router>
                    <Switch>
                        <Route exact path='/' component={Home} />
                        <Route exact path='/t-shirt/:number' component={AppPersonal} />
                    </Switch>
                </Router>
            );
        } else {
            return (
                <Router>
                    <Switch>
                        <Route exact path='/' render={() => <Disconnected otherNetwork={this.state.otherNetwork} />} />
                        <Route exact path='/t-shirt/:number' component={DisconnectedProduct} />} />
                    </Switch>
                </Router>
            );
        }
    }
}
export default AppContainer;
