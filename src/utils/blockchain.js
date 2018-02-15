import axios from "axios/index";

import * as transactionStates from './transaction-states';
import * as contract from '../contracts/TShirt.json';
import Utils from './utils';
import sigUtil from 'eth-sig-util';

export function Blockchain() {
    const MyContract      = web3.eth.contract(contract.abi);
    this.contractInstance = MyContract.at(contract.address);
    this.address          = web3.eth.coinbase;

}

Blockchain.prototype.becomeMember = function (userName, userEmail) {

    let address = this.address;
    return new Promise(function (resolve, reject) {
        const msgParams = [
            {
                type: 'bytes32',
                name: 'userName',
                value: userName
            },
            {
                type: 'bytes32',
                name: 'userEmail',
                value: userEmail
            }
        ];
        web3.eth.getAccounts(function (err, accounts) {
            if (!accounts) return;
            signMsg(msgParams, accounts[0]);
        });
        function signMsg(msgParams, from) {
            web3.currentProvider.sendAsync({
                method: 'eth_signTypedData',
                params: [msgParams, from],
                from: from,
            }, function (err, result) {
                if (err) return console.error(err);
                if (result.error) {
                    reject({error: result.error.message});
                }
                const recovered = sigUtil.recoverTypedSignature({
                    data: msgParams,
                    sig: result.result
                });
                if(recovered === from) {
                    axios.post("http://bitshirt.co/db.php", {
                        method   : "register",
                        userName : userName,
                        userEmail: userEmail,
                        address  : address,
                        sign     : result.result
                    }).then(function (data) {
                        resolve(data);
                    }).catch(function (data) {
                        reject(data);
                    })
                }else{
                    reject({error: "Not verify sign"});
                }
            })
        }
    }.bind(this));
};

Blockchain.prototype.checkProduct = function (productId) {
    productId = Utils.stringToBytes32(Number(productId).toString(16), true);
    productId = Number(productId).toString(16);
    return new Promise(function (resolve, reject) {
        this.contractInstance.isProduct(Utils.stringToBytes32(productId, true), function (err, res) {
            err ? reject(err) : resolve(res);
        });
    }.bind(this));
};

Blockchain.prototype.changeInSale = function (productId, price) {

    const address = this.address,
        userId = Utils.addressToProductId(address);

    price     = web3.toWei(price);
    productId = Utils.stringToBytes32(Number(productId).toString(16), true);

    return new Promise(function (resolve, reject) {
        this.contractInstance.changeInSale(productId, userId, price, {value: 0, gas: 1000000}, function (err, res) {
            err ? reject(err) : resolve(res);
        });
    }.bind(this));
};

Blockchain.prototype.changeOwner = function (productId, oldOwner, price, delivery, userName, userEmail) {

    let addressOldOwner = oldOwner,
        newOwner        = Utils.addressToProductId(this.address);

    oldOwner  = Utils.addressToProductId(oldOwner);
    productId = Utils.stringToBytes32(Number(productId).toString(16), true);
    price     = web3.toWei(price);

    return new Promise(function(resolve, reject) {
        this.contractInstance.changeOwner(
            productId,
            oldOwner,
            newOwner,
            addressOldOwner,
            delivery,
            userName,
            userEmail,
            {value: price, gas: 1000000},
            function(err, res) {
                err ? reject(err) : resolve(res);
            });
    }.bind(this));
};

Blockchain.prototype.getProductCount = function () {
    return new Promise(function (resolve, reject) {
        this.contractInstance.getProductCount(function (err, res) {
            err ? reject(err) : resolve(res.toNumber());
        });
    }.bind(this));
};

Blockchain.prototype.getContractBalance = function () {
    return new Promise(function (resolve, reject) {
        web3.eth.getBalance(this.contractInstance.address, function (err, res) {
            err ? reject(err) : resolve(web3.fromWei(res).toNumber());
        });
    }.bind(this));
};

Blockchain.prototype.getCurrentAccountInfo = function () {

    const address = this.address;

    if (typeof address === 'undefined' || !address) {
        return Promise.resolve({});
    }

    const balancePromise = new Promise(function (resolve, reject) {
        web3.eth.getBalance(address, function (err, res) {
            err ? reject(err) : resolve(web3.fromWei(res).toNumber());
        });
    });

    const authorizedPromise = new Promise(function (resolve, reject) {
        this.contractInstance.isUser(Utils.addressToProductId(address), function (err, res) {
            err ? reject(err) : resolve(res);
        });
    }.bind(this));

    const checkIsParticipant = axios.post("http://bitshirt.co/db.php", {
        method: "check",
        userAddress: address
    });

    const userProductsPromise = new Promise(function (resolve, reject) {
        this.contractInstance.getUserProductsKeys(Utils.addressToProductId(address), function (err, res) {
            err ? reject(err) : resolve(res);
        })
    }.bind(this));

    return new Promise(function (resolve, reject) {
        Promise.all([balancePromise, authorizedPromise, userProductsPromise, checkIsParticipant]).then(function (data) {

            let resolv = {};
            if(Object.keys(data[3]).length > 0) {
                if(data[3].status === 200 && data[3].data.message === "user is register"){
                    resolv.isParticipant = true;
                    resolv.userEmail = data[3].data.userEmail;
                    resolv.userName  = data[3].data.userName;

                }
            }

            if(data[2].length > 0){
                for (let i = 0; i < data[2].length; i++){
                    data[2][i] = parseInt(data[2][i].toString(), 16);
                }
            }

            resolv.address  = address;
            resolv.balance  = data[0];
            resolv.isUser   = data[1];
            resolv.products = data[2];

            resolve(resolv);
        });
    });
};

Blockchain.prototype.getCurrentPersonalAccountInfo = function () {

    const address = this.address,
        userId = Utils.addressToProductId(address);

    if (typeof address === 'undefined' || !address) {
        return Promise.resolve({});
    }
    const userPromise = new Promise(function (resolve, reject) {
        this.contractInstance.userStructs(userId, function (err, res) {
            err ? reject(err) : resolve(res);
        });
    }.bind(this));
    const balancePromise = new Promise(function (resolve, reject) {
        web3.eth.getBalance(address, function (err, res) {
            err ? reject(err) : resolve(web3.fromWei(res).toNumber());
        });
    });
    const authorizedPromise = new Promise(function (resolve, reject) {
        this.contractInstance.isUser(Utils.addressToProductId(address), function (err, res) {
            err ? reject(err) : resolve(res);
        });
    }.bind(this));

    const checkIsParticipant = axios.post("http://bitshirt.co/db.php", {
        method: "check",
        userAddress: address
    });

    return new Promise(function (resolve, reject) {
        Promise.all([userPromise, balancePromise, authorizedPromise, checkIsParticipant]).then(function (data) {
            let resolv = {};
            resolv.userIndex     = data[0][0].toNumber();
            resolv.userAddress   = address;
            resolv.userBalance   = data[1];
            resolv.isUser        = data[2];
            resolv.userEmail     = Utils.hexToAscii(data[0][1]);
            resolv.userName      = Utils.hexToAscii(data[0][2]);
            resolv.isParticipant = false;

            if(Object.keys(data[3]).length > 0) {
                if(data[3].status === 200 && data[3].data.message === "user is register"){
                    resolv.isParticipant = true;
                    resolv.userEmail     = data[3].data.userEmail;
                    resolv.userName      = data[3].data.userName;
                }else{
                    resolv.userEmail     = Utils.hexToAscii(data[0][1]);
                    resolv.userName      = Utils.hexToAscii(data[0][2]);
                    resolv.isParticipant = false;
                }
            }
            resolve(resolv);
        });
    });
};

Blockchain.prototype.getHistory = function (productId) {

    productId = Utils.stringToBytes32(Number(productId).toString(16), true);

    const historyUserPromise = new Promise(function (resolve, reject) {
        this.contractInstance.getProductHistoryUser(productId, function (err, res) {
            err ? reject(err) : resolve(res);
        });
    }.bind(this));

    const historyDatePromise = new Promise(function (resolve, reject) {
        this.contractInstance.getProductHistoryDate(productId, function (err, res) {
            err ? reject(err) : resolve(res);
        });
    }.bind(this));

    const historyPricePromise = new Promise(function (resolve, reject) {
        this.contractInstance.getProductHistoryPrice(productId, function (err, res) {
            err ? reject(err) : resolve(res);
        });
    }.bind(this));

    return new Promise(function (resolve, reject) {
        Promise.all([historyUserPromise, historyDatePromise, historyPricePromise]).then(function (data) {
            if(data.length > 0) {
                let count  = data[0].length,
                    res    = {};
                for(let i=1; i <= count;i++){
                    for(let j in data){
                        if(typeof res[i] === 'undefined'){res[i] = [data[j][i]];}
                        res[i][j] = data[j][i-1];
                    }
                }
                resolve(res);
            }else{
                reject('data is empty')
            }
        }.bind(this));
    })
};

Blockchain.prototype.getHistoryProductData = function (data) {

    if(!data){return Promise.resolve({});}
    let promises = [];
    for(let i in data){
        let userId = Utils.addressToProductId(data[i][0]);
        const promise = new Promise(function (resolve, reject) {
            this.contractInstance.userStructs(userId, function (err, res) {
                err ? reject(err) : resolve(res);
            });
        }.bind(this));

        promises.push(promise);
    }

    const usdRate = new Promise(function (resolve, reject) {
        axios.get('https://api.coinmarketcap.com/v1/ticker/ethereum/?convert=USD')
            .then(function (response) {
                if (response.status === 200) {
                    resolve(response.data);
                }
            }).catch(function (error) {
            resolve(error);
        });
    });
    promises.push(usdRate);
    return new Promise(function (resolve, reject) {
        let result = [];
        Promise.all(promises).then(function (answer) {
            let rateUsd = answer.pop();
            for(let j in data){
                let userName  = Utils.capitalizeFirstLetter(Utils.hexToAscii(answer[j-1][2])) + ' ' +
                    Utils.formatAddressLong(data[j][0]);
                let userData  = Utils.formatDate(data[j][1].toNumber());
                let userPrice = web3.fromWei(data[j][2].toNumber()) + ' Eth (' +
                    +parseFloat(rateUsd[0].price_usd * web3.fromWei(data[j][2].toNumber())).toFixed(2) + ' $)';
                result.push([userName, userData, userPrice]);
            }
            resolve(result);
        }).catch(function (error) {
            reject(error);
        }.bind(this));
    })
};

Blockchain.prototype.getCurrentPersonalProductInfo = function (productId) {

    const prodId = Utils.stringToBytes32(Number(productId).toString(16), true);

    return new Promise(function (resolve, reject) {
        this.contractInstance.productStructs(prodId, function (err, res) {
            err ? reject(err) : resolve({
                productIndex: res[0].toNumber(),
                ownerAddress: Utils.productIdToAddress(res[1]),
                size: Utils.hexToAscii(res[2]),
                price: web3.fromWei(res[3].toNumber()),
                delivery: res[4],
                inSale: res[5],
            });
        });
    }.bind(this));
};

Blockchain.prototype.getOwnerProductInfo = function (ownerAddress) {
    ownerAddress = Utils.addressToProductId(ownerAddress);
    return new Promise(function (resolve, reject) {
        this.contractInstance.userStructs(ownerAddress, function (err, res) {
            err ? reject(err) : resolve({
                userIndex: res[0].toNumber(),
                userName: Utils.hexToAscii(res[2]),
                userEmail: Utils.hexToAscii(res[1])
            });
        });
    }.bind(this));
};

Blockchain.prototype.buyProduct = function (size, delivery, value, userName, userEmail) {
    return new Promise(function (resolve, reject) {
        this.contractInstance.createProduct(size, delivery, userName, userEmail, {value: value, gas: 1000000}, function (err, res) {
            err ? reject(err) : resolve(res);
        });
    }.bind(this));
};

Blockchain.prototype.getStartPrice = function () {
    return new Promise(function (resolve, reject) {
        this.contractInstance.startPrice(function (err, res) {
            err ? reject(err) : resolve(res.toNumber());
        });
    }.bind(this));
};

Blockchain.prototype.checkTransaction = function (transaction) {

    const txPromise = new Promise(function (resolve, reject) {
        web3.eth.getTransaction(transaction.transactionHash, function (err, res) {
            err ? reject(err) : resolve(res);
        });
    });

    const txReceiptPromise = new Promise(function (resolve, reject) {
        web3.eth.getTransactionReceipt(transaction.transactionHash, function (err, res) {
            err ? reject(err) : resolve(res);
        });
    });

    return new Promise(function (resolve, reject) {
        Promise.all([txPromise, txReceiptPromise]).then(function (res) {
            const tx = res[0];
            const txReceipt = res[1];
            const succeeded = txReceipt && txReceipt.blockNumber && txReceipt.gasUsed < tx.gas;
            const failed = txReceipt && txReceipt.blockNumber && txReceipt.gasUsed === tx.gas;

            let state = transactionStates.STATE_PENDING;
            if (succeeded) {
                state = transactionStates.STATE_SUCCEEDED;
            } else if (failed) {
                state = transactionStates.STATE_FAILED;
            }
            resolve(state);
        });
    });
};

export default Blockchain;