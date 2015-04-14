/**
 * Created by JiaHao on 2015/4/14 0014.
 */
$(function () {
    var Slide = React.createClass({displayName: "Slide",
        render: function () {
            var aClassName = 'top k_color_hover';
            return(
                React.createElement("div", null, 
                    React.createElement("div", {id: "k_navbar", classNameName: "bars k_color_dark"}, 
                        React.createElement("a", {id: "avater", href: "http://www.v2ex.com/member/kokdemo", className: aClassName}, 
                            React.createElement("img", {src: "//cdn.v2ex.com/avatar/73ea/e46e/12387_large.png?m=1348128895"})
                        ), 
                        React.createElement("a", {href: "http://www.v2ex.com/notifications", className: aClassName}, 
                            React.createElement("i", {className: "fa fa-bell fa-2x", title: "提醒"})
                        ), 
                        React.createElement("a", {href: "/", className: aClassName, title: "首页"}, 
                            React.createElement("i", {className: "fa fa-home fa-2x"})
                        ), 
                        React.createElement("a", {href: "http://www.v2ex.com/new", className: aClassName, title: "新主题"}, 
                            React.createElement("i", {className: "fa fa-pencil-square-o fa-2x"})
                        ), 
                        React.createElement("a", {href: "https://workspace.v2ex.com/", target: "_blank", className: aClassName, title: "工作空间"}, 
                            React.createElement("i", {className: "fa fa-laptop fa-2x"})
                        ), 
                        React.createElement("a", {href: "/notes", className: aClassName}, 
                            React.createElement("i", {className: "fa fa-book fa-2x", title: "笔记"})
                        ), 
                        React.createElement("a", {href: "/t", className: aClassName}, 
                            React.createElement("i", {className: "fa fa-list-alt fa-2x", title: "时间轴"})
                        ), 
                        React.createElement("a", {href: "/events", className: aClassName, title: "事件"}, 
                            React.createElement("i", {className: "fa fa-eye fa-2x"})
                        ), 
                        React.createElement("a", {href: "/place/106.185.35.124", className: aClassName, title: "附近"}, 
                            React.createElement("i", {className: "fa fa-map-marker fa-2x"})
                        ), 
                        React.createElement("a", {href: "/settings", className: aClassName, title: "设置"}, 
                            React.createElement("i", {className: "fa fa-cog fa-2x"})
                        ), 
                        React.createElement("a", {href: "#;", onclick: "if (confirm('确定要从 V2EX 登出？')) { location.href= '/signout?once=29670'; }", className: aClassName}, 
                            React.createElement("i", {className: "fa fa-sign-out fa-2x", title: "退出"})
                        )
                    ), 

                    React.createElement("div", {id: "k_tabbar", className: "bars k_color_light"}, 
                        React.createElement("a", {href: "/?tab=tech", className: "tab k_color_hover"}, "技术"), 
                        React.createElement("a", {href: "/?tab=creative", className: "tab k_color_hover"}, "创意"), 
                        React.createElement("a", {href: "/?tab=play", className: "tab k_color_hover"}, "好玩"), 
                        React.createElement("a", {href: "/?tab=apple", className: "tab k_color_hover"}, "Apple"), 
                        React.createElement("a", {href: "/?tab=jobs", className: "tab k_color_hover"}, "酷工作"), 
                        React.createElement("a", {href: "/?tab=deals", className: "tab k_color_hover"}, "交易"), 
                        React.createElement("a", {href: "/?tab=city", className: "tab k_color_hover"}, "城市"), 
                        React.createElement("a", {href: "/?tab=qna", className: "tab k_color_hover"}, "问与答"), 
                        React.createElement("a", {href: "/?tab=hot", className: "tab k_color_hover"}, "最热"), 
                        React.createElement("a", {href: "/?tab=all", className: "tab_current k_color_hover"}, "全部"), 
                        React.createElement("a", {href: "/?tab=r2", className: "tab k_color_hover"}, "R2"), 
                        React.createElement("a", {href: "/?tab=nodes", className: "tab k_color_hover"}, "节点"), 
                        React.createElement("a", {href: "/?tab=members", className: "tab k_color_hover"}, "关注")
                    )
                )
                );
        }
    });
    React.render(
        React.createElement(Slide, null),
        document.getElementById('Top')
    );
    var getList = function () {
        var itemList = [];
        var $itemDom = $('.cell.item');
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
            tempItem['avater'] = $(info[0]).children('a').children('img').attr('src');
            tempItem['title'] = $(info[2]).children('.item_title').text();
            tempItem['vote'] = $(info[2]).children('.small.fade').children('.votes').text();
            tempItem['nodeUrl'] = $(info[2]).children('.small.fade').children('.node').attr('href');
            tempItem['nodeText'] = $(info[2]).children('.small.fade').children('.node').text();
            tempItem['lastReply'] = $($(info[2]).children('.small.fade').children('strong')[1]).children('a').attr('href');
            itemList.push(tempItem);
        }
        return itemList
    };
    var ListItem = React.createClass({displayName: "ListItem",
        render: function(){
            return(
                React.createElement("li", null, 
                    React.createElement("h4", null, this.props.title)
                )
            )
        }
    });
    var List = React.createClass({displayName: "List",
        render : function(){
            var Dom = [];
            this.props.list.forEach(function(item) {
                Dom.push(React.createElement(ListItem, {title: item.title}));
            });
            return (
                React.createElement("ul", null, 
                    Dom
                )
            )
        }
    });
    var ListData = getList();
    React.render(React.createElement(List, {list: ListData}), document.getElementsByClassName('box'));
});