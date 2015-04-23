/**
 * Created by JiaHao on 2015/4/14 0014.
 */

var checkUrl = function () {
    var pageUrl = {
        originUrl :window.location.href,
        pureUrl : "",
        searchText : "",
        nodeName : "",
        nodePageUrl : "",
        nodePageNum : 1,
        isRecent : "",
        isList: false,
        isNotifi : false
    };
    var search = pageUrl['originUrl'].indexOf('?');
    if (search != -1) {
        //如果链接中有问号，获取等号之后的内容，获取问号之前的内容。
        pageUrl['pureUrl'] = pageUrl['originUrl'].slice(0, search);
        var tempPosition = pageUrl['originUrl'].indexOf('=');
        pageUrl['searchText'] = pageUrl['originUrl'].slice(tempPosition+1);
        pageUrl['nodePageUrl'] = pageUrl['originUrl'].slice(0,tempPosition);
    }else{
        pageUrl['pureUrl'] = pageUrl['originUrl'];
    }
    var nodePosition = pageUrl['pureUrl'].indexOf('/go/');
    pageUrl['isRecent'] = pageUrl['pureUrl'].indexOf('/recent');
    if(pageUrl['pureUrl'] == 'http://www.v2ex.com/'
        || pageUrl['pureUrl'] == 'https://www.v2ex.com/'
        || pageUrl['pureUrl'] == 'http://v2ex.com/'
        || nodePosition != -1
        || pageUrl['isRecent'] != -1){
        //判断这些页面中包含列表
        pageUrl['isList'] = true;
        if(nodePosition != -1){
            pageUrl['nodeName'] = pageUrl['pureUrl'].slice(nodePosition + 4);
        }
    }
    if( pageUrl['pureUrl'].indexOf('/notifications') != -1){
        pageUrl['isNotifi'] = true;
    }
    console.info(pageUrl);
    return pageUrl
};

var getList = function (pageUrl) {
    var itemList = [];
    var $itemDom;
    if (pageUrl['nodeName'] != "") {
        $itemDom = $('#TopicsNode').children('.cell')
    } else {
        $itemDom = $('.cell.item');
    }
    for (var i = 0, len = $itemDom.length; i < len; i++) {
        var tempItem = {};
        var top = $($itemDom[i]).children('div').children('img');
        tempItem['top'] = !top.length;
        var info = $($itemDom[i]).children('table').children('tbody').children('tr').children();
        tempItem['userUrl'] = $(info[0]).children('a').attr('href');
        tempItem['avatar'] = $(info[0]).children('a').children('img').attr('src');
        tempItem['title'] = $(info[2]).children('.item_title').text();
        tempItem['postUrl'] = $(info[2]).children('.item_title').children('a').attr('href');
        tempItem['vote'] = $(info[2]).children('.small.fade').children('.votes').text();
        if (tempItem['vote'] == '') {
            tempItem['vote'] = 0
        } else {
            tempItem['vote'] = tempItem['vote'][2]
        }
        tempItem['nodeUrl'] = $(info[2]).children('.small.fade').children('.node').attr('href');
        tempItem['nodeText'] = $(info[2]).children('.small.fade').children('.node').text();
        tempItem['lastReply'] = $($(info[2]).children('.small.fade').children('strong')[1]).children('a').attr('href');
        tempItem['replyNum'] = $(info[3]).children('a').text();
        if (tempItem['replyNum'] == '') {
            tempItem['replyNum'] = 0
        }
        itemList.push(tempItem);
    }
    return itemList
};

var getUserInfo = function () {
    var userInfo = {};
    var $Dom = $($('#Rightbar').children('.box')[0]);
    var userDom = $Dom.children('.cell:first').children('table:first').children('tbody').children('tr').children();
    var collectDom = $Dom.children('.cell:first').children('table:last').children('tbody').children('tr').children('');
    var $topDom = $('#Top').find('.top');
    userInfo['notiNum'] = $Dom.children('.inner').children('a').text().slice(0, -6);
    userInfo['userName'] = $(userDom[2]).children('.bigger').children('a').text();
    userInfo['userMotto'] = $(userDom[2]).children('.fade').text();
    userInfo['userAvatar'] = $(userDom[0]).children('a').children('img').attr('src');
    userInfo['collectNode'] = $(collectDom[0]).children('a').children('.bigger').text();
    userInfo['collectTopic'] = $(collectDom[1]).children('a').children('.bigger').text();
    userInfo['following'] = $(collectDom[2]).children('a').children('.bigger').text();
    userInfo['ip'] = $($topDom[6]).attr('href');
    userInfo['logout'] = $($topDom[8]).attr('onclick');
    return userInfo
};

var getNotifications = function (pageUrl){
    var $dom = $('.cell[id]');
    var array = [];
    var $tempitem;
    for (var i= 0;i<$dom.length;i++){
        $tempitem = $dom[i];
        var arrayItem = {};
        arrayItem['id'] = $($tempitem).attr('id');
        $tempitem = $($tempitem).children('table').children('tbody').children('tr').children('td');
        arrayItem['avatar'] = $($tempitem[0]).children('a').children('img').attr('src');
        arrayItem['userUrl'] = $($tempitem[0]).children('a').attr('href');
        arrayItem['userName'] = $($tempitem[1]).children('span').children('a:first').children('strong').text();
        arrayItem['postUrl'] = $($tempitem[1]).children('span').children('a:nth-child(2)').attr('href');
        arrayItem['postName'] = $($tempitem[1]).children('span').children('a:nth-child(2)').text();
        arrayItem['reply'] = $($tempitem[1]).children('.payload').text();
        array.push(arrayItem);
    }
    return array
};

var Slide = React.createClass({displayName: "Slide",
    render: function () {
        var DomStyle = {
            height: $(window).height()
        };
        var aClassName = 'top k_color_hover';
        return(
            React.createElement("div", null, 
                React.createElement("div", {id: "k_navbar", style: DomStyle, classNameName: "bars k_color_dark"}, 
                    React.createElement("a", {id: "avatar", href: '/member/' + this.props.info.userName, className: aClassName}, 
                        React.createElement("img", {src: this.props.info.userAvatar})
                    ), 
                    React.createElement("a", {href: "/notifications", className: aClassName}, 
                        React.createElement("i", {className: "fa fa-bell fa-2x", title: "提醒"}), this.props.info.notiNum
                    ), 
                    React.createElement("a", {href: "/", className: aClassName, title: "首页"}, 
                        React.createElement("i", {className: "fa fa-home fa-2x"})
                    ), 
                    React.createElement("a", {href: "/new", className: aClassName, title: "新主题"}, 
                        React.createElement("i", {className: "fa fa-pencil-square-o fa-2x"})
                    ), 
                    React.createElement("a", {href: "/planes", className: aClassName, title: "节点"}, 
                        React.createElement("i", {className: "fa fa-th fa-2x"})
                    ), 
                    React.createElement("a", {href: "//workspace.v2ex.com/", target: "_blank", className: aClassName, title: "工作空间"}, 
                        React.createElement("i", {className: "fa fa-laptop fa-2x"})
                    ), 
                    React.createElement("a", {href: "/notes", className: aClassName, title: "笔记"}, 
                        React.createElement("i", {className: "fa fa-book fa-2x"})
                    ), 
                    React.createElement("a", {href: "/t", className: aClassName, title: "时间轴"}, 
                        React.createElement("i", {className: "fa fa-list-alt fa-2x"})
                    ), 
                    React.createElement("a", {href: "/events", className: aClassName, title: "事件"}, 
                        React.createElement("i", {className: "fa fa-eye fa-2x"})
                    ), 
                    React.createElement("a", {href: '/place/' + this.props.info.ip, className: aClassName, title: "附近"}, 
                        React.createElement("i", {className: "fa fa-map-marker fa-2x"})
                    ), 
                    React.createElement("a", {href: "/settings", className: aClassName, title: "设置"}, 
                        React.createElement("i", {className: "fa fa-cog fa-2x"})
                    ), 
                    React.createElement("a", {href: "#;", onclick: "if (confirm('确定要从 V2EX 登出？')) { location.href= '/signout'; }", className: aClassName, title: "退出"}, 
                        React.createElement("i", {className: "fa fa-sign-out fa-2x"})
                    )
                ), 

                React.createElement("div", {id: "k_tabbar", className: "bars k_color_light"}, 
                    React.createElement("a", {href: "/?tab=all", className: "tab k_color_hover"}, "全部"), 
                    React.createElement("a", {href: "/?tab=tech", className: "tab k_color_hover"}, "技术"), 
                    React.createElement("a", {href: "/?tab=creative", className: "tab k_color_hover"}, "创意"), 
                    React.createElement("a", {href: "/?tab=play", className: "tab k_color_hover"}, "好玩"), 
                    React.createElement("a", {href: "/?tab=apple", className: "tab k_color_hover"}, "Apple"), 
                    React.createElement("a", {href: "/?tab=jobs", className: "tab k_color_hover"}, "酷工作"), 
                    React.createElement("a", {href: "/?tab=deals", className: "tab k_color_hover"}, "交易"), 
                    React.createElement("a", {href: "/?tab=city", className: "tab k_color_hover"}, "城市"), 
                    React.createElement("a", {href: "/?tab=qna", className: "tab k_color_hover"}, "问与答"), 
                    React.createElement("a", {href: "/?tab=hot", className: "tab k_color_hover"}, "最热"), 
                    React.createElement("a", {href: "/?tab=r2", className: "tab k_color_hover"}, "R2"), 
                    React.createElement("a", {href: "/?tab=nodes", className: "tab k_color_hover"}, "节点"), 
                    React.createElement("a", {href: "/?tab=members", className: "tab k_color_hover"}, "关注")
                )
            )
            );
    }
});

var ListItem = React.createClass({displayName: "ListItem",
    voteClassName: function (voteNum) {
        var className;
        if (voteNum < 0) {
            className = 'black'
        } else if (voteNum < 2) {
            className = 'blue'
        } else if (voteNum < 4) {
            className = 'green'
        } else if (voteNum < 8) {
            className = 'yellow'
        } else {
            className = 'red'
        }
        return className
    },
    nodeDom: function (pageUrl) {
        if (pageUrl['nodeName'] == "") {
            return React.createElement("span", {className: "k_itemList_node"}, this.props.item.nodeText);
        } else {
            return React.createElement("span", {className: "k_itemList_node"}, this.props.nodeName);
        }
    },
    getWidth: function () {
        var width = $(window).width() - 140 - 270 - 20 - 80 - 48 - 20 - 10 - 10 -25;
        return {
            width: width
        };
    },

    render: function () {
        return(
            React.createElement("li", null, 
                React.createElement("a", {className: "k_itemList_avatar", href: this.props.item.userUrl}, 
                    React.createElement("img", {src: this.props.item.avatar})
                ), 
                React.createElement("div", {className: "k_itemList_node_vote"}, 
                    React.createElement("a", {href: this.props.item.nodeUrl, className: 'k_itemList_vote ' + this.voteClassName(this.props.item.vote)}, 
                        React.createElement("span", null, 
                            React.createElement("i", {className: "fa fa-chevron-up"}), this.props.item.vote
                        )
                    ), 
                    React.createElement("a", {href: this.props.item.nodeUrl, className: "k_itemList_reply"}, 
                        React.createElement("span", null, 
                            React.createElement("i", {className: "fa fa-reply"}), this.props.item.replyNum
                        )
                    ), 
                    this.nodeDom(this.props.pageUrl)
                ), 
                React.createElement("div", {className: "k_itemList_title", style: this.getWidth(), href: this.props.item.postUrl}, 
                    this.props.item.title
                ), 
                React.createElement("a", {className: "k_itemList_QR"}, 
                    React.createElement("i", {className: "fa fa-qrcode fa-2x"})
                )
            )
            )
    }
});
var List = React.createClass({displayName: "List",
    morePost: function () {
        if(this.props.pageUrl['nodeName'] != "" ||this.props.pageUrl['isRecent'] != -1){
            if(this.props.pageUrl['searchText'] == "" ||this.props.pageUrl['searchText'] == "1"){
                //第一页
                return(
                React.createElement("li", null, 
                    React.createElement("a", {className: "k_itemList_more", href: this.props.pageUrl['pureUrl'] +'?p=2'}, "下一页")
                )
                )
            }else{
                return(
                 //第n页
                React.createElement("li", null, 
                    React.createElement("a", {className: "k_itemList_more", href: this.props.pageUrl['nodePageUrl'] +'='+ (parseInt(this.props.pageUrl['searchText']) - 1)}, "上一页"), 
                    React.createElement("a", {className: "k_itemList_more", href: this.props.pageUrl['nodePageUrl'] +'='+ (parseInt(this.props.pageUrl['searchText']) + 1)}, "下一页")
                )
                )
            }
        }else{
            return React.createElement("li", null, 
            React.createElement("a", {className: "k_itemList_more", href: "/recent"}, "更多新主题")
        )
        }

    },
    render: function () {
        var Dom = [];
        var url = this.props.pageUrl;
        var nodeName = this.props.nodeName;
        this.props.list.forEach(function (item) {
            Dom.push(React.createElement(ListItem, {item: item, pageUrl: url, nodeName: nodeName}));
        });
        return (
            React.createElement("ul", {id: "k_itemList_ul"}, 
                    Dom, 
                this.morePost()
            )
            )
    }
});

var SubNav = React.createClass({displayName: "SubNav",
    render: function () {
        var Dom = [];
        for (var i = 0; i < this.props.node.length; i++) {
            var temp = this.props.node[i];
            var tempUrl = $(temp).attr('href');
            var tempText = $(temp).text();
            Dom.push(React.createElement("a", {href: tempUrl}, tempText))
        }
        return React.createElement("div", {id: "k_subNav"}, Dom)
    }
});

var NodeList = React.createClass({displayName: "NodeList",
    render: function () {
        var Dom = []
    }
});

var MainPage = React.createClass({displayName: "MainPage",
    render: function () {
        return(
            React.createElement("div", {id: "k_itemList"}, 
                React.createElement("div", {id: "k_hover"}), 
                React.createElement(SubNav, {node: this.props.NodeData}), 
                React.createElement(List, {list: this.props.ListData, pageUrl: this.props.pageUrl, nodeName: this.props.NodeName})
            )
            )
    }
});

var TopList = React.createClass({displayName: "TopList",
    render: function () {
        var Dom = [];
        for (var i = 0; i < this.props.topList.length; i++) {
            var temp = this.props.topList[i];
            var tempUrl = $(temp).attr('href');
            var tempText = $(temp).text();
            Dom.push(React.createElement("a", {href: tempUrl}, tempText))
        }
        return(
            React.createElement("div", {id: "k_topList"}, 
                Dom
            )
            )
    }
});

var FastReader = React.createClass({displayName: "FastReader",
    render: function () {
        var domStyle = {
            'height': this.props.height + 15,
            'width': this.props.width
        };
        return(
            React.createElement("iframe", {frameBorder: "0", seamless: true, allowTransparency: "true", width: "100%", scrolling: "auto", style: domStyle, src: this.props.src}))
    }
});

var ReplyArea = React.createClass({displayName: "ReplyArea",
    render: function () {
        return(
            React.createElement("form", {method: "post", action: this.props.url}, 
                React.createElement("textarea", {name: "content", maxlength: "10000", class: "mll", id: "reply_content", style: "overflow: hidden; word-wrap: break-word; resize: horizontal; height: 112px;"}), 
                React.createElement("input", {type: "submit", value: "回复", class: "super normal button"})
            )
            )
    }
});

var NotificationItem = React.createClass({displayName: "NotificationItem",
    render: function (){
        return(
            React.createElement("li", null, 
                React.createElement("a", {className: "k_notifiList_avatar", href: this.props.item.userUrl}, 
                    React.createElement("img", {src: this.props.item.avatar})
                ), 
                React.createElement("div", {className: "k_notifiList_title", href: this.props.item.postUrl}, 
                    this.props.item.postName
                ), 
                React.createElement("div", {className: "k_notifiList_reply"}, 
                    this.props.item.reply
                )
            ))
    }
});

var Notification = React.createClass({displayName: "Notification",
    render: function () {
        var Dom = [];
        for (var i = 0; i < this.props.NotificationList.length; i++) {
            Dom.push(React.createElement(NotificationItem, {item: this.props.NotificationList[i]}))
        }
        return(
            React.createElement("ul", {id: "k_notifiList"}, 
                Dom
            )
            )
    }
});

var MakeQR = function(dom,url){
    $(dom).qrcode({width: 128,height: 128,text: 'http://v2ex.com'+url});
};


$(function () {
    if (self != top) {
        $('#Top,#Rightbar').css('display', 'none');
        $('#Wrapper').css('margin-left', '0');
        $("#Wrapper,#Main").css('width', '680px');
    }

    var userInfo = getUserInfo();
    React.render(
        React.createElement(Slide, {info: userInfo}),
        document.getElementById('Top')
    );

    var pageUrl = checkUrl();
    if (pageUrl['isList'] === true) {
        var listData = getList(pageUrl);
        var nodeData = $($($('#Main').children('.box')[0]).children('.cell')[0]).children('a');
        React.render(
            React.createElement(MainPage, {ListData: listData, NodeData: nodeData, pageUrl: pageUrl, NodeName: pageUrl['nodeName']}),
            document.getElementById('Main')
        );
    }
    if(pageUrl['isNotifi'] === true){
        var listData = getNotifications(pageUrl);
        React.render(
            React.createElement(Notification, {NotificationList: listData}),
            document.getElementById('Main')
        );
    }
    $('.k_itemList_title').click(function () {
        var url = $(this).attr('href');
        console.info();
        $(this).parent().addClass('k_itemList_choosen');
        React.render(
            React.createElement(FastReader, {width: '680px', height: $(window).height(), src: 'http://www.v2ex.com'+url}),
            document.getElementById('Rightbar')
        );
        $('#Rightbar').width('680px');
        var item_title = $(window).width() - 140 - 680 - 20 - 80 - 48 - 20 - 10 - 25;
        $('.k_itemList_title').css('width', item_title);
    });
     $('#k_notifiList li').click(function () {
        var url = $(this).children('.k_notifiList_title').attr('href');
        $(this).addClass('k_itemList_choosen');
        React.render(
            React.createElement(FastReader, {width: '680px', height: $(window).height(), src: url}),
            document.getElementById('Rightbar')
        );
        $('#Rightbar').width('680px');
        var item_title = $(window).width() - 140 - 680 - 20;
         $('#k_notifiList').css('width', item_title);
        console.info('11')
    });
    $('.k_itemList_QR').click(function(){
        var url = $(this).parent().children('.k_itemList_title').attr('href');
        var $hover = $('#k_hover');
        MakeQR($hover,url);
        var hoverCss = {
            "z-index":1000,
            "height":$(window).height(),
            "width":$(window).width()
        };
        $hover.css(hoverCss).click(function(){
            $('canvas').remove();
            $('#k_hover').css('z-index',-1);
        });
    });
});