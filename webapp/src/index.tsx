// To see this in action, run this in a terminal:
//      gp preview $(gp url 8000)

import * as React from "react";
import * as ReactDOM from "react-dom";
import {Api, JsonRpc} from 'eosjs';
import {JsSignatureProvider} from 'eosjs/dist/eosjs-jssig';
import {Navbar} from 'react-bootstrap';
import Button from 'react-bootstrap-button-loader';

const rpc = new JsonRpc(''); // nodeos and web server are on same port


interface AppData {
    privateKey: string;
    user?: string;
    error: string;
    issueAmount: string;
    transferTo: string;
    transferAmount: string;
    balance: string;
    loadingIssue: boolean;
    loadingTransfer: boolean;
}


class App extends React.Component<{}, AppData> {
    api: Api;

    constructor(props: {}) {
        super(props);
        this.api = new Api({rpc, signatureProvider: new JsSignatureProvider([])});
        this.state = {
            privateKey: '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3',
            user: 'bob',
            error: '',
            issueAmount: '100.0000 POINTS',
            transferTo: '',
            transferAmount: '100.0000 POINTS',
            balance: '',
            loadingIssue: false,
            loadingTransfer: false
        };
    }

    async updateUser(value: string){
        this.setState({user: value});
        this.getBalance().then(() => {});
    }

    async getBalance() {
        if (this.state.user === '') {
            return
        }
        try {
            let balance = await rpc.get_currency_balance('eosio.token', this.state.user, 'POINTS');
            this.setState({balance: balance[0]})
        } catch (e) {
        }
    }

    async issue() {
        this.setState({loadingIssue: true});
        try {
            this.api.signatureProvider = new JsSignatureProvider([this.state.privateKey]);
            const result = await this.api.transact(
                {
                    actions: [{
                        account: 'eosio.token',
                        name: 'issue',
                        authorization: [{
                            actor: this.state.user,
                            permission: 'active',
                        }],
                        data: {"to": this.state.user, "quantity": this.state.issueAmount, "memo": "Issue Gift Card"}
                    }]
                }, {
                    blocksBehind: 3,
                    expireSeconds: 30,
                });
            console.log(result);
            this.setState({error: ''});
            alert('Issue was successful!')
        } catch (e) {
            if (e.json)
                this.setState({error: JSON.stringify(e.json, null, 4)});
            else
                this.setState({error: '' + e});
        }
        this.setState({loadingIssue: false});
    }

    async transfer() {
        this.setState({loadingTransfer: true});
        try {
            this.api.signatureProvider = new JsSignatureProvider([this.state.privateKey]);
            const result = await this.api.transact(
                {
                    actions: [{
                        account: 'eosio.token',
                        name: 'transfer',
                        authorization: [{
                            actor: this.state.user,
                            permission: 'active',
                        }],
                        data: {
                            "from": this.state.user, "to": this.state.transferTo,
                            "quantity": this.state.transferAmount, "memo": "Transfer Gift Card"
                        }
                    }]
                }, {
                    blocksBehind: 3,
                    expireSeconds: 30,
                });
            console.log(result);
            this.setState({error: ''});
            alert('Transfer was successful!')
        } catch (e) {
            if (e.json)
                this.setState({error: JSON.stringify(e.json, null, 4)});
            else
                this.setState({error: '' + e});
        }
        this.setState({loadingTransfer: false});
    }

    componentDidMount(){
        this.getBalance().then(() => {});
    }

    render() {
        return <div>
            <Navbar bg="primary" variant="dark">
                <div style={{width: "90%"}}>
                    <Navbar.Brand href="/">
                        <b>Gift Card</b>
                    </Navbar.Brand>
                </div>
            </Navbar>
            <div style={{padding: "15px"}}>
                <table>
                    <tbody>
                    <tr>
                        <td>Private Key</td>
                        <td><input
                            style={{width: 500}}
                            value={this.state.privateKey}
                            type="password" name="password"
                            onChange={e => this.setState({privateKey: e.target.value})}
                        /></td>
                    </tr>
                    <tr>
                        <td>User</td>
                        <td><input
                            style={{width: 500}}
                            value={this.state.user}
                            onChange={e => this.updateUser(e.target.value)}
                        /></td>
                    </tr>
                    </tbody>
                </table>
                <br/>
                <div><b>Balance:</b> {this.state.balance}</div>
                <br/>
                <h5>Issue Gift Card</h5>
                <table>
                    <tbody>
                    <tr>
                        <td>Issue Amount</td>
                        <td><input
                            style={{width: 500}}
                            value={this.state.issueAmount}
                            onChange={e => this.setState({issueAmount: e.target.value})}
                        /></td>
                    </tr>
                    </tbody>
                </table>
                <Button variant="primary btn" onClick={this.issue.bind(this)} style={{marginTop: "5px"}}
                        loading={this.state.loadingIssue}>
                    Issue
                </Button>
                <br/>
                <br/>
                <h5>Use Gift Card</h5>
                <table>
                    <tbody>
                    <tr>
                        <td>Transfer To</td>
                        <td><input
                            style={{width: 500}}
                            value={this.state.transferTo}
                            onChange={e => this.setState({transferTo: e.target.value})}
                        /></td>
                    </tr>
                    <tr>
                        <td>Transfer Amount</td>
                        <td><input
                            style={{width: 500}}
                            value={this.state.transferAmount}
                            onChange={e => this.setState({transferAmount: e.target.value})}
                        /></td>
                    </tr>
                    </tbody>
                </table>
                <Button variant="primary btn" onClick={this.transfer.bind(this)} style={{marginTop: "5px"}}
                        loading={this.state.loadingTransfer}>
                    Transfer
                </Button>
                <br/>
                <br/>
                {this.state.error && <div>
                    <br/>
                    Error:
                    <code>
                        <pre>{this.state.error}</pre>
                    </code>
                </div>}
            </div>
        </div>;
    }
}

ReactDOM.render(
    <div>
        <App/>
        <br/>
    </div>,
    document.getElementById("example")
);
