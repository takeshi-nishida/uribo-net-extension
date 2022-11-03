console.log("running all.js");

chrome.storage.sync.get({ avoid_auto_logout: true }, function (options) {
    if (options.avoid_auto_logout) {
        setInterval(function () {
            console.log("Will click #portaltimer to avoid auto logout.");
            const b = document.getElementById("portaltimer");
            if(b) b.click();
        }, 8 * 60 * 1000);
    }
});