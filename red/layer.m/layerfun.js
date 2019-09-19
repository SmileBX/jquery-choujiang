/*! layer 弹出信息 */
function tips(msg) {

    layer.open({
        content: "" + msg + "",
        skin: 'msg',
        time: 3 //3秒后自动关闭
    });
}
/*! layer 弹出信息 并跳转 */
function tips_url(msg, url) {
    layer.open({
        content: "" + msg + "",
        style: 'background-color:#FFF;',
        time: 3,
        end: function () {
            document.location.href = url;
        }
    });

}

/*! 返回上一页 */
function tips_back(msg) {
    layer.open({
        content: "" + msg + "",
        style: 'background-color:#FFF;',
        time: 3,
        end: function () {
            window.history.back();
        }
    });
}



/*! layer 加载层 */
function tips_loading() {
    layer.open({
        type: 2,
        time: 10000,
        shadeClose:false
    });
}

/*! layer 关闭加载层  */
function tips_loading_close() {
    layer.closeAll()
}

/*! layer 询问框 确认跳转  */
function tips_ask_url(msg, url) {
    layer.open({
        title: '提示',
        content: "" + msg + "",
        btn: ['确认', '取消'],
        yes: function (index) {
            document.location.href = url;
            layer.close(index);
        }
    });
}

/*! layer 询问框 确认刷新 */
function tips_ask(msg) {
    layer.open({
        title: '提示',
        content: "" + msg + "",
        btn: ['取消', '确认'],
        yes: function (index) {
            location.reload();
            layer.close(index);
        }
    });
}


//询问框


/*! layer 询问框 确认刷新 */
function tips_show(title,msg) {
    layer.open({
        title: [
          "" + title + "",
          'background-color:#ff5001; color:#fff;'
        ]
  , anim: 'up'
  , content: "" + msg + ""
  , btn: ['确定']
    });
}