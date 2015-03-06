/**
 * Created by kokdemo on 2015/3/6 0006.
 */
chrome.extension.onMessage.addListener(function (request, _, sendResponse) {
    // 返回数据
    var dicReturn;

    // 读取已存数据
    // 从localstorage中读取数据
    var strList = localStorage['atom'];
    if (strList) {
        // 将json字符串转为对象
        var dicList = JSON.parse(strList);
        dicReturn = {'status': 200, 'data': dicList}
    } else {
        dicReturn = {'status': 404}
    }

    // 向content_script返回信息
    sendResponse(dicReturn);
});