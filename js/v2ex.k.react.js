/**
 * Created by JiaHao on 2015/4/14 0014.
 */

//    获取当前链接中所对应的信息
var checkUrl = function () {
    var pageUrl = {
        originUrl :window.location.href,
        isHttps: false,
        isIndex : false,
        isSetting: false,
        isNotification : false,
        isRecent : false,
        isTopic : false,
        isList:false,
        hostUrl : window.location.href,
        searchText : "",
        routeText :""
    };
//    判断https
    pageUrl['isHttps'] = ('https:' == document.location.protocol);

    var search = pageUrl['originUrl'].indexOf('?');
    if (search != -1) {
        //如果链接中有问号，获取等号之后的内容，获取问号之前的内容。
        var tempPosition = pageUrl['originUrl'].indexOf('=');
        pageUrl['searchText'] = pageUrl['originUrl'].slice(tempPosition+1);
        pageUrl['hostUrl'] = pageUrl['originUrl'].slice(0,search);
    }

    var hostUrl_last = pageUrl['hostUrl'].slice(-9);
//    判断是否在首页
    if(hostUrl_last === 'v2ex.com/'){
        pageUrl['isIndex'] = true;
    }

//    判断是否在设置页
    if(pageUrl['hostUrl'].indexOf('/settings') != -1){
        pageUrl['isSetting'] = true;
    }

//    判断是否在设置页
    if(pageUrl['hostUrl'].indexOf('/notifications') != -1){
        pageUrl['isSetting'] = true;
    }

//    判断是否在最新页
    if(pageUrl['hostUrl'].indexOf('/recent') != -1){
        pageUrl['isRecent'] = true;
    }

//  判断是否在话题页
    if(pageUrl['hostUrl'].indexOf('/go/') != -1){
        pageUrl['isTopic'] = true;
        pageUrl['routeText'] = pageUrl['hostUrl'].split('/').pop();
    }

    pageUrl['isList'] = pageUrl['isIndex']||pageUrl['isRecent']||pageUrl['isTopic'];

    console.info(pageUrl);
    return pageUrl
};

var getList = function (pageUrl) {
    var itemList = [];
    var $itemDom;
    if (pageUrl['isTopic']) {
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

var SideBar = React.createClass({displayName: "SideBar",
    favorite:function(){
        if(this.props.pageUrl['isTopic']){
            return React.createElement("a", {href: ""}, React.createElement("i", {className: "fa fa-heart"}))
        }
    },
    newPost : function(){
        var href = "/new/";
        if(this.props.pageUrl['isTopic']){
            href = "/new/"+this.props.pageUrl['routeText'];
        }
        return(React.createElement("a", {href: href, title: "新主题"}, React.createElement("i", {className: "fa fa-pencil-square-o fa-2x"}), React.createElement("span", null, "新主题")))
    },
    render: function () {
        var aClassName = 'k_color_hover';
        return(
            React.createElement("div", {id: "k_sidebar"}, 
                React.createElement("div", {id: "k_navbar"}, 
                    React.createElement("a", {id: "k_avatar", href: '/member/' + this.props.userInfo.userName}, 
                        React.createElement("img", {src: this.props.userInfo.userAvatar}), React.createElement("span", null, this.props.userInfo.userName)
                    ), 
                    React.createElement("a", {href: "/notifications", title: "提醒"}, 
                        React.createElement("i", {className: "fa fa-bell fa-2x"}), React.createElement("span", null, "提醒")
                    ), 
                    React.createElement("a", {href: "/", title: "首页"}, 
                        React.createElement("i", {className: "fa fa-home fa-2x"}), React.createElement("span", null, "首页")
                    ), 
                    this.newPost(), 
                    React.createElement("a", {href: "/planes", title: "节点"}, 
                        React.createElement("i", {className: "fa fa-th fa-2x"}), React.createElement("span", null, "节点")
                    ), 
                    React.createElement("a", {href: "//workspace.v2ex.com/", target: "_blank", title: "工作空间"}, 
                        React.createElement("i", {className: "fa fa-laptop fa-2x"}), React.createElement("span", null, "工作空间")
                    ), 
                    React.createElement("a", {href: "/notes", title: "笔记"}, 
                        React.createElement("i", {className: "fa fa-book fa-2x"}), React.createElement("span", null, "笔记")
                    ), 
                    React.createElement("a", {href: "/t", title: "时间轴"}, 
                        React.createElement("i", {className: "fa fa-list-alt fa-2x"}), React.createElement("span", null, "时间轴")
                    ), 
                    React.createElement("a", {href: "/events", title: "事件"}, 
                        React.createElement("i", {className: "fa fa-eye fa-2x"}), React.createElement("span", null, "事件")
                    ), 
                    React.createElement("a", {href: '/place/' + this.props.userInfo.ip, title: "附近"}, 
                        React.createElement("i", {className: "fa fa-map-marker fa-2x"}), React.createElement("span", null, "附近")
                    ), 
                    React.createElement("a", {href: "/settings", title: "设置"}, 
                        React.createElement("i", {className: "fa fa-cog fa-2x"}), React.createElement("span", null, "设置")
                    ), 
                    React.createElement("a", {href: "#;", onclick: "if (confirm('确定要从 V2EX 登出？')) { location.href= '/signout'; }", title: "退出"}, 
                        React.createElement("i", {className: "fa fa-sign-out fa-2x"}), React.createElement("span", null, "退出")
                    )
                ), 

                React.createElement("div", {id: "k_tabbar"}, 
                    this.favorite(), 
                    React.createElement("a", {href: "/?tab=all"}, "全部"), 
                    React.createElement("a", {href: "/?tab=tech"}, "技术"), 
                    React.createElement("a", {href: "/?tab=creative"}, "创意"), 
                    React.createElement("a", {href: "/?tab=play"}, "好玩"), 
                    React.createElement("a", {href: "/?tab=apple"}, "Apple"), 
                    React.createElement("a", {href: "/?tab=jobs"}, "酷工作"), 
                    React.createElement("a", {href: "/?tab=deals"}, "交易"), 
                    React.createElement("a", {href: "/?tab=city"}, "城市"), 
                    React.createElement("a", {href: "/?tab=qna"}, "问与答"), 
                    React.createElement("a", {href: "/?tab=hot"}, "最热"), 
                    React.createElement("a", {href: "/?tab=r2"}, "R2"), 
                    React.createElement("a", {href: "/?tab=nodes"}, "节点"), 
                    React.createElement("a", {href: "/?tab=members"}, "关注")
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
        if (!pageUrl['isTopic']) {
            return React.createElement("span", null, this.props.item.nodeText);
        } else {
            return React.createElement("span", null, this.props.nodeName);
        }
    },
    getWidth: function () {
        var width = $(window).width() - 140 - 680 - 20 - 48 - 20 - 10 - 10 -25 -23;
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
                    React.createElement("a", {className: 'k_itemList_vote ' + this.voteClassName(this.props.item.vote)}, 
                        React.createElement("span", null, 
                            React.createElement("i", {className: "fa fa-chevron-up"}), this.props.item.vote
                        )
                    ), 
                    React.createElement("a", {className: "k_itemList_reply"}, 
                        React.createElement("span", null, 
                            React.createElement("i", {className: "fa fa-reply"}), this.props.item.replyNum
                        )
                    ), 
                    React.createElement("a", {className: "k_itemList_node", href: this.props.item.nodeUrl}, this.nodeDom(this.props.pageUrl))

                ), 
                React.createElement("div", {className: "k_itemList_title", style: this.getWidth(), href: this.props.item.postUrl}, 
                    this.props.item.title
                )
            )
            )
    }
});
var List = React.createClass({displayName: "List",
    morePost: function () {
        if(this.props.pageUrl['isTopic']||this.props.pageUrl['isRecent']){
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

var MainPage = React.createClass({displayName: "MainPage",
    getWidth: function () {
        var width = $(window).width() - 140 - 680;
        return {
            width: width
        };
    },
    render: function () {
        return(
            React.createElement("div", {id: "k_itemList", style: this.getWidth()}, 
                React.createElement("div", {id: "k_hover"}), 
                React.createElement(SubNav, {node: this.props.NodeData}), 
                React.createElement(List, {list: this.props.ListData, pageUrl: this.props.pageUrl, nodeName: this.props.NodeName})
            )
            )
    }
});



var Container = React.createClass({displayName: "Container",
    render: function () {
        if (self == top) {
            return(
                React.createElement("div", {id: "k_container"}, 
                    React.createElement(SideBar, {userInfo: this.props.userInfo, pageUrl: this.props.pageUrl}), 
                    React.createElement("div", {id: "k_main"}), 
                    React.createElement("div", {id: "k_faster"})
                )
                )
        }else{
            return(
            React.createElement("div", {id: "k_container"}, 
                 React.createElement("div", {id: "k_faster"})
            )
            )
        }
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
    var userInfo = getUserInfo();
    var pageUrl = checkUrl();
    var listData,nodeData;
    if (pageUrl['isList']) {
        listData = getList(pageUrl);
        nodeData = $($($('#Main').children('.box')[0]).children('.cell')[0]).children('a');
    }
    var mainDom = $('#Main').html();

    React.render(
        React.createElement(Container, {userInfo: userInfo, pageUrl: pageUrl}),
        document.body
    );

    console.info(mainDom);


    if (pageUrl['isList']) {
        React.render(
            React.createElement(MainPage, {ListData: listData, NodeData: nodeData, pageUrl: pageUrl, NodeName: pageUrl['nodeName']}),
            document.getElementById('k_main')
        );
    }else{
        console.info('ss');
        $('#k_main').html(mainDom);
    }


    $('.k_itemList_title').click(function () {
        var url = $(this).attr('href');
        $(this).parent().addClass('k_itemList_choosen');

        React.render(
            React.createElement(FastReader, {width: '680px', height: $(window).height(), src: 'http://www.v2ex.com'+url}),
            document.getElementById('k_faster')
        );
    });
//     $('#k_notifiList li').click(function () {
//        var url = $(this).children('.k_notifiList_title').attr('href');
//        $(this).addClass('k_itemList_choosen');
//
//        React.render(
//            <FastReader width={'680px'} height={$(window).height()} src={url}/>,
//            document.getElementById('k_faster')
//        );
//
//        $('#Rightbar').width('680px');
//        var item_title = $(window).width() - 140 - 680 - 20;
//         $('#k_notifiList').css('width', item_title);
//    });
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