$(function(){
	//组织机构代码
	jQuery.validator.addMethod("isOrganizing", function(value, element) {
		var organizing = /^([0-9ABCDEFGHJKLMNPQRTUWXY]{2})([0-9]{6})([0-9ABCDEFGHJKLMNPQRTUWXY]{10})$/;
		return this.optional(element)||(organizing.test(value));
	}, "请填写正确的组织机构代码");
	getChildrenList();
	
	$("#projectSchedule,input[name='money']").on('input propertychange', function(e) {
		var text = $(this).val().replace(/^(0+)|[^\d]+/g, "");
		$(this).val(text); 
	})
})
$("#projectSchedule").change(function(){
	console.log($(this).val());
	if($(this).val()==4){
		$(".projectSchedule").show();
	}else{
		$(".projectSchedule").hide();
	}
})
function getChildrenList(){
	 $.ajax({
			type:"get",
			url:manageUrl+"/homeController/selectChildrenList",
			data: {code:"HBDW"},
			dataType:"json",
			success:function(dataObj){
				if(dataObj.code==200){
					var str = null;
					for(i=0;i<dataObj.data.length;i++){
						str +="<option value="+dataObj.data[i].id+">"+dataObj.data[i].name+"</option>"
						$("#moneyUnit").html(str);
					}
				}
			}
	 })
}
layui.use('laydate', function(){
	 var laydate = layui.laydate;
	laydate.render({
		elem: '#offerPeriod',
		 trigger: 'click', 
		type: 'datetime',
		range: "~",
		done: function(value){
			console.log(value);
			$('#offerPeriod').parent().find("input").removeClass('has-error');
			$('#offerPeriod-error').remove();
			var offerPeriods=value.split('~');
			$("input[name='startTime']").val(offerPeriods[0].trim());
			$("input[name='endTime']").val(offerPeriods[1].trim());
		}
	});
})
//提交
function onCheck(){
	if($('#otherGuarantee').valid()){
		var projectSchedule=$("#projectSchedule").val();
		if(projectSchedule==4){
			$("input[name='projectSchedule']").val($("#projectScheduleNum").val());
		}else{
			$("input[name='projectSchedule']").val(projectSchedule);
		}
		console.log($("input[name='projectSchedule']").val());
		$("input[name='offerPeriod']").attr("disabled", true);
		return true;
	}
}
//表单验证
	$("#otherGuarantee").validate({
	    focusInvalid: false,
	    onsubmit:true,
	    ignore:"",
	    rules: {//字段验证规则，通过name属性验证
	        insuredName:{
	            required: true,//非空验证
	        },
	        insuredOrganizing:{
	        	required: true,
	        	isOrganizing:true,
	        },
	        projectName:{
	        	required: true,
	        },
			tenderReference:{
				required:true,
			},
	        projectNum:{
	        	required: true,
	        },
	        money:{
	        	required: true,
	        },
			offerPeriod:{
				required:true,
			}
	    },
	    messages: {//错误提示信息
	        insuredName:{
	            required: "请输入招标人单位名称",
	        },
	        insuredOrganizing:{
	        	required: "请输入组织机构代码" ,
	        	isOrganizing:"请填写正确的组织机构代码",
	        },
	        projectName: {
	            required: "请输入项目名称",
	        },
	        tenderReference:{
	        	required: "请输入招标编号" ,
	        },
	        projectNum:{
	        	required: "请输入项目编号",
	        },
	        money:{
	        	required: "请输入保证金金额" ,
	        },
			offerPeriod:{
				required:"请选择报价周期" ,
			}
	    },
	    highlight: function (e) {//给未通过验证的元素添加类，通过类设置css
	    	if($(e).is(':hidden')){
	    		$(e).parent().find(".drop_area").addClass('has-error');
	    	}else{
	    		$(e).addClass('has-error');
	    	}
	    },
	    success: function (e) {//验证通过后清除验证
	    	if($(e).prev().is(':hidden')){
	    		$(e).parent().find(".drop_area").removeClass('has-error');
	    	}else{
	    		$(e).parent().find("input").removeClass('has-error');
	    	}
	        $(e).remove();
	    },
	    errorPlacement:function(error, element){
	    	error.appendTo(element.parent());  
	    }
	})