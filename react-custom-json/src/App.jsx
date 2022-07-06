import React from 'react';
import golos, { api, broadcast, multiauth, middlewares, } from 'golos-lib-js';
import ByteBuffer from 'bytebuffer';

class App extends React.Component {
    constructor(props) {
        super(props);

        const API_HOST = 'https://dev.golos.app';

        golos.config.set('oauth.client', 'localhost');
        golos.config.set('oauth.host', API_HOST);
        golos.config.set('websocket', API_HOST + '/api/oauth/sign');
        golos.config.set('signed.websocket', 'wss://apibeta.golos.today/ws');
        golos.config.set('credentials', 'include');
        golos.use(new middlewares.MultiAuthMiddleware());

        this.state = {};
    }

    async componentDidMount() {
        const res = await multiauth.checkReliable();
        this.setState({
            account: res.authorized ? res.account : null,
            allowed: res.allowed,
        });
    }

    _waitForLogin = () => {
        multiauth.waitForLogin((res) => {
            if (res.authorized) {
                this.setState({
                    account: res.account,
                    allowed: res.allowed,
                });
            }
        }, () => {
            alert('Waiting for login is timeouted. Try again please.');
        });
    }

    login = async () => {
        try {
            await multiauth.login(['custom', 'custom_active', 'follow_or_reblog']);
        } catch (err) {
            console.error(err)
            alert(err)
            return
        }
        this._waitForLogin()
    };

    loginKeychain = async () => {
        try {
            await multiauth.login([], {type: multiauth.AuthType.KEYCHAIN});
        } catch (err) {
            console.error(err)
            alert(err)
            return
        }
        this._waitForLogin()
    };

    customJson = async () => {
        console.log('--- Sending rawCustomJson... ---');
        const { account, } = this.state;
        try {
            let res = await broadcast.customJsonAsync(
                '', [], [account], 'test', '{"alice":"bob"}');
            console.log(res)
        } catch (err) {
            console.error(err);
            alert(err);
            return;
        }
        alert('Success!');
    }

    activeCustomJson = async () => {
        console.log('--- Sending activeCustomJson... ---');
        const { account, } = this.state;
        try {
            let res = await broadcast.customJsonAsync(
                '(active)', [account], [], 'test_active', '{"alice":"bob"}');
        } catch (err) {
            console.error(err);
            alert(err);
            return;
        }
        alert('Success!');
    }

    customBinary = async () => {
        console.log('--- Sending rawCustomBinary... ---');
        const { account, } = this.state;
        try {
            let buf = Buffer.alloc(6);
            buf.writeUInt8(5);
            buf.write('GOLOS', 1);

            let res = await broadcast.customBinaryAsync(
                '', [], [], [account], [], 'test', buf.toString('hex'));
        } catch (err) {
            console.error(err);
            alert(err);
            return;
        }
        alert('Success!');
    }

    follow = async () => {
        console.log('--- Sending follow... ---');
        const { account, } = this.state;
        try {
            const json = ['follow', {follower: account,
                following: 'null', what: ['blog']}];
            let res = await broadcast.customJsonAsync(
                '', [], [account], 'follow', JSON.stringify(json));
        } catch (err) {
            console.error(err);
            alert(err);
            return;
        }
        alert('Success!');
    }

    tryWithoutLogin = async () => {
        await this.customJson();
    };

    logout = async () => {
        await multiauth.logout();
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
                    <button onClick={this.loginKeychain}>Login with Keychain</button>
                    <button onClick={this.tryWithoutLogin}>Try To Send custom_json Without Authorization (will fail)</button>
                </div>}
                {account && <div>
                    <div>
                        {account}
                        <button onClick={this.logout}>Logout</button>
                        <p>Allowed operations:&nbsp;
                            <span className='allowed'>{JSON.stringify(allowed)}</span></p>
                    </div>
                    <hr />
                    <button onClick={this.customJson}>Custom json</button>
                    <button onClick={this.activeCustomJson}>Active custom json</button>
                    <hr />
                    <button onClick={this.customBinary}>Custom binary</button>
                    <hr />
                    <button onClick={this.follow}>Follow</button>
                </div>}
            </div>
        );
    }
}

export default App;
