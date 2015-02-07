$(function () {
    var navbar = $('#Top .content a');
    var tabbar = $('#Tabs a');
    var avater = $('#Rightbar .box .cell table tbody tr td')[0].innerHTML;
    var search = $('#Search');

    var newNavbar = "<div id='k_navbar' class='bars'></div><div id='k_tabbar' class='bars'></div>";

    $('body').prepend(newNavbar);

    $('.bars').css('height',document.body.clientHeight);
    $('#Wrapper').css('width',document.body.clientWidth-150);

    $('#k_navbar').append(navbar);
    $('#k_tabbar').append(tabbar);
    $('#Rightbar').prepend(search);


    $($('#k_navbar a')[0]).remove();
    $('#k_navbar').prepend(avater);
    $($('#k_navbar a')[2]).attr('href','http://www.v2ex.com/new').text('写新主题');
    $('#k_navbar a img').css('border-radius','50%');

    $('#Main .item,#TopicsNode .cell').click(function(){
        $($('#Rightbar iframe')).remove();
        var iframeUrl = $(this).find('.item_title a').attr('href');
        var iframe = '<iframe frameborder=0 seamless width="100%" scrolling="no" style="margin-bottom:10px; margin-top:-64px" src="'+iframeUrl+' " height="'+(window.screen.height-10)+'">'+'</iframe>';
        $('#Main').css('width',document.body.clientWidth-690-170);
        $('#Rightbar').css('width',690).css('position','fixed').css('right',0).prepend(iframe);
    });

});
