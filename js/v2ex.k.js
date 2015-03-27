$(function () {
    var navbar = $('#Top .content a');
    var newNavbar = "<div id='k_navbar' class='bars k_color_dark'></div><div id='k_infos' class='hiden'></div><div id='k_tabbar' class='bars k_color_light'></div>";

    var Rightbar = $("#Rightbar");
//    var avater = $('#Rightbar .box .cell table tbody tr td')[0].innerHTML;
    var userDom = Rightbar.children('.box:first').children('.cell:first').children('table').children('tbody').children('tr').children('td');

    var userInfo = {};
    if (localStorage['v2ex.k']) {
//        将不太经常变化的信息存储到localStorage里面，当设置页面中点击保存时将整个删除初始化。
        userInfo = JSON.parse(localStorage['v2ex.k']);
    } else {
        userInfo = {
            avater: $(userDom[0]).children('a').children('img').attr('src'),
            name: $(userDom[2]).children('span:first').children('a').text(),
            slogen: $(userDom[2]).children('span:last').text(),
            myNodes: $(userDom[3]).html(),
            myTopics: $(userDom[4]).html(),
            myFollowing: $(userDom[5]).html(),
            atom: ''
        };
        localStorage['v2ex.k'] = JSON.stringify(userInfo);
    }
//  获取一些常用的信息，每次加载时更新
    if ($('#MyNodes').length > 0) {
        userInfo['myNodesDom'] = $('#MyNodes').html();
    } else {
        userInfo['myNodesDom'] = "<div></div>";
    }
    userInfo['notifi'] = Rightbar.children('.box:first').children('.inner').find('[href="/notifications"]').text().split(' ')[0];

    var nearby = $($('#Top .content a')[7]).attr('href');
    var k_navbar =
            '<a id="avater" href="http://www.v2ex.com/member/' + userInfo['name'] + '" class="top k_color_hover"><img src=' + userInfo['avater'] + ' ></a>' +
            '<a href="http://www.v2ex.com/notifications" class="top k_color_hover"><i class="fa fa-bell fa-2x" title="提醒"></i>' + userInfo['notifi'] + '</a>' +
            '<a href="/" class="top k_color_hover" title="首页"><i class="fa fa-home fa-2x"></i></a>' +
            '<a href="http://www.v2ex.com/new" class="top k_color_hover" title="新主题"><i class="fa fa-pencil-square-o fa-2x"></i></a>' +
            '<a href="https://workspace.v2ex.com/" target="_blank" class="top k_color_hover" title="工作空间"><i class="fa fa-laptop fa-2x"></i></a>' +
            '<a href="/notes" class="top k_color_hover"><i class="fa fa-book fa-2x" title="笔记"></i></a>' +
            '<a href="/t" class="top k_color_hover"><i class="fa fa-list-alt fa-2x" title="时间轴"></i></a>' +
            '<a href="/events" class="top k_color_hover" title="事件"><i class="fa fa-eye fa-2x"></i></a>' +
            '<a href="' + nearby + '" class="top k_color_hover" title="附近"><i class="fa fa-map-marker fa-2x"></i></a>' +
            '<a href="/settings" class="top k_color_hover" title="设置"><i class="fa fa-cog fa-2x"></i></a>'
        ;

    var k_tabbar = $('#Tabs').children('a');
    var k_infos = userInfo.myNodes + userInfo.myTopics + userInfo.myFollowing + userInfo.myNodesDom;

    $('body').prepend(newNavbar);

    $('.bars').css('height', window.screen.height);
    $('#Wrapper').css('width', document.body.clientWidth - 140).addClass('k_color_background');

    $('#k_navbar').append(k_navbar).append($('#Top .content a')[9]);
    $($('#k_navbar a')[10]).html('<i class="fa fa-sign-out fa-2x" title="退出"></i>');
    $('#k_infos').append(k_infos);
    $('#k_tabbar').append($('#Tabs a'));

    $('#Rightbar').prepend($('#Search'));

    $('#k_navbar a,#k_tabbar a').addClass('k_color_hover');
    $('a.count_livid').addClass('k_color_count');
    $('a.node').addClass('k_color_node');


    $('#avater').on('mouseenter', function () {
        $('#k_infos').removeClass('hiden');
    });
    $('#k_infos').on('mouseleave', function () {
        $('#k_infos').addClass('hiden');
    });

    var fast = {
        opened: false,
        changeCSS: function () {
            if (!fast.opened) {
                $('#Main').css('width', document.body.clientWidth - 690 - 140);
                $('#Rightbar').css('width', 690).css('position', 'fixed').css('right', 0);
                fast.scroll();
                fast.opened = true;
            }
        },
        scroll: function () {
            $(document).scrollTop($('div div.cell.item.k_color_choosen').prev().offset().top);
        },
        keyPress: function (event) {
            var key = event.keyCode;
            var accepted = true;
            var dom = $('.k_color_choosen');
            console.info(dom.length + event.keyCode);
            if (key == 82) {
                //R刷新
                if (dom.length != 0) {
                    window.location.reload();
                }
            } else if (key == 40 || key == 75) {
                //方向键下
                if (dom.length == 0) {
                    $('#Main .item,#TopicsNode .cell')[0].click()
                } else {
                    fast.scroll();
                    dom.next().click();
                }
            } else if (key == 38 || key == 74) {
                //方向键上
                if (dom.length == 0) {
                    $('#Main .item,#TopicsNode .cell')[0].click()
                } else {
                    dom.prev().click();
                    fast.scroll();
                }
            } else if (key == 39) {
                //方向键右
                if (dom.length != 0) {
                    $('#k_faster').click();
                }
            } else if (key == 37) {
                //方向键左
                var localUrl = window.location.href;
                if (localUrl.indexOf('v2ex.com/go') != -1 || localUrl.indexOf('v2ex.com/t') != -1) {
                    window.history.go(-1);
                }
            } else if (key == 32) {
                //空格
                if (dom.length != 0) {
                    //.click();
                    document.getElementById('k_faster').scrollTop = 0;
                } else {
                    document.body.scrollTop = 0;
                }
            } else {
                accepted = false;
            }
            if (accepted) {
                event.preventDefault();
            }
        },
        changeChoose: function (dom) {
            if ($('#k_faster').length == 0) {
                $('#Rightbar').prepend('<div id="k_faster" class="box" style="height:' + ($(window).height() + 5) + 'px">' + '</div>')
            }
            $('#Main .item,#TopicsNode .cell').removeClass('k_color_choosen');
            $(dom).addClass('k_color_choosen');
        },
        createDom: function (dom) {
            var itemUrl = $(dom).find('.item_title a').attr('href');
            var itemID = itemUrl.substr(3, 6);
            var ifhttps = 'https:' == document.location.protocol ? true : false;
            var ajaxUrl = '://www.v2ex.com/api/topics/show.json?id=' + itemID;
            if (ifhttps) {
                ajaxUrl = 'https' + ajaxUrl;
            } else {
                ajaxUrl = 'http' + ajaxUrl;
            }
            $.ajax({
                type: "get",
                url: ajaxUrl,
                success: function (data) {
                    console.info(ajaxUrl);
                    var title = data[0]['title'];
                    var contentDom = data[0]['content_rendered'];
                    var url = data[0]['url'];
                    if (contentDom.length <= 400) {
//                        判断是否使用快速阅读模式
                        var iframe = '<iframe frameborder=0 seamless allowtransparency="true" width="100%" scrolling="auto" style="margin-bottom:10px; margin-top:-64px" src="' + itemUrl + ' " height="' + (window.screen.height - 10) + '">' + '</iframe>';
                        $('#k_faster').html(iframe).css('padding', 0);
                    } else {
                        var faster = '<h2>' + title + '</h2>' + contentDom;
                        $('#k_faster').html(faster).css('padding', 20);
                    }
                    $('#k_faster').click(function () {
                        window.location.href = url;
                    });
                },
                complete: function () {
                    fast.changeCSS();
                }
            });
        }
    };

    var notifications = {
        getNotification: function (atomUrl) {
            var updateTime, ajaxData, timestamp;
            $.ajax({
                type: "get",
                url: atomUrl,
                beforeSend: function (XMLHttpRequest) {
                },
                success: function (data, textStatus) {
                    ajaxData = data;
                    updateTime = $(data).children('feed').children('updated').text();
                    timestamp = new Date(Date.parse(updateTime.replace(/-/g, "/").replace('T', " ").replace("Z", "")));
                },
                complete: function (XMLHttpRequest, textStatus) {

                    return timestamp.getTime();
                }
            });
        },
        checkNotification: function (update) {
            var storage = window.localStorage;
            var newUpdateTime = notifications.getNotification(userInfo.atom);
            console.info(update);
            if (storage.getItem('notification') !== undefined && newUpdateTime !== undefined && update == false) {
                var oldUpdateTime = storage.getItem('notification');
                if (newUpdateTime != oldUpdateTime) {
                    //有更新内容
                    var title = document.title;
                    document.title = "[新消息]" + title;
                    storage.setItem('notification', newUpdateTime);
                }
            } else {
                storage.setItem('notification', newUpdateTime);
            }
        },
        init: function (atomUrl) {
            var localUrl = window.location.href;
            if (localUrl.indexOf('v2ex.com/notifications') != -1) {
                userInfo.atom = $('input.sll').val();
                localStorage['v2ex.k'] = JSON.stringify(userInfo);
                notifications.checkNotification(true);
            }
            //三分钟检查一次
            if (userInfo.atom != '') {
                var check = window.setInterval(function () {
                    notifications.checkNotification(false);
                }, 180000);
            }

        }
    };
    notifications.init();

    document.addEventListener('keydown', fast.keyPress, false);
    $("textarea,input:text").focus(function () {
        document.removeEventListener('keydown', fast.keyPress, false);
    }).blur(function () {
        document.addEventListener('keydown', fast.keyPress, false);
    });

    var time;
    $('#Main .item,#TopicsNode .cell').addClass('k_color_item').click(function () {
        clearTimeout(time);
        var dom = this;
        fast.changeChoose(dom);
        $(this).find('a').click(function () {
            event.stopPropagation();
        });
        time = setTimeout(function () {
            fast.createDom(dom);
        }, 1500)
    });
});
