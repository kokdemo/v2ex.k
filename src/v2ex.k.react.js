/**
 * Created by JiaHao on 2015/4/14 0014.
 */

var checkUrl = function(){
    var pageUrl = window.location.href;
    var search = pageUrl.indexOf('?');
    if (search != -1) {
        pageUrl = pageUrl.slice(0, search)
    }
    return pageUrl
};
var getList = function (pageUrl) {
    var itemList = [];
    var $itemDom;
    if (pageUrl.indexOf('/go/') != -1) {
        $itemDom = $('#TopicsNode').children('.cell')
    } else {
        $itemDom = $('.cell.item');
    }
    for (var i = 0, len = $itemDom.length; i < len; i++) {
        var tempItem = {};
        var top = $($itemDom[i]).children('div').children('img');
        if (!top.length) {
            //被置顶
            tempItem['top'] = true;
        } else {
            tempItem['top'] = false;
        }
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
        tempItem['replyNum']= $(info[3]).children('a').text();
        if (tempItem['replyNum'] == '') {
            tempItem['replyNum'] = 0
        }
        itemList.push(tempItem);
    }
    return itemList
};

var getUserInfo = function(){
    var userInfo = {};
    var $Dom = $($('#Rightbar').children('.box')[0]);
    var userDom = $Dom.children('.cell:first').children('table:first').children('tbody').children('tr').children();
    var collectDom = $Dom.children('.cell:first').children('table:last tbody tr');
    userInfo['notiNum'] = $Dom.children('.inner').children('a').text().slice(0,-6);
    userInfo['userName'] = $(userDom[2]).children('.bigger').children('a').text();
    userInfo['userMotto'] = $(userDom[2]).children('.fade').text();


};
var Slide = React.createClass({
    render: function () {
        var aClassName = 'top k_color_hover';
        return(
            <div >
                <div id="k_navbar" classNameName="bars k_color_dark">
                    <a id="avatar" href="http://www.v2ex.com/member/kokdemo" className={aClassName}>
                        <img src="//cdn.v2ex.com/avatar/73ea/e46e/12387_large.png?m=1348128895"/>
                    </a>
                    <a href="http://www.v2ex.com/notifications" className={aClassName}>
                        <i className="fa fa-bell fa-2x" title="提醒"></i>
                    </a>
                    <a href="/" className={aClassName} title="首页">
                        <i className="fa fa-home fa-2x"></i>
                    </a>
                    <a href="http://www.v2ex.com/new" className={aClassName} title="新主题">
                        <i className="fa fa-pencil-square-o fa-2x"></i>
                    </a>
                    <a href="https://workspace.v2ex.com/" target="_blank" className={aClassName} title="工作空间">
                        <i className="fa fa-laptop fa-2x"></i>
                    </a>
                    <a href="/notes" className={aClassName}>
                        <i className="fa fa-book fa-2x" title="笔记"></i>
                    </a>
                    <a href="/t" className={aClassName}>
                        <i className="fa fa-list-alt fa-2x" title="时间轴"></i>
                    </a>
                    <a href="/events" className={aClassName} title="事件">
                        <i className="fa fa-eye fa-2x"></i>
                    </a>
                    <a href="/place/106.185.35.124" className={aClassName} title="附近">
                        <i className="fa fa-map-marker fa-2x"></i>
                    </a>
                    <a href="/settings" className={aClassName} title="设置">
                        <i className="fa fa-cog fa-2x"></i>
                    </a>
                    <a href="#;" onclick="if (confirm('确定要从 V2EX 登出？')) { location.href= '/signout?once=29670'; }" className={aClassName}>
                        <i className="fa fa-sign-out fa-2x" title="退出"></i>
                    </a>
                </div>

                <div id="k_tabbar" className="bars k_color_light">
                    <a href="/?tab=tech" className="tab k_color_hover">技术</a>
                    <a href="/?tab=creative" className="tab k_color_hover">创意</a>
                    <a href="/?tab=play" className="tab k_color_hover">好玩</a>
                    <a href="/?tab=apple" className="tab k_color_hover">Apple</a>
                    <a href="/?tab=jobs" className="tab k_color_hover">酷工作</a>
                    <a href="/?tab=deals" className="tab k_color_hover">交易</a>
                    <a href="/?tab=city" className="tab k_color_hover">城市</a>
                    <a href="/?tab=qna" className="tab k_color_hover">问与答</a>
                    <a href="/?tab=hot" className="tab k_color_hover">最热</a>
                    <a href="/?tab=all" className="tab_current k_color_hover">全部</a>
                    <a href="/?tab=r2" className="tab k_color_hover">R2</a>
                    <a href="/?tab=nodes" className="tab k_color_hover">节点</a>
                    <a href="/?tab=members" className="tab k_color_hover">关注</a>
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
        } else if (voteNum < 5) {
            className = 'blue'
        } else if (voteNum < 10) {
            className = 'green'
        } else if (voteNum < 20) {
            className = 'yellow'
        } else {
            className = 'red'
        }
        return className
    },
    nodeDom: function (pageUrl) {
        var pageUrl = window.location.href;
        var search = pageUrl.indexOf('?');
        if (search != -1) {
            pageUrl = pageUrl.slice(0, search)
        }
        console.info(pageUrl);
        if (pageUrl.indexOf('/go/') == -1) {
            return <span className='k_itemList_node'>{this.props.item.nodeText}</span>;
        }else{
            return ""
        }
    },
    render: function () {
        return(
            <li>
                <div className='k_itemList_node_vote'>
                    <span className={'k_itemList_vote ' + this.voteClassName(this.props.item.vote)}><i className="fa fa-chevron-up"></i>{this.props.item.vote}</span>
                    <span className='k_itemList_reply'><i className="fa fa-reply"></i>{this.props.item.replyNum}</span>
                    {this.nodeDom(this.props.pageUrl)}
                </div>
                <a className='k_itemList_avatar' href= {this.props.item.userUrl}>
                    <img src={this.props.item.avatar}/>
                </a>
                <a className='k_itemList_title' href={this.props.item.postUrl}>

                    <span>{this.props.item.title}</span>
                </a>
            </li>
            )
    }
});
var List = React.createClass({
    render: function () {
        var Dom = [];
        var url = this.props.pageUrl;
        this.props.list.forEach(function (item) {
            Dom.push(<ListItem item = {item} pageUrl={url}/>);
        });
        return (
            <ul id= 'k_itemList_ul'>
                    {Dom}
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
        ;
        return <div id='k_subNav'>{Dom}</div>
    }
});
var NodeList = React.createClass({
    render: function () {
        var Dom = []
    }
});
var MainPage = React.createClass({
    render: function () {
        return(
            <div id='k_itemList'>
                <SubNav node={this.props.NodeData} />
                <List list={this.props.ListData} pageUrl={this.props.pageUrl}/>
            </div>
            )
    }
});
$(function () {

    React.render(
        <Slide />,
        document.getElementById('Top')
    );

    var pageUrl = checkUrl();
    if (pageUrl == 'http://www.v2ex.com/' || pageUrl == 'https://www.v2ex.com/' || pageUrl.indexOf('/go/') != -1) {
        var listData = getList(pageUrl);
        var nodeData = $($($('#Main').children('.box')[0]).children('.cell')[0]).children('a');
        React.render(<MainPage ListData={listData} NodeData={nodeData} pageUrl={pageUrl}/>, document.getElementById('Main'));
    }

});