console.log("Running all.js");

chrome.storage.sync.get({ avoid_auto_logout: true }, function (options) {
    if (options.avoid_auto_logout) {
        setInterval(function () {
            console.log("Will click #portaltime to avoid auto logout.");
            $("#portaltimer").click();
        }, 8 * 60 * 1000);
    }
});

