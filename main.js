'use strict';
process.env.ELECTRON_HIDE_INTERNAL_MODULES = 'true';

const electron = require('electron');
const app = electron.app;
const Menu = electron.Menu;
const BrowserWindow = electron.BrowserWindow;
const shell = electron.shell;

let mainWindow = null;

app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

var startupOpts = {
    useContentSize: true,
    width: 800,
    height: 620,
    center: true,
    resizable: true,
    alwaysOnTop: false,
    fullscreen: false,
    skipTaskbar: false,
    kiosk: false,
    title: 'Microsoft Teams',
    icon: __dirname + '/favicon-256x256.png',
    show: true,
    frame: true,
    disableAutoHideCursor: false,
    autoHideMenuBar: false,
    titleBarStyle: 'default',

    webPreferences: {
        webSecurity: false,
        nodeIntegration: false,
        renotify: true,
        allowDisplayingInsecureContent: true,
        allowRunningInsecureContent: true,
        plugins: true,
        preload: __dirname + '/inject/preload.js'
    }
};


app.on('ready', function() {

    Menu.setApplicationMenu(Menu.buildFromTemplate(require('./src/menus')));

    mainWindow = new BrowserWindow(startupOpts);
    
    mainWindow.loadURL('https://teams.microsoft.com', {
        userAgent: 'Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.10136'
        // userAgent: 'Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0'
        // userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36'
    });
    
    mainWindow.on('closed', function() {
        mainWindow = null;
    });
    mainWindow.webContents.on('new-window', function(event, url) {
        event.preventDefault();
        shell.openExternal(url);
    });
    mainWindow.show();

    const intervalId = setInterval(function () {
        mainWindow.webContents.executeJavaScript("var sheet = window.document.styleSheets[0];\n" +
            "sheet.insertRule('.ts-unread-channel {background-color: bisque}', sheet.cssRules.length);")
    }, 10000);

    setTimeout(function () {
        mainWindow.clearInterval(intervalId);
    }, 40000);

});




// Hardware Acceleration
// Override software rendering list: ENABLED
// PWA
// Enable PWA full code cache: ENABLED
// Desktop PWAs: ENABLED
// Desktop PWAs Link Capturing: ENABLED
// WEBRTC
// Negotiation with GCM cipher suites for SRTP in WebRTC: ENABLED
// Negotiation with encrypted header extensions for SRTP in WebRTC: ENABLED
// WebRTC Stun origin header: ENABLED
// WebRTC Echo Canceller 3: ENABLED
// WebRTC new encode cpu load estimator: ENABLED
// WebRTC H.264 software video encoder/decoder: ENABLED
// Downloads
// Parallel downloading: ENABLED
// Verify that Setting work.
//     Open Microsoft Teams in your browser.
//     Start a private chat with someone and verify that the video chat icon switches from grey to purple and white. If so, you can start making video calls and you should also be able to make presentation.