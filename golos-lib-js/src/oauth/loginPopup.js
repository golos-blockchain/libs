const renderLoading = () => {
return `
    <div class="__glshlp-preloader">
        <div class="__glshlp-loading">
            <div></div>
        </div>
    </div>
`;
};

const renderContent = (title, desc, button) => {
return `
    <div>
        <h4 class="__glshlp-h4">${title}</h4>
        <p class="__glshlp-hr">
        <div>${desc}</div>
        <br>
        <button class="__glshlp-button" style="float: right; margin-left: 1rem;">${button}</button>
    </div>
`;
};

const renderPopup = (id) => {
return `
<div id="${id}" class="__glshlp-dialog" style="inset: 0px; overflow-y: scroll; position: fixed;">
    <div style="display: block;" class="__glshlp-overlay"></div>
    <div class="__glshlp-reveal" style="display: block;" tabindex="-1">
        <button class="__glshlp-close-button" type="button">
            <span aria-hidden="true" class="">×</span>
        </button>
        <div class="__glshlp-container">
            ${renderLoading()}
        </div>
    </div>
</div>`;
}

const css = `
.__glshlp-dialog {
    z-index: 1000000;
    font-family: Roboto;
}

.__glshlp-h4 {
    font-style: normal;
    font-weight: 400;
    font-size: 1.5625rem;
    line-height: 1.4;
    margin-top: 0;
    margin-bottom: .5rem;
}

.__glshlp-hr {
    clear: both;
    max-width: 75rem;
    height: 0;
    margin: 1.25rem auto;
    border: 0;
    border-bottom: 1px solid #cacaca;
}

.__glshlp-overlay {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: none;
    background-color: rgba(51,51,51,.45);
    overflow-y: scroll;
}

.__glshlp-reveal {
    background-color: #fff;
    color: #333;
    width: 600px;
    max-width: 75rem;
    min-height: 0;
    z-index: 1000001;
    backface-visibility: hidden;
    padding: 1rem;
    border: 1px solid #cacaca;
    border-radius: 3px;
    position: relative;
    top: 100px;
    margin-right: auto;
    margin-left: auto;
    overflow-y: auto;
    right: auto;
    left: auto;
}

@media screen and (max-width: 39.9375em) {
.__glshlp-reveal {
    top: 0;
    left: 0;
    width: 100%;
    max-width: none;
    height: 100vh;
    min-height: 100vh;
    margin-left: 0;
    border: 0;
    border-radius: 0;
}
}

.__glshlp-close-button {
    background: transparent;
    border: 0;
    padding: 0;
    right: 1rem;
    top: .5rem;
    font-size: 2em;
    line-height: 1;
    position: absolute;
    color: #8a8a8a;
    cursor: pointer;
    margin-right: 15px !important;
    font-family: Roboto;
}

.__glshlp-close-button:focus,
.__glshlp-close-button:hover {
    color:#333
}

.__glshlp-button {
    display: inline-block;
    vertical-align: middle;
    margin: 0 0 1rem;
    margin-right: 0px;
    padding: .85em 1em;
    -webkit-appearance: none;
    border: 1px solid transparent;
    border-radius: 100px;
    -webkit-transition: background-color .25s ease-out,color .25s ease-out;
    transition: background-color .25s ease-out,color .25s ease-out;
    font-size: .9rem;
    font-family: Roboto;
    line-height: 1;
    cursor: pointer;
    background-color: #0078c4;
    color: #fefefe;
    text-transform: uppercase;
    text-align: center;
    font-weight: 700;
}

.__glshlp-button:hover,
.__glshlp-button:focus {
    background-color: #0066a7;
    color: #fefefe;
}

.__glshlp-button.__glshlp-hollow {
    background-color: transparent;
    border: 1px solid #0078c4;
    color: #0078c4;
}

@keyframes glshlp-loading {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.__glshlp-loading {
  width: 32px;
  height: 32px;
  margin: 4px;
  border: 1px solid #8a8a8a;
  border-radius: 50%;
  border-right-color: transparent;
  border-top-color: transparent;
  animation: glshlp-loading 625ms infinite linear;
}
`;

const locales = {
    ru: {
        description: 'Это приложение запрашивает доступ к вашему аккаунту.',
        button: 'Подробнее >>',
    },
    en: {
        description: 'This application requests access to your account.',
        button: 'More >>',
    },
};

const loc = (key) => {
    const lang = navigator.language || 'ru';
    const isRus = lang.startsWith('ru');
    let res = isRus && locales.ru[key];
    if (!res) res = locales.en[key] || locales.ru[key];
    if (!res) res = 'missing translation: ' + key;
    return res;
}

function insertCss() {
    const cssId = '__glshlp-css';
    if (document.getElementById(cssId))
        return;
    var style = document.createElement('style');
    style.id = cssId;
    style.type = 'text/css';
    style.innerText = css;
    document.body.appendChild(style);
}

function insertFonts() {
    const fontsId = '__glshlp-fonts';
    if (document.getElementById(fontsId))
        return;
    var link  = document.createElement('link');
    link.id = fontsId;
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = 'https://fonts.googleapis.com/css?family=Roboto:300,300i,400,400i,500,500i,700,700i,900,900i&subset=cyrillic,cyrillic-ext';
    link.media = 'all';
    document.body.appendChild(link);
}

function randomId() {
    return Math.random();
}

async function createPopup(loadData, onOK, onCancel) {
    insertCss();
    try {
        insertFonts();
    } catch (err) {
        console.error('golos.oauth insertFonts error', err);
    }

    const id = 'login-popup-' + randomId();
    const html = renderPopup(id);
    document.body.insertAdjacentHTML('afterend', html);

    let popup = document.getElementById(id);
    let overlay = popup.getElementsByClassName('__glshlp-overlay')[0];
    let closeButton = popup.getElementsByClassName('__glshlp-close-button')[0];
    let container = popup.getElementsByClassName('__glshlp-container')[0];

    const closePopup = () => {
        let parent = popup.parentNode;
        if (parent)
            parent.removeChild(popup);
    };
    overlay.addEventListener('click', (e) => {
        onCancel({ closePopup, });
    });
    closeButton.addEventListener('click', (e) => {
        onCancel({ closePopup, });
    });

    const { title, } = await loadData();
    container.innerHTML = renderContent(title, loc('description'), loc('button'));

    let button = popup.getElementsByClassName('__glshlp-button')[0];
    button.addEventListener('click', (e) => {
        onOK({ closePopup, });
    });

    return {
        id,
    };
}

/*createPopup(async () => {
    await new Promise(resolve => setTimeout(resolve, 4000));
    return { title: 'Test', };
}, ({ closePopup, }) => {
    closePopup();
}, ({ closePopup, }) => {
    closePopup();
})*/

module.exports = {
    createPopup,
};
