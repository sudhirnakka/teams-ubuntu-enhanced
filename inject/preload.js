let count = 0;
let unreadMessages = "";

window.addEventListener('DOMContentLoaded', function() {
    const {remote} = require('electron');
    waitForMaximize(remote.getCurrentWindow());
}, false);

function waitForMaximize(win) {
    const initialized = document.querySelector('.initialized.loadingscreendone');
    const isLoginPage = document.querySelector('#background_branding_container');
    if (initialized) {
        setAppBarObserver();
        exitFromCurrentChat();
        setTimedNotifier();
        return win.maximize();
    }
    setTimeout(() => {
        if (!isLoginPage && count === 300) {
            count = 0;
            win.webContents.session.clearCache(() => {
                win.reload();
            });
            return;
        }
        if (isLoginPage) {
            count = 0;
        }
        count++;
        waitForMaximize(win);
    }, 50);
}


function notifyMe(customMessage) {
    if (!("Notification" in window)) {
        alert("Browser does not support Notifications. Try a different browser.");
    }

    // notification permissions granted?
    else if (Notification.permission === "granted") {
        createNotification(customMessage);
    }

    // Request user for permission
    else if (Notification.permission !== "denied") {
        Notification.requestPermission(function(permission) {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
                createNotification(customMessage);
            }
        });
    }
}

function createNotification(customMessage) {
    var title = "Teams";
    var options = {
        body: customMessage,
        icon: document.querySelector('link[rel="icon"]').href,
        requireInteraction: true
    };
    var notification = new Notification(title, options);
    notification.onclick = function() {
        window.focus();
    };
}

function setAppBarObserver() {
    requestNotificationsPermission();
    const observerConfig = {subtree: true, characterData: true, childList: true};

    //TODO: ghost: improve the targets
    let chatTarget = document.querySelector('.Chat');
    let teamsTarget = document.querySelector('.Teams');
    let meetingsTarget = document.querySelector('.Calendar');

    let observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            try {
                if (!mutation.target.hasChildNodes()) return;
            }catch(e) {
                console.log("Weird node detected")
                return;
            }

            const context = mutation.target.getElementsByClassName('app-bar-text')[0].textContent;
            const notificationCount = parseInt(mutation.target.getElementsByClassName('activity-badge-count')[0].textContent);
            if (notificationCount > 0) {
                const notificationMessage = "Unread " + context + " messages: " + notificationCount + "";
                unreadMessages = notificationMessage;
                notifyMe(notificationMessage);
            }
        });
    });

    observer.observe(chatTarget, observerConfig);
    observer.observe(teamsTarget, observerConfig);
    observer.observe(meetingsTarget, observerConfig);
}

function requestNotificationsPermission() {
    Notification.requestPermission().then(function(result) {
        console.log('Permissions for Teams: ' + result);
    });
}

function setTimedNotifier() {
    // setInterval(function () {
    //     console.log("test ", unreadMessages);
    //     if (unreadMessages.length > 0) {
    //         notifyMe(unreadMessages);
    //     }
    // }, 5000);
}

function exitFromCurrentChat() {
    setInterval( function() {
        if( document.hidden ) {
            document.querySelector('ul[data-tid="active-chat-list"] li:nth-last-child(2) a').click();
        }
    }, 30000 );
}
