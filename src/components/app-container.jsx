import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Web3 from 'web3';
import AppPersonal from './app-personal';
import Disconnected from './disconnected';
import Home from './home';

export class AppContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isConnecting: true,
            isConnected: false,
            version: "MetaMask"
        };
    }
    componentDidMount() {
        this.initMetaMaskVersion();
    }
    componentWillUpdate(nextProps, nextState) {
        if(!this.state.isConnected && this.state.isConnecting){
            this.initMetaMaskVersion(this.state.version);
        }
    }
    initMetaMaskVersion() {
        let $this = this;
        this.initializeWeb3();
        this.checkNetwork().then(function (networkId) {
            $this.setState({
                isConnected: networkId.toString() === '3',
                isConnecting: false
            });
        }).catch(function (error) {
            $this.setState({
                isConnected: false,
                isConnecting: false
            });
        });
    }

    initializeWeb3() {
        if (typeof web3 !== 'undefined') {
            const defaultAccount = web3.eth.defaultAccount;
            window.web3 = new Web3(web3.currentProvider);
            window.web3.eth.defaultAccount = defaultAccount;
        }
    }
    checkNetwork() {
        return new Promise(function (resolve, reject) {
            if(typeof web3 === 'undefined'){
                reject({message: 'variable web3 is not defined'});
            }else {
                web3.version.getNetwork(function (err, netId) {
                    err ? reject(err) : resolve(netId);
                });
            }
        });
    }
    render() {
        if (this.state.isConnecting) {return null;}
        if (this.state.isConnected) {
            return(
                <Router>
                    <Switch>
                        <Route exact path='/' component={Home} />
                        <Route exact path='/t-shirt/:number' component={AppPersonal}/>
                    </Switch>
                </Router>
            );
        } else {
            return (
                <Router>
                    <Switch>
                        <Route exact path='/' component={Disconnected} />
                    </Switch>
                </Router>
            );
        }
    }
}
export default AppContainer;
