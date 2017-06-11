function save_options() {
    var avoid_auto_logout = $("#avoid_auto_logout").prop("checked");

    var selected = $("input[name='shozoku']:checked").map(function () { return this.value }).get();

    chrome.storage.sync.set({
        avoid_auto_logout: avoid_auto_logout,
        shozoku: selected
    }, function () {
        $("#status").text("保存されました");
    });
}

function restore_options() {
    chrome.storage.sync.get({ avoid_auto_logout: true, shozoku: [] }, function (options) {
        $("#avoid_auto_logout").prop("checked", options.avoid_auto_logout);
        
        var exp = options.shozoku.map(function (v) { return "input[value='" + v + "']"; }).join(",");
        $(exp).prop("checked", true);
    });
}

$(function () {
    restore_options();
    $("#saveButton").click(save_options);
});