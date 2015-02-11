v2ex.k
========

『用更好的UI开始新的一天。』


---------

v2ex.k 是一个有趣的v2ex网站界面修改器，它有如下的特性：

##特性

1. 全新的界面颜色。
2. 左侧导航栏。
3. 快速阅读模式。
4. 左侧显示通知条数。
5. 自定义颜色设置。
6. 全键盘操作模式。
----------

##更新

2015.2.11: 

+ 正式迈入0.1版本，修改原有的iframe模式为ajax模式，读取速度更快。
+ 修改CSS，减少页面空隙，提升页面利用率。
+ 增加全键盘操作，提升了笔记本的阅读效率。
+ 优化了快速阅读区域中的中文阅读效果。
+ 优化左侧导航栏的视觉效果，全部使用icon代替原有文字。

----------

##帮助

1. 使用快速阅读只需要点击列表中除了链接之外的空白即可。
2. 右侧的快速阅读区域可以点击进入具体的帖子。
3. 自定义颜色设置具体如下

<code>

    .k_color_dark{
        background-color: #3C7300;/*主要导航条颜色*/
    }
    
    .k_color_light{
        background-color: #5CB000;/*次级导航条颜色*/
    }
   
    span a.node.k_color_node{
        background-color: #B9D998;/*小标签背景颜色*/
        color: #FFF;
    }

    td a.count_livid.k_color_count{
        background-color: #3C7300;/*回帖数目背景颜色*/
    }   
    
    #Wrapper.k_color_background{
        background-color: #E2F1D0;/*背景颜色*/
    }
    
    .k_color_hover:hover{
        background-color: #2980B9;/*导航条放置变色*/
    }
    
    .k_color_item{
        background-color: #FFF;/*列表项背景颜色*/
    }
    
    .k_color_item a:link,.k_color_item a:visited,.k_color_item a:active{
        color: #3C3B47; /*列表项文字颜色*/
        text-shadow: none;
    }
    
    .k_color_choosen{
        background-color: #eeeeee;/*被选择的列表项的背景颜色*/
    }
    
    #k_tabbar a.tab_current:link, #k_tabbar a.tab_current:visited, #k_tabbar a.tab_current:active{
        background-color: #505770; /*次级导航条被选中颜色*/
        border-top-left-radius:0;
        border-bottom-left-radius:0;
    }
</code>

4 . 全键盘使用：

+ 在没有开启快速阅读模式下：
    + 方向键上，方向键下，会自动选择帖子列表的第一项，并进入快速阅读模式。
    + 空格键，会回到顶部。
    + 方向键左，会回到上一页。

+ 在开启了快速阅读模式之后：
    + 方向键上下，切换上一条/下一条帖子。
    + 空格键，会回到顶部。
    + 方向键右，进入这个帖子。
    

##For chrome

https://chrome.google.com/webstore/detail/v2exk/dnbmbhefokngmkalbdcgjdlgoppfhndn

##For Firefox

感谢caoyue的作品：

https://github.com/caoyue/userjs/blob/master/v2ex.k.user.js

