$(function () {
    var navbar = $('#Top .content a');
    var newNavbar = "<div id='k_navbar' class='bars k_color_dark'></div><div id='k_tabbar' class='bars k_color_light'></div>";

    if ($('#Rightbar .box .cell table tbody tr td').length != 0) {
        var avater = $('#Rightbar .box .cell table tbody tr td')[0].innerHTML;
        var notificationText = $('.inner a').text();
        var notificationStart = notificationText.indexOf('未读提醒');
        notificationText = notificationText.substr(notificationStart - 4, 2);
    } else {
        var avater = '<a href="' + navbar[2] + '" class="top k_color_hover">' + navbar[2].innerHTML + '</a>';
        var notificationText = '';
    }

    var notification = '<a href="http://www.v2ex.com/notifications"><i class="fa fa-bell fa-2x"></i>' + notificationText + '</a>';

    var k_navbar =
            avater + notification +
            '<a href="/" class="top k_color_hover"><i class="fa fa-home fa-2x"></i></a>' +
            '<a href="http://www.v2ex.com/new" class="top k_color_hover"><i class="fa fa-pencil-square-o fa-2x"></i></a>' +
            '<a href="https://workspace.v2ex.com/" target="_blank" class="top k_color_hover"><i class="fa fa-laptop fa-2x"></i></a>' +
            '<a href="/notes" class="top k_color_hover"><i class="fa fa-book fa-2x"></i></a>' +
            '<a href="/t" class="top k_color_hover"><i class="fa fa-list-alt fa-2x"></i></a>' +
            '<a href="/events" class="top k_color_hover"><i class="fa fa-eye fa-2x"></i></a>' +
            '<a href="/place/117.34.170.126" class="top k_color_hover"><i class="fa fa-map-marker fa-2x"></i></a>' +
            '<a href="/settings" class="top k_color_hover"><i class="fa fa-cog fa-2x"></i></a>'
        ;
    $('body').prepend(newNavbar);

    $('.bars').css('height', window.screen.height);
    $('#Wrapper').css('width', document.body.clientWidth - 140).addClass('k_color_background');

    $('#k_navbar').append(k_navbar).append($('#Top .content a')[9]);
    $($('#k_navbar a')[10]).html('<i class="fa fa-sign-out fa-2x"></i>');
    $('#k_tabbar').append($('#Tabs a'));

    $('#Rightbar').prepend($('#Search'));

    $('#k_navbar a img').css('border-radius', '50%');
    $('#k_navbar a,#k_tabbar a').addClass('k_color_hover');
    $('a.count_livid').addClass('k_color_count');
    $('a.node').addClass('k_color_node');

    var fast = {
        changeCSS : function(){
            $('#Main').css('width', document.body.clientWidth - 690 - 140).css('height', $(window).height()+10);
            $('#Rightbar').css('width', 690).css('position', 'fixed').css('right', 0);
        },
        keyPress:function(event){
            var key;
            key = event.keyCode;
                //Ie使用event.keyCode获取键盘码
            var dom = $('.k_color_choosen');
            if(key == 82){
                //R刷新
                if(dom.length!=0){
                    window.location.reload();
                }
            }else if(key == 40){
                //方向键下
                if(dom.length==0){
                    $('#Main .item,#TopicsNode .cell')[0].click()
                }else{
                    dom.next().click();
                }
            }else if(key == 38){
                //方向键上
                if(dom.length==0){
                    $('#Main .item,#TopicsNode .cell')[0].click()
                }else{
                    dom.prev().click();
                }
            }else if(key == 39){
                //方向键右
                if(dom.length!=0){
                    $('#k_faster').click();
                }
            }else if(key == 37){
                //方向键左
                if(dom.length==0){
                    window.history.go(-1);
                }
            }else if(key == 32){
                //空格
                if(dom.length!=0){
                    //.click();
                    document.getElementById('k_faster').scrollTop=0;
                }else{
                    document.body.scrollTop = 0;
                }
            }
        }
    };
    document.onkeydown = fast.keyPress;
    $('#Main .item,#TopicsNode .cell').addClass('k_color_item').click(function () {
        if ($('#Rightbar #k_faster').length == 0) {
            $('#Rightbar').prepend('<div id="k_faster" class="box" style="height:' + ($(window).height() - 10) + 'px">' + '</div>')
        }
        $('#Main .item,#TopicsNode .cell').removeClass('k_color_choosen');
        $(this).addClass('k_color_choosen');

        var itemUrl = $(this).find('.item_title a').attr('href');
        var itemID = itemUrl.substr(3, 6);
        $.ajax({
            type: "get",
            url: 'http://www.v2ex.com/api/topics/show.json?id=' + itemID,
            success: function(data){
                var title = data[0]['title'];
                var contentDom = data[0]['content_rendered'];
                var url = data[0]['url'];
                var faster = '<h2>' + title + '</h2>' + contentDom;
                fast.changeCSS();
                $('#k_faster').html(faster).click(function(){
                    window.location.href = url;
                });
            },
            error: function(){
                var iframe = '<iframe frameborder=0 seamless allowtransparency="true" width="100%" scrolling="auto" style="margin-bottom:10px; margin-top:-64px" src="'+itemUrl+' " height="'+(window.screen.height-10)+'">'+'</iframe>';
                fast.changeCSS();
                $('#k_faster').html(iframe).css('padding',0).click(function(){
                    window.location.href = url;
                });
            }
        });
    });

});
