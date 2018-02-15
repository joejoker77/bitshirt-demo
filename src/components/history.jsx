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
    // componentWillUpdate() {
    //     if(this.state.history.length === 0){
    //         this.formatHistory();
    //     }
    // }
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
        return(<div className="ownership-history">
            <h4>Ownership history</h4>
            <table className="table strip">
                <thead>
                    <tr>
                        <th>Owner</th>
                        <th>Date of purchase</th>
                        <th>Cost</th>
                    </tr>
                </thead>
                <tbody>
                {Array.prototype.map.call(this.state.history, function (val, index) {
                    return (<tr key={index}>{
                        Array.prototype.map.call(val, function (value, indx) {
                            return(<td key={indx}>{value}</td>)
                        })
                    }</tr>)
                })}
                </tbody>
            </table>
        </div>)
    }
}
History.propTypes = {
    historyData: PropTypes.object
};
export default History;


