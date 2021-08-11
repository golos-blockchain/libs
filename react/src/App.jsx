import React from 'react';
import golos, { api, broadcast, oauth, middlewares, } from 'golos-lib-js';

class App extends React.Component {
    constructor(props) {
        super(props);

        const API_HOST = 'https://dev.golos.app';

        golos.config.set('oauth.client', 'localhost');
        golos.config.set('oauth.host', API_HOST);
        golos.config.set('websocket', API_HOST + '/api/oauth/sign');
        golos.config.set('credentials', 'include');
        golos.use(new middlewares.OAuthMiddleware());

        this.state = {};
    }

    async componentDidMount() {
        const res = await oauth.checkReliable();
        this.setState({
            account: res.authorized ? res.account : null,
            allowed: res.allowed,
        });
    }

    login = () => {
        oauth.login(['transfer', 'account_metadata']);
        oauth.waitForLogin((res) => {
            if (res.authorized) {
                this.setState({
                    account: res.account,
                    allowed: res.allowed,
                });
            }
        }, () => {
            alert('Waiting for login is timeouted. Try again please.');
        });
    };

    updateMetadata = async () => {
        console.log('--- Update metadata... ---');
        const { account, } = this.state;
        const accountName = account || 'cyberfounder';
        let accs = null;
        try {
            accs = await api.getAccountsAsync([accountName]);
        } catch (err) {
            console.error('getAccounts error', err);
            return;
        }
        console.log('account is: ', accs);
        try {
            await broadcast.accountMetadataAsync('', accountName, accs[0].json_metadata || '{}');
        } catch (err) {
            console.error(err);
            alert(err);
            return;
        }
        alert('Success!');
    };

    transfer = async () => {
        console.log('--- Transfer... ---');
        const { account, } = this.state;
        const { to, amount } = document.forms[0];
        try {
            let res = await broadcast.transferAsync('', account, to.value,
                amount.value, 'Buy a coffee with caramel :)');
        } catch (err) {
            console.error(err);
            alert(err);
            return;
        }
        alert('Success!');
    };

    tryWithoutLogin = async () => {
        await this.updateMetadata();
    };

    logout = async () => {
        await oauth.logout();
        this.setState({
            account: null,
        });
    };

    render() {
        const { account, allowed, } = this.state;
        return (
            <div className='App'>
                {account === null && <div>
                    <button onClick={this.login}>Login</button>
                    <button onClick={this.tryWithoutLogin}>Try To Update @cyberfounder's Metadata Without Authorization (will fail)</button>
                </div>}
                {account && <div>
                    <div>
                        {account}
                        <button onClick={this.logout}>Logout</button>
                        <p>Allowed operations:&nbsp;
                            <span className='allowed'>{JSON.stringify(allowed)}</span></p>
                    </div>
                    <h4>Transfer (test active)</h4>
                    <form>
                        From:<br/>current account<br/>
                        To:<br/>
                        <input type='text' name='to' value='null' /><br/>
                        Amount:<br/>
                        <input type='text' name='amount' value='0.001 GOLOS' /><br/>
                    </form>
                    <button onClick={this.transfer}>Transfer</button>
                    <hr/>
                    <h4>Account metadata (test posting)</h4>
                    <button onClick={this.updateMetadata}>Update metadata for current account</button>
                </div>}
            </div>
        );
    }
}

export default App;
