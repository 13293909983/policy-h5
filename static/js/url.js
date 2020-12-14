var publicUrl="http://home.sxdeliw.com";
var manageUrl="http://admin.sxdeliw.com";
var testManageUrl="http://admindev.sxdeliw.com";
//var publicUrl="http://192.168.19.189:8120";

/**
 * ��ҳ��������
 * url������·��
 * param���������
 * vueObj��vue����
 */
function loadData(url,param,vueObj){
    $.ajax({
        url: url,
        type: 'get',
        dataType: 'json',
        data: param,
        success:function (res,status) {
            if(res.code==200){//���ݼ��سɹ�
                var data=res.data;
                if (data.pageData != null&& data.totalCount>0) {//���ݲ�Ϊ��
                    var total = data.totalCount;
                    //����ҳ���ݸ�ֵ��ָ����vueģ��
                    vueObj.pageParam.pageData = data.pageData;
                    vueObj.pageParam.current = data.startIndex; //��ǰҳ��
                    vueObj.pageParam.total = total; //������
                    vueObj.pageParam.page = data.totalPage; //��ҳ��
                    vueObj.pageParam.showFlag=true;
                    
                    var pageSize = 10;
                    if(data.pageSize != null){
                        pageSize = data.pageSize;
                        vueObj.pageParam.pageSize = pageSize; //ÿҳ��ʾ��
                    }
                    if (total > pageSize) {
                        layui.use(['laypage', 'layer'], function(){
                            var laypage = layui.laypage
                                ,layer = layui.layer;
                            laypage.render({//�Զ�����ҳ��βҳ����һҳ����һҳ�ı�
                                elem: 'pager',
                                first: '��ҳ',
                                last: 'βҳ',
                                prev: '��һҳ',
                                next: '��һҳ',
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
                }else{//����Ϊ��
                    vueObj.pageParam.showFlag=false;
                    $('#pager').html('');
                }
               // showMsg();
            }else{//���ݼ���ʧ��
                vueObj.pageParam.showFlag=false;
                $('#pager').html('');
            }
        }
    })
}