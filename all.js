console.log("running all.js");

chrome.storage.sync.get({ avoid_auto_logout: true }, function (options) {
    if (options.avoid_auto_logout) {
        setInterval(function () {
            $("#portaltimer").click();
        }, 10 * 60 * 1000);
    }
});

