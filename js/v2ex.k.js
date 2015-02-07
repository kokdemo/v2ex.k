$(function () {
    var navbar = $('#Top .content a');
    var tabbar = $('#Tabs a');
    var avater = $('#Rightbar .box .cell table tbody tr td')[0].innerHTML;
    var search = $('#Search');
    var notificationText = $('.inner a').text().substr(0,5);
    var notification = '<a href="http://www.v2ex.com/notifications">'+notificationText+'</a>';
    var newNavbar = "<div id='k_navbar' class='bars k_color_dark'></div><div id='k_tabbar' class='bars k_color_light'></div>";

    $('body').prepend(newNavbar);

    $('.bars').css('height',window.screen.height);
    $('#Wrapper').css('width',document.body.clientWidth-150).addClass('k_color_background');

    $('#k_navbar').append(navbar);
    $('#k_tabbar').append(tabbar);
    $('#Rightbar').prepend(search);


    $($('#k_navbar a')[0]).remove();
    $('#k_navbar').prepend(notification).prepend(avater);
    $($('#k_navbar a')[3]).attr('href','http://www.v2ex.com/new').text('写新主题');
    $('#k_navbar a img').css('border-radius','50%');
    $('#k_navbar a,#k_tabbar a').addClass('k_color_hover');
    $('a.count_livid').addClass('k_color_dark');
    $('a.node').addClass('k_color_node');

    $('#Main .item,#TopicsNode .cell').addClass('k_color_item').click(function(){
        $($('#Rightbar iframe')).remove();
        $('#Main .item,#TopicsNode .cell').removeClass('k_color_choosen');
        $(this).addClass('k_color_choosen');
        var iframeUrl = $(this).find('.item_title a').attr('href');

        var iframe = '<iframe frameborder=0 seamless allowtransparency="true" width="100%" scrolling="auto" style="margin-bottom:10px; margin-top:-64px" src="'+iframeUrl+' " height="'+(window.screen.height-10)+'">'+'</iframe>';
        $('#Main').css('width',document.body.clientWidth-690-170);
        $('#Rightbar').css('width',690).css('position','fixed').css('right',0).prepend(iframe);
    });

});
