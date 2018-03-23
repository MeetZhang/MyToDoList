//模块化编程---闭包

var myTodoModule = (function () {
    //定义变量
    var task_list = [];
    var $content;
    var $task_list;
    var $addTaskSubmit;
    var detailIndex; //详情索引值
    var deleteIndex; //删除索引值
    var $task_detail;
    var $detail_content, desc;
    var $datetime;
    var $detail_submit;
    var $delete;

    //初始化jquery对象
    var initJqVar = function () {
        $content = $('.content'); //获取到content节点，初始化jq只执行一次
        $task_list = $('.task-list');
        $addTaskSubmit = $('.addTaskSubmit');
        $task_detail = $('.task-detail');
        $detail_content = $('.detail-content');
        $desc = $('.desc');
        $datetime = $('.datetime');
        $detail_submit = $('.detail-submit');
        $delete = $('.delete')
    }

    //页面初始化并渲染store数据库里面的数据
    var initRenderIndex = function () {
        $task_list.html('');
         task_list = store.get('task_list');

         console.log(task_list);
        let taskListHtmlStr = '';
        if(task_list==null) task_list=[];
        if (task_list != "" && task_list != undefined) {
            let tl_len = task_list.length - 1;
            for (var i = tl_len; i >= 0; i--) {
                var oneItem = '<div class="task-item" data-index="' + i + '"><!--任务项目-->' +
                    '					<span ><!--复选框-->' +
                    '						<input type="checkbox" />' +
                    '					</span>' +
                    '					<span class="item-content"><!--item的content-->' + task_list[i].content +
                    '					</span>' +
                    '					<span class="fr"><!--item右侧的action-->' +
                    '					<span class="action detail"><!--详情-->' +
                    '						详情	' +
                    '					</span>' +
                    '					<span class="action delete"><!--删除-->' +
                    '						删除	' +
                    '					</span>' +
                    '					</span>' +
                    '				</div>';
                taskListHtmlStr += oneItem;
            }
        }
        //将item里的内容添加到list列表里
        $(taskListHtmlStr).appendTo($task_list);

        listenDetail(); //调用详情事件
        listenDelete(); //调用删除事件    
    }


    //添加task-itme的方法
    var addTask = function () {
        var new_task = {};
        if($content.val() != ""){
            new_task.content = $content.val() //获取input的val值，并赋值给新对象new_task.content
            if(new_task.content != "" && new_task.content != undefined){
                console.log(task_list)
                task_list.push(new_task);
                if (new_task.content !== '') {
                    renderOneItem(new_task);
                    $content.val('') //将input的值清空
                    // listenDelete();     //删除
                } else {
                    return alert("请您输入内容")
                }
                store.set('task_list', task_list); //将数组数据存到store里
            }
        }
    }

    //向页面渲染render_date列表    添加内容
    var renderOneItem = function (new_task) {
        var oneItem = '<div class="task-item"><!--任务项目-->' +
            '					<span ><!--复选框-->' +
            '						<input type="checkbox" />' +
            '					</span>' +
            '					<span class="item-content"><!--item的content-->' + new_task.content +
            '					</span>' +
            '					<span class="fr"><!--item右侧的action-->' +
            '					<span class="action detail"><!--详情-->' +
            '						详情	' +
            '					</span>' +
            '					<span class="action delete"><!--删除-->' +
            '						删除	' +
            '					</span>' +
            '					</span>' +
            '				</div>';
        $(oneItem).prependTo($task_list);
        listenDetail(); //详情
        listenDelete(); //删除
    }

    //按钮监听
    var addItemSubmit = function () {
        $addTaskSubmit.click(function () {
            addTask();
            // return false;
        })
    }

    //点击任务详情编辑项目明细并保持数据
    var listenDetail = function () {
        $('.detail').click(function () {
            detailIndex = task_list.length - 1 - $(this).parent().parent().index(); //通过列表的长度-1-详情自身获得正确索引
            $task_detail.show();
            $detail_content.val(task_list[detailIndex].content);
            $desc.val(task_list[detailIndex].desc);
            $datetime.val(task_list[detailIndex].datetime);
        })
    }

    //保存详情里面更改的数据
    var listenDetailSave = function () {
        $detail_submit.click(function () {
            var dateTask = {};
            dateTask.content = $detail_content.val();
            dateTask.desc = $desc.val();
            dateTask.datetime = $datetime.val();
            //在原来的信息修改更新后何必操作
            task_list[detailIndex] = $.extend(task_list[detailIndex], dateTask); //更新task_list的数据
            store.set('task_list', task_list); //将数组数据存到store里
            $detail_content.val('');
            $desc.val('');
            $datetime.val('');
            $task_detail.hide();
            initRenderIndex();
            //此时提交完毕后详情事件只调用了一次需要重新调用 详情事件  即在初始化渲染时仅仅详情事件调用
        })
    }

    //删除事件
    //注意事项 为什么不能用前面Juqery定义的$delete? 因为$delete经过几次渲染已经没有    
    var listenDelete = function () {
        // var falg = true;
        $('.delete').click(function () {
            // var falg = true;
            deleteIndex = task_list.length - 1 - $(this).parent().parent().index(); //通过列表的长度-1-详情自身获得正确索引
            // if(falg){
            var r = confirm("您确认要删除吗？");
            if (r) {
                falg = false;
                task_list.splice(deleteIndex, 1) //删除数据里的列表，第一个是数组索引，第二个是删除个数
                $(this).parent().parent().remove(); //删除内容
                // alert(this)
                store.set('task_list', task_list);
            }
            // }
        })
    }

    //页面初始化的方法自检
    var initModule = function () {
        // store.set('task_list',task_list);   //清空数据
        initJqVar(); //调用jquery
        initRenderIndex(); //初始化页面并渲染

        addItemSubmit(); //提交数据监听
        listenDetail(); //详情事件数据信息
        listenDetailSave(); //更新详情事件数据
        $datetime.datetimepicker(); //日期插件(datetimepicker)
        listenDelete();
    }

    //返回模块
    return {
        initModule: initModule
    }
})()

$(function () {
    myTodoModule.initModule();
})