var publicUrl="http://home.sxdeliw.com";
var manageUrl="http://admin.sxdeliw.com";
var testManageUrl="http://admindev.sxdeliw.com";
//var publicUrl="http://192.168.19.189:8120";

/**
 * 分页公共方法
 * url：请求路径
 * param：请求参数
 * vueObj：vue对象
 */
function loadData(url,param,vueObj){
    $.ajax({
        url: url,
        type: 'get',
        dataType: 'json',
        data: param,
        success:function (res,status) {
            if(res.code==200){//数据加载成功
                var data=res.data;
                if (data.pageData != null&& data.totalCount>0) {//数据不为空
                    var total = data.totalCount;
                    //将分页数据赋值给指定的vue模板
                    vueObj.pageParam.pageData = data.pageData;
                    vueObj.pageParam.current = data.startIndex; //当前页数
                    vueObj.pageParam.total = total; //总条数
                    vueObj.pageParam.page = data.totalPage; //总页数
                    vueObj.pageParam.showFlag=true;
                    
                    var pageSize = 10;
                    if(data.pageSize != null){
                        pageSize = data.pageSize;
                        vueObj.pageParam.pageSize = pageSize; //每页显示数
                    }
                    if (total > pageSize) {
                        layui.use(['laypage', 'layer'], function(){
                            var laypage = layui.laypage
                                ,layer = layui.layer;
                            laypage.render({//自定义首页、尾页、上一页、下一页文本
                                elem: 'pager',
                                first: '首页',
                                last: '尾页',
                                prev: '上一页',
                                next: '下一页',
                                count: total,
                                curr: data.startIndex,
                                limit: pageSize,
                                layout:['prev', 'page','first','last', 'next', 'skip'],
                                jump: function(obj, first){
                                    if (!first) {
                                        param.startIndex = obj.curr;
                                        loadData(url,param,vueObj);
                                    }
                                }
                            });
                        })
                    } else {
                        $('#pager').html('');
                    }
                }else{//数据为空
                    vueObj.pageParam.showFlag=false;
                    $('#pager').html('');
                }
               // showMsg();
            }else{//数据加载失败
                vueObj.pageParam.showFlag=false;
                $('#pager').html('');
            }
        }
    })
}