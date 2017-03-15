/*
    基本的dom结构
    k-container -
        k-navbar 导航栏
            k-avatar 用户头像和名称 需要存到localstorage里面，便于在取不到的时候使用
            k-navbar-item 导航项目，基本是一个链接，用vue-href简化dom；内部的数据可以直接写死。
                icon 导航标志
                span 导航名称
        k-tabbar 快捷访问栏 做成一直显示，这样比较ui比较统一
            span 快捷访问名称 用vue-href简化dom
        k-main 页面主体
            *k-forum 论坛主体
                *k-nodebar 子节点导航条
                    span 子节点导航条 用vue-href
                k-list 论坛帖子列表
                    k-list-item 列表中的li
                        k-list-item-avatar 发帖人头像
                        k-list-item-title 发帖标题
                        k-list-item-node 发帖节点名
                        k-list-item-author 发帖人名称
                        k-list-item-reply 发帖回复数
            k-iframe 内嵌浏览区域
            *直接页面原有dom
*/
/* 模板部分 */

/* 导航栏部分 */
var k_navbar = Vue.extend({
    props: ['data'],
    data: function () {
        if (route.login) {
            return ({
                navbarItems: [{
                        navbarText: '首页',
                        navbarUrl: '/',
                        navbarIcon: 'fa fa-home'
                    }, {
                        navbarText: '提醒',
                        navbarUrl: '/notifications',
                        navbarIcon: 'fa fa-bell'
                    }, {
                        navbarText: '新主题',
                        navbarUrl: '/new',
                        navbarIcon: 'fa fa-pencil-square-o'
                    }, {
                        navbarText: '搜索',
                        navbarUrl: 'https://www.google.com.hk/search?q=site:v2ex.com/t',
                        navbarIcon: 'fa fa-search'
                    },
                    {
                        navbarText: '奖励',
                        navbarUrl: '/mission/daily',
                        navbarIcon: 'fa fa-money'
                    }, {
                        navbarText: '节点',
                        navbarUrl: '/planes',
                        navbarIcon: 'fa fa-th'
                    }, {
                        navbarText: '笔记',
                        navbarUrl: '/notes',
                        navbarIcon: 'fa fa-book'
                    }, {
                        navbarText: '时间轴',
                        navbarUrl: '/t',
                        navbarIcon: 'fa fa-list-alt'
                    }, {
                        navbarText: '设置',
                        navbarUrl: '/settings',
                        navbarIcon: 'fa fa-cog'
                    },
                    {
                        navbarText: '退出',
                        navbarUrl: '/signout',
                        navbarIcon: 'fa fa-sign-out'
                    }
                ]
            })
        } else {
            return ({
                navbarItems: [{
                    navbarText: '首页',
                    navbarUrl: '/',
                    navbarIcon: 'fa fa-home'
                }, {
                    navbarText: '注册',
                    navbarUrl: '/signup',
                    navbarIcon: 'fa fa-user'
                }, {
                    navbarText: '登录',
                    navbarUrl: '/signin',
                    navbarIcon: 'fa fa-sign-in'
                }]
            })
        }

    },
    components: {
        'k_navbar_item': {
            props: ['info'],
            template: '\
            <div class="k-navbar-item k-nav-hover" v-href="info.navbarUrl">\
                <i :class="info.navbarIcon"></i>\
                <span>{{info.navbarText}}</span>\
            </div>'
        },
        'k_navbar_config': {
            data: function () {
                return ({
                    info: {
                        navbarText: '主题',
                        navbarIcon: 'fa fa-paint-brush'
                    },
                    state: false,
                    themes: [{
                        name: '默认主题',
                        icon: 'fa fa-circle-o-notch',
                        theme: 'origin'
                    }, {
                        name: '亮主题',
                        icon: 'fa fa-sun-o',
                        theme: 'light'
                    }, {
                        name: '暗主题',
                        icon: 'fa fa-moon-o',
                        theme: 'dark'
                    }]
                })
            },
            methods: {
                model: function () {
                    this.state = !this.state;
                },
                switchTheme: function (name) {
                    var userInfo = JSON.parse(localStorage['v2ex.k']);
                    userInfo['theme'] = name;
                    localStorage['v2ex.k'] = JSON.stringify(userInfo);
                    location.reload()
                }
            },
            template: '\
            <div class="k-navbar-item k-nav-hover" v-on:click="model()">\
                <i :class="info.navbarIcon"></i>\
                <span>{{info.navbarText}}</span>\
            </div>\
            <div class="k-config" v-show="state">\
                <div v-for="item in themes" class="k-config-theme" v-on:click="switchTheme(item.theme)"><i :class="item.icon"></i>{{item.name}}</div>\
            </div>'
        },
        'k_avatar': {
            props: ['user'],
            data: function () {
                return ({
                    userUrl: route.origin + '/member/',
                    login: route.login
                })
            },
            template: '<div v-if="login" class="k-avatar k-nav-hover" v-href="userUrl+user.name">\
                <img :src="user.avatar" />\
                <span>{{user.name}}</span>\
            </div>'
        }
    },
    template: '\
    <div class="k-navbar k-nav-bg k-nav-text">\
        <k_avatar :user=data ></k_avatar>\
        <k_navbar_item v-for="item in navbarItems" :info="item"></k_navbar_item>\
        <k_navbar_config></k_navbar_config>\
    </div>'
})
Vue.component('k-navbar', k_navbar)

/* 快速导航部分 */

var k_tabbar = Vue.extend({
    data: function () {
        return ({
            tabbarItems: [{
                tabbarText: '全部',
                tabbarUrl: '/?tab=all',
                tabbar: 'all',
            }, {
                tabbarText: '技术',
                tabbarUrl: '/?tab=tech',
                tabbar: 'tech'
            }, {
                tabbarText: '创意',
                tabbarUrl: '/?tab=creative',
                tabbar: 'creative'
            }, {
                tabbarText: '好玩',
                tabbarUrl: '/?tab=play',
                tabbar: 'play'
            }, {
                tabbarText: 'Apple',
                tabbarUrl: '/?tab=apple',
                tabbar: 'apple'
            }, {
                tabbarText: '酷工作',
                tabbarUrl: '/?tab=jobs',
                tabbar: 'jobs'
            }, {
                tabbarText: '交易',
                tabbarUrl: '/?tab=deals',
                tabbar: 'deals'
            }, {
                tabbarText: '城市',
                tabbarUrl: '/?tab=city',
                tabbar: 'city'
            }, {
                tabbarText: '问与答',
                tabbarUrl: '/?tab=qna',
                tabbar: 'qna'
            }, {
                tabbarText: '最热',
                tabbarUrl: '/?tab=hot',
                tabbar: 'hot'
            }, {
                tabbarText: 'R2',
                tabbarUrl: '/?tab=r2',
                tabbar: 'r2'
            }, {
                tabbarText: '节点',
                tabbarUrl: '/?tab=nodes',
                tabbar: 'nodes'
            }, {
                tabbarText: '关注',
                tabbarUrl: '/?tab=members',
                tabbar: 'members'
            }],
            route: {
                tab: route.tab
            }
        })
    },
    components: {
        'k_tabbar_item': {
            props: ['info', 'route'],
            template: '<div class="k-tabbar-item k-tab-hover" v-bind:class="{active: info.tabbar == route.tab}" v-href="info.tabbarUrl">\
                <span>{{info.tabbarText}}</span>\
            </div>'
        }
    },
    template: '<div class="k-tabbar k-tab-text k-tab-bg">\
    <k_tabbar_item v-for="item in tabbarItems" :info="item" :route="route"></k_tabbar_item>\
    </div>'
})
Vue.component('k-tabbar', k_tabbar)

/* 列表和主体部分 */
var k_forum = Vue.extend({
    porps: ['nodebaritems', 'data', 'url'],
    data: function () {
        return ({
            listItems: getList(),
            iframeUrl: '',
            route: {
                topic: route.topic,
                node: route.node
            }
        })
    },
    components: {
        'k_list': {
            props: ['list', 'route'],
            template: '\
            <ul class="k-list k-list-border">\
                <li class="k-list-item" v-for="item in list" >\
                    <div class="k-list-item-title-reply">\
                        <span class="k-list-item-title k-list-text" v-on:click="open(item.url)">{{item.title}}</span>\
                        <span class="k-list-item-reply k-list-reply k-reply-list">{{item.reply}}</span>\
                    </div>\
                    <div class="k-list-item-infos k-list-text-2">\
                        <img class="k-list-item-avatar" :src="item.avatar" v-href="item.userUrl">\
                        <span class="k-list-item-user" v-href="item.userUrl">{{item.userName}}</span>\
                        <span class="k-list-item-node" v-href="item.node" v-if="!route.node"> &nbsp·&nbsp {{item.nodeText}}</span>\
                    </div>\
                </li>\
            </ul>',
            methods: {
                open: function (url) {
                    this.$parent.iframeUrl = url;
                }
            }
        },
        'k_page': {
            props: ['route'],
            data: function () {
                if (route.page === undefined) {
                    route.page = 1;
                }
                var isrecent = '';
                if (route.index) {
                    isrecent = 'recent'
                }
                return {
                    lastpage: route.pathname + '?p=' + (route.page - 1),
                    ifLastpage: (route.page - 1 > 0),
                    nextpage: route.pathname + isrecent + '?p=' + (route.page - 0 + 1)
                }
            },
            template: '\
            <div class="k-page ">\
                <span v-if="ifLastpage" v-href="lastpage">上一页</span>\
                <span class="k-page-next" v-href="nextpage">下一页</span>\
            </div>'
        },
        'k_frame': {
            props: ['url'],
            template: '<iframe :src=url class="k-frame k-iframe-bg"></iframe>'
        }
    },
    template: '\
    <div class="k-forum">\
        <div class="k-page-list k-list-bg k-list-text"><k_page :route="route"></k_page>\
        <k_list :list="listItems" :route="route"></k_list><k_page :route="route"></k_page></div>\
        <k_frame class="" :url="iframeUrl"></k_frame>\
    </div>'
})
Vue.component('k-forum', k_forum)

var k_main = Vue.extend({
    porps: ['list'],
    template: '<div class="k-main"><k-forum></k-forum></div>'
})
Vue.component('k-main', k_main)

/* 页面部分 */
function ready(fn) {
    if (document.addEventListener) { //标准浏览器
        document.addEventListener('DOMContentLoaded', function () {
            //注销时间，避免反复触发
            document.removeEventListener('DOMContentLoaded', arguments.callee, false);
            fn(); //执行函数
        }, false);
    } else if (document.attachEvent) { //IE浏览器
        document.attachEvent('onreadystatechange', function () {
            if (document.readyState == 'complete') {
                document.detachEvent('onreadystatechange', arguments.callee);
                fn(); //函数执行
            }
        });
    }
}

/* 预设函数*/

var getList = function () {
    var itemList = [];
    var $itemDom;
    if (route.node) {
        $itemDom = document.getElementById('TopicsNode').getElementsByClassName('cell');
    } else {
        $itemDom = document.getElementsByClassName('cell item');
    }
    var tempItem = {},
        top = '',
        info = '';
    for (var i = 0, len = $itemDom.length; i < len; i++) {
        tempItem['avatar'] = $itemDom[i].getElementsByTagName('img')[0].src;
        tempItem['userUrl'] = $itemDom[i].getElementsByTagName('a')[0].href;
        tempItem['userName'] = tempItem['userUrl'].split('/').pop();
        tempItem['url'] = $itemDom[i].getElementsByTagName('a')[1].href;
        tempItem['title'] = $itemDom[i].getElementsByTagName('a')[1].text;
        if (!route.node) {
            tempItem['node'] = $itemDom[i].getElementsByClassName('node')[0].href;
            tempItem['nodeText'] = $itemDom[i].getElementsByClassName('node')[0].text;
        }
        tempItem['reply'] = $itemDom[i].getElementsByClassName('count_livid')[0];
        if (tempItem['reply'] == undefined) {
            tempItem['reply'] = 0
        } else {
            tempItem['reply'] = tempItem['reply'].text
        }
        itemList.push(tempItem);
        tempItem = {};
    }
    return itemList
};

var version = '0.4';

var getUserInfo = function (route) {
    var userInfo = {};
    if (route.login) {
        //只有登录的时候才修改存储
        if (localStorage['v2ex.k'] !== undefined && route.login) {
            //将不太经常变化的信息存储到localStorage里面，当设置页面中点击保存时将整个删除初始化。
            userInfo = JSON.parse(localStorage['v2ex.k']);
        } else if (localStorage['v2ex.k'] === undefined) {
            //当前没有存储数据
            userInfo.name = document.getElementById("Rightbar").getElementsByTagName("a")[0].href.split("/member/")[1];
            userInfo.avatar = document.getElementById("Rightbar").getElementsByTagName("img")[0].src;
            userInfo.version = version;
            userInfo.theme = 'origin'
            localStorage['v2ex.k'] = JSON.stringify(userInfo);
        } else if (localStorage['v2ex.k'].version !== version || localStorage['v2ex.k'].version === version) {
            // 重置
            userInfo.name = document.getElementById("Rightbar").getElementsByTagName("a")[0].href.split("/member/")[1];
            userInfo.avatar = document.getElementById("Rightbar").getElementsByTagName("img")[0].src;
            userInfo.version = version;
            userInfo.theme = 'origin'
            localStorage['v2ex.k'] = JSON.stringify(userInfo);
        }
    } else {
        localStorage.removeItem('v2ex.k')
    }
    return userInfo
};

/* 数据获取部分 */
var dateinfo = new Date().getUTCDate();
var originHref = window.location.href;
var route = {};

ready(function () {
    var topDom = document.getElementsByClassName('top');
    route = {
        pathname: window.location.pathname,
        page: originHref.split('p=')[1],
        https: ('https:' == document.location.protocol),
        node: (originHref.indexOf('/go/') != -1),
        nodeText: (this.node ? document.title.split(' › ')[1] : false),
        topic: (originHref.indexOf('/t/') != -1),
        iframe: (self.frameElement && self.frameElement.tagName == "IFRAME"),
        index: (window.location.pathname == '/'),
        recent: (window.location.pathname == '/recent'),
        mytopics: (window.location.pathname == '/my/topics'),
        origin: window.location.origin,
        search: window.location.search,
        tab: (window.location.search.split('tab=')[1]),
        login: (topDom.length !== 3)
    };
    // console.info(route);
    var userData = getUserInfo(route);
    if (userData.theme == 'light') {
        document.body.className = 'k-light'
    } else if (userData.theme == 'dark') {
        document.body.className = 'k-dark'
    }

    if (!route.index && !route.node && !route.recent && !route.mytopics) {
        // 在非首页，recent，node页面中，展示原来的页面
        document.getElementById('Main').style.display = 'block';
    }
    if (!route.iframe) {
        // 调整原来页面的宽度和边距
        var content = document.getElementById('Wrapper').getElementsByClassName('content')[0];
        content.style.margin = '0 0 0 140px';
        content.style.maxWidth = 'none';
        content.style.zIndex = '10000';
    } else {
        var link = document.getElementsByTagName('a');
        for (var i = 0, len = link.length; i < len; i++) {
            if (link[i].rel == 'nofollow') {
                link[i].target = '_blank'
            }
        }
    }

    var vue = new Vue({
        el: "body",
        beforeCompile: function () {
            /* 总体部分 */
            Vue.component('k-container', {
                data: function () {
                    var originText = '';
                    var iforigin = false;
                    if (!route.index && !route.node && !route.recent && !route.mytopics) {
                        originText = 'origin';
                        iforigin = true;
                    }
                    return ({
                        userData: userData,
                        route: route,
                        origin: originText,
                        iforigin: iforigin
                    });
                },
                template: '<div class="k-container" v-bind:class="{origin:iforigin}" v-if="!route.iframe">\
                    <k-navbar :data="userData"></k-navbar>\
                    <k-tabbar></k-tabbar>\
                    <k-main v-if="route.index||route.node||route.recent||route.mytopics"></k-main>\
                </div>'
            })
            document.body.appendChild(document.createElement('k-container'));
        }
    });
})
