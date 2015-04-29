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

var SideBar = React.createClass({
    favorite:function(){
        if(this.props.pageUrl['isTopic']){
            return <a href=""><i className="fa fa-heart"></i></a>
        }
    },
    newPost : function(){
        var href = "/new/";
        if(this.props.pageUrl['isTopic']){
            href = "/new/"+this.props.pageUrl['routeText'];
        }
        return(<a href={href} title="新主题"><i className="fa fa-pencil-square-o fa-2x"></i></a>)
    },
    render: function () {
        var DomStyle = {
            height: $(window).height()
        };
        var aClassName = 'k_color_hover';
        return(
            <div id="k_sidebar">
                <div id="k_navbar" style={DomStyle} className="k_color_dark">
                    <a id="avatar" href={'/member/' + this.props.info.userName} >
                        <img src={this.props.info.userAvatar}/>
                    </a>
                    <a href="/notifications" title="提醒">
                        <i className="fa fa-bell fa-2x" ></i>{this.props.info.notiNum}
                    </a>
                    <a href="/"  title="首页">
                        <i className="fa fa-home fa-2x"></i>
                    </a>
                    {this.newPost()}
                    <a href="/planes"  title="节点">
                        <i className="fa fa-th fa-2x"></i>
                    </a>
                    <a href="//workspace.v2ex.com/" target="_blank"  title="工作空间">
                        <i className="fa fa-laptop fa-2x"></i>
                    </a>
                    <a href="/notes"  title="笔记">
                        <i className="fa fa-book fa-2x" ></i>
                    </a>
                    <a href="/t"  title="时间轴">
                        <i className="fa fa-list-alt fa-2x" ></i>
                    </a>
                    <a href="/events"  title="事件">
                        <i className="fa fa-eye fa-2x"></i>
                    </a>
                    <a href={'/place/' + this.props.info.ip}  title="附近">
                        <i className="fa fa-map-marker fa-2x"></i>
                    </a>
                    <a href="/settings"  title="设置">
                        <i className="fa fa-cog fa-2x"></i>
                    </a>
                    <a href="#;" onclick="if (confirm('确定要从 V2EX 登出？')) { location.href= '/signout'; }"  title="退出">
                        <i className="fa fa-sign-out fa-2x" ></i>
                    </a>
                </div>

                <div id="k_tabbar" className="k_color_light">
                    {this.favorite()}
                    <a href="/?tab=all" >全部</a>
                    <a href="/?tab=tech" >技术</a>
                    <a href="/?tab=creative" >创意</a>
                    <a href="/?tab=play" >好玩</a>
                    <a href="/?tab=apple" >Apple</a>
                    <a href="/?tab=jobs" >酷工作</a>
                    <a href="/?tab=deals" >交易</a>
                    <a href="/?tab=city" >城市</a>
                    <a href="/?tab=qna" >问与答</a>
                    <a href="/?tab=hot" >最热</a>
                    <a href="/?tab=r2" >R2</a>
                    <a href="/?tab=nodes" >节点</a>
                    <a href="/?tab=members" >关注</a>
                </div>
            </div>
            );
    }
});

var ListItem = React.createClass({
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
            return <span >{this.props.item.nodeText}</span>;
        } else {
            return <span >{this.props.nodeName}</span>;
        }
    },
    getWidth: function () {
        var width = $(window).width() - 140 - 290 - 20 - 80 - 48 - 20 - 10 - 10 -25;
        return {
            width: width
        };
    },

    render: function () {
        return(
            <li>
                <a className='k_itemList_avatar' href= {this.props.item.userUrl}>
                    <img src={this.props.item.avatar}/>
                </a>
                <div className='k_itemList_node_vote'>
                    <a className={'k_itemList_vote ' + this.voteClassName(this.props.item.vote)}>
                        <span >
                            <i className="fa fa-chevron-up"></i>{this.props.item.vote}
                        </span>
                    </a>
                    <a  className='k_itemList_reply'>
                        <span >
                            <i className="fa fa-reply"></i>{this.props.item.replyNum}
                        </span>
                    </a>
                    <a className='k_itemList_node' href={this.props.item.nodeUrl}>{this.nodeDom(this.props.pageUrl)}</a>

                </div>
                <div className='k_itemList_title' style = {this.getWidth()} href={this.props.item.postUrl}>
                    {this.props.item.title}
                </div>
            </li>
            )
    }
});
var List = React.createClass({
    morePost: function () {
        if(this.props.pageUrl['isTopic']||this.props.pageUrl['isRecent']){
            if(this.props.pageUrl['searchText'] == "" ||this.props.pageUrl['searchText'] == "1"){
                //第一页
                return(
                <li>
                    <a className ='k_itemList_more' href={this.props.pageUrl['pureUrl'] +'?p=2'}>下一页</a>
                </li>
                )
            }else{
                return(
                 //第n页
                <li>
                    <a className ='k_itemList_more' href={this.props.pageUrl['nodePageUrl'] +'='+ (parseInt(this.props.pageUrl['searchText']) - 1)}>上一页</a>
                    <a className ='k_itemList_more' href={this.props.pageUrl['nodePageUrl'] +'='+ (parseInt(this.props.pageUrl['searchText']) + 1)}>下一页</a>
                </li>
                )
            }
        }else{
            return <li>
            <a className ='k_itemList_more' href="/recent">更多新主题</a>
        </li>
        }

    },
    render: function () {
        var Dom = [];
        var url = this.props.pageUrl;
        var nodeName = this.props.nodeName;
        this.props.list.forEach(function (item) {
            Dom.push(<ListItem item = {item} pageUrl={url} nodeName = {nodeName}/>);
        });
        return (
            <ul id= 'k_itemList_ul'>
                    {Dom}
                {this.morePost()}
            </ul>
            )
    }
});

var SubNav = React.createClass({
    render: function () {
        var Dom = [];
        for (var i = 0; i < this.props.node.length; i++) {
            var temp = this.props.node[i];
            var tempUrl = $(temp).attr('href');
            var tempText = $(temp).text();
            Dom.push(<a href={tempUrl}>{tempText}</a>)
        }
        return <div id='k_subNav'>{Dom}</div>
    }
});

var MainPage = React.createClass({
    render: function () {
        return(
            <div id='k_itemList'>
                <div id='k_hover'></div>
                <SubNav node={this.props.NodeData} />
                <List list={this.props.ListData} pageUrl={this.props.pageUrl} nodeName = {this.props.NodeName}/>
            </div>
            )
    }
});

var TopList = React.createClass({
    render: function () {
        var Dom = [];
        for (var i = 0; i < this.props.topList.length; i++) {
            var temp = this.props.topList[i];
            var tempUrl = $(temp).attr('href');
            var tempText = $(temp).text();
            Dom.push(<a href={tempUrl}>{tempText}</a>)
        }
        return(
            <div id='k_topList'>
                {Dom}
            </div>
            )
    }
});

var FastReader = React.createClass({
    render: function () {
        var domStyle = {
            'height': this.props.height + 15,
            'width': this.props.width
        };
        return(
            <iframe frameBorder='0' seamless allowTransparency="true" width="100%" scrolling="auto" style={domStyle} src={this.props.src}></iframe>)
    }
});

var ReplyArea = React.createClass({
    render: function () {
        return(
            <form method="post" action={this.props.url}>
                <textarea name="content" maxlength="10000" class="mll" id="reply_content" style="overflow: hidden; word-wrap: break-word; resize: horizontal; height: 112px;"></textarea>
                <input type="submit" value="回复" class="super normal button" />
            </form>
            )
    }
});

var NotificationItem = React.createClass({
    render: function (){
        return(
            <li>
                <a className='k_notifiList_avatar' href= {this.props.item.userUrl}>
                    <img src={this.props.item.avatar}/>
                </a>
                <div className='k_notifiList_title' href={this.props.item.postUrl}>
                    {this.props.item.postName}
                </div>
                <div className='k_notifiList_reply'>
                    {this.props.item.reply}
                </div>
            </li>)
    }
});

var Notification = React.createClass({
    render: function () {
        var Dom = [];
        for (var i = 0; i < this.props.NotificationList.length; i++) {
            Dom.push(<NotificationItem item ={this.props.NotificationList[i]} />)
        }
        return(
            <ul id='k_notifiList'>
                {Dom}
            </ul>
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
    var pageUrl = checkUrl();

    React.render(
        <SideBar info={userInfo} pageUrl={pageUrl}/>,
        document.getElementById('Top')
    );

    var listData,nodeData;
    if (pageUrl['isList'] === true) {
        listData = getList(pageUrl);
        nodeData = $($($('#Main').children('.box')[0]).children('.cell')[0]).children('a');
        React.render(
            <MainPage ListData={listData} NodeData={nodeData} pageUrl={pageUrl} NodeName = {pageUrl['nodeName']}/>,
            document.getElementById('Wrapper')
        );
    }else if(pageUrl['isNotifi'] === true){
        listData = getNotifications(pageUrl);
        React.render(
            <Notification NotificationList={listData}/>,
            document.getElementById('Wrapper')
        );
    }else{
        $('#Main').width('680px').css('margin-bottom','155px');
    }


    $('.k_itemList_title').click(function () {
        var url = $(this).attr('href');
        $(this).parent().addClass('k_itemList_choosen');

        React.render(
            <FastReader width={'680px'} height={$(window).height()} src={'http://www.v2ex.com'+url}/>,
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
            <FastReader width={'680px'} height={$(window).height()} src={url}/>,
            document.getElementById('Rightbar')
        );

        $('#Rightbar').width('680px');
        var item_title = $(window).width() - 140 - 680 - 20;
         $('#k_notifiList').css('width', item_title);
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