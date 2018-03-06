import React, {Component} from 'react';
import _ from 'lodash';
import Blockchain from '../utils/blockchain';
import PropTypes from "prop-types";

class History extends Component {

    constructor(props) {

        super(props);
        this.initBlockchain();
        this.state = {history: []};

        _.bindAll(this, [
            'formatHistory'
        ])
    }
    initBlockchain() {
        this.blockchain = new Blockchain();
    }
    componentWillMount() {
        this.formatHistory();
    }
    formatHistory() {
        let objectHistory = this.props.historyData,
            $this         = this;
        this.blockchain.getHistoryProductData(objectHistory)
            .then(function (answer) {
                $this.setState({history: answer});
            }).catch(function (error) {
                console.log(error);
            })
    }
    render() {
        return(<div className="sh_table">
            <span className="sh_table_name">OWNERSHIP HISTORY:</span>
            <span className="sh_coll coll_numb">
                <big>#</big>
                {Array.prototype.map.call(this.state.history, function (val, index) {
                    return (<small key={index}>{index + 1}</small>)
                })}
            </span>
            <span className="sh_coll coll_owner">
                <big>Owner</big>
                {Array.prototype.map.call(this.state.history, function (val, index) {
                    return (<small key={index}>{
                        Array.prototype.map.call(val, function (value, indx) {
                            return( indx === 0 ? <td key={indx}>{value}</td> : null)
                        })
                    }</small>)
                })}
            </span>
            <span className="sh_coll coll_date">
                <big>Date of purchase</big>
                {Array.prototype.map.call(this.state.history, function (val, index) {
                    return (<small key={index}>{
                        Array.prototype.map.call(val, function (value, indx) {
                            return( indx === 1 ? <td key={indx}>{value}</td> : null)
                        })
                    }</small>)
                })}
            </span>
            <span className="sh_coll coll_cost">
                <big>Cost</big>
                {Array.prototype.map.call(this.state.history, function (val, index) {
                    return (<small key={index}>{
                        Array.prototype.map.call(val, function (value, indx) {
                            return( indx === 2 ? <td key={indx}>{value}</td> : null)
                        })
                    }</small>)
                })}
            </span>
        </div>)
    }
}
History.propTypes = {
    historyData: PropTypes.object
};
export default History;


