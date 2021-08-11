const { api, } = golos;
const { broadcast, } = golos;
const { middlewares, } = golos;
const { multiauth, } = golos;

const API_HOST = 'https://dev.golos.app';

golos.config.set('oauth.client', 'localfile');
golos.config.set('oauth.host', API_HOST);
golos.config.set('websocket', API_HOST + '/api/oauth/sign');
golos.config.set('signed.websocket', 'wss://apibeta.golos.today/ws'); // Used with KeyChain
golos.config.set('credentials', 'include');
golos.use(new middlewares.MultiAuthMiddleware());

let account = '';

$('.login').click(async (e) => {
    try {
        await multiauth.login(['transfer', 'account_metadata', 'donate']);
    } catch (err) {
        console.error(err)
        alert(err)
        return
    }
    multiauth.waitForLogin(res => {
        window.location.reload();
    }, () => {
        alert('Waiting for login is timeouted. Try again please.');
    });
});

$('.login-keychain').click(async (e) => {
    // We can hide this button if not multiauth.keychainInfo().installed
    try {
        await multiauth.login([], { type: multiauth.AuthType.KEYCHAIN});
    } catch (err) {
        console.error(err)
        alert(err)
        return
    }
    multiauth.waitForLogin(res => {
        window.location.reload();
    }, () => {
        alert('Waiting for login is timeouted. Try again please.');
    });
});

$('.logout').click(async (e) => {
    await multiauth.logout();
    window.location.reload();
});

$('.transfer').click(async (e) => {
    console.log('--- Transfer... ---');
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
});

$('.meta').click(async (e) => {
    console.log('--- Update metadata... ---');
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
});

async function init() {
    const res = await multiauth.checkReliable();
    if (res.authorized) {
        $('.login-form').hide();
        $('.actions').show();
        $('.username').text(res.account);
        account = res.account;
        $('.allowed').text(JSON.stringify(res.allowed));
    } else {
        $('.login-form').show();
        $('.actions').hide();
    }
    $('.loading').hide();
}
init();
