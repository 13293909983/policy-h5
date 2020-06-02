	Date.prototype.format = function(format) {
		var date = {
			"M+" : this.getMonth() + 1,
			"d+" : this.getDate(),
			"h+" : this.getHours(),
			"m+" : this.getMinutes(),
			"s+" : this.getSeconds(),
			"q+" : Math.floor((this.getMonth() + 3) / 3),
			"S+" : this.getMilliseconds()
		};
		if (/(y+)/i.test(format)) {
			format = format.replace(RegExp.$1, (this.getFullYear() + '')
					.substr(4 - RegExp.$1.length));
		}
		for ( var k in date) {
			if (new RegExp("(" + k + ")").test(format)) {
				format = format.replace(RegExp.$1,
						RegExp.$1.length == 1 ? date[k] : ("00" + date[k])
								.substr(("" + date[k]).length));
			}
		}
		return format;
	}
	layui.use('laydate', function(){
		  var laydate = layui.laydate;
		  //常规用法
		  laydate.render({
		    elem: '#retroactiveStart',
		    trigger: 'click', 
		    min:minDate(),
		    done:function(value,date){
		    	//确定了消除错误提示
		    	$(":input[name='retroactiveStart']").parent().parent().find("i").text("");
		    	//给结束时间赋值
		    	var period=$(":input[name='period']").val();
	            if (value != "" && period!="") {
	                $(":input[name='retroactiveEnd']").val(
	                    new Date(
	                        new Date(value.replace(/-/g, "/"))
	                            .getTime()
	                        + parseInt(period) * 24 * 60 * 60 * 1000)
	                        .format("yyyy-MM-dd"));
	            }else{
	                $(":input[name='retroactiveEnd']").val();
				}
		    }
		  });
	})
	// 设置最小可选的日期
	function minDate(){
	    var now = new Date();
	    return now.getFullYear()+"-" + (now.getMonth()+1) + "-" + now.getDate();
	 }
	$(function() {
		//根据起保日期生成终保日期
		$(":input[name='startDate']").change(
				function() {
					if (this.value != "") {
						$(":input[name='endDate']").val(
								new Date(
										new Date(this.value.replace(/-/g, "/"))
												.getTime()
												+ 179 * 24 * 60 * 60 * 1000)
										.format("yyyy-MM-dd"));
					}
				}).change();
        var retroactiveEvent=function() {
            var period=$(":input[name='period']").val();
            var retroactiveStart=$(":input[name='retroactiveStart']").val();
            if (retroactiveStart != "" && period!="") {
                $(":input[name='retroactiveEnd']").val(
                    new Date(
                        new Date(retroactiveStart.replace(/-/g, "/"))
                            .getTime()
                        + parseInt(period) * 24 * 60 * 60 * 1000)
                        .format("yyyy-MM-dd"));
            }else{
                $(":input[name='retroactiveEnd']").val();
			}
        };
        var retroactiveStart=$(":input[name='retroactiveStart']").val();
		var retroactiveEnd=$(":input[name='retroactiveEnd']").val();
		if(retroactiveEnd!='' && retroactiveEnd!=''){
            var start = new Date(retroactiveStart.replace(/-/g, "/")).getTime();
            var end = new Date(retroactiveEnd.replace(/-/g, "/")).getTime();
			var period=(end-start)/(24 * 60 * 60 * 1000);
            $(":input[name='period']").val(period);
		}
        //$(":input[name='retroactiveStart']").change(retroactiveEvent).change();
        $(":input[name='period']").blur(retroactiveEvent).change();
		//默认起保日期
		$(":input[name='startDate']").val(
				new Date(new Date().getTime()).format("yyyy-MM-dd"));
		$(":input[name='endDate']").val(
				new Date(new Date().getTime() + 180 * 24 * 60 * 60 * 1000)
						.format("yyyy-MM-dd"));
		$(":input[name='electricPower']").blur(function() {
		    if(this.value!=""){
                var electricPower = parseInt(this.value);
                var sumPremium = 0;
                //更新的保费
                if (electricPower > 0 && electricPower <= 30000) {
                    sumPremium = 500;
                } else if (electricPower > 30000 && electricPower <= 100000) {
                    sumPremium = 800;
                }else if(electricPower > 100000 && electricPower <= 200000){
                	sumPremium = 1000;
                } else if (electricPower <= 800000) {
                    sumPremium = electricPower * 0.005;
                    sumPremium=decimal(sumPremium,2);
                }
                $(":input[name='sumPremium']").val(sumPremium);
			}
		}).blur();
		//全局错误提示
		if($("#message").val()!=""){
			layer.alert($("#message").val(), {icon: 2});
		}
		var fileKey=$(":hidden[name='fileKey']").val();
		if(fileKey!=null&&fileKey!=""&&fileKey!="-"){
			$("#fileImg").attr("src", "/static/images/a7.png");
			$("#text").text("文件已上传");
		}
		//初始化查看是否有交易平台流水号
		var sequenceNo=$("input[name='sequenceNo']").val();
		//console.log(sequenceNo);
		if(sequenceNo!=null&&sequenceNo!=""){
			//如果有的话，把字段改成禁用
       		$('input').not(":input[name='insuredAddress']")
       		.not(":input[name='imageFiles']").not(":input[name='invoice.bankAccount']")
       		.not(":input[name='invoice.buyerTaxpayerIdentifyNumber']")
       		.not(":input[name='invoice.addressAndPhone']")
       		.not(":input[name='invoice.invoiceTitle']")
       		.not(":input[name='invoice.phone']")
       		.not(":input[name='agree']")
       		.not("#regionSel").attr("readonly",true);
			//把选择框改成禁用
       		$('select').attr("disabled","disabled");
			//把行业代码的a标签改成禁用
			$('#menuBtn').removeAttr('onclick');
			//改input的禁用样式
       		$('input').not(":input[name='insuredAddress']")
       		.not(":input[name='imageFiles']").not(":input[name='invoice.bankAccount']")
       		.not(":input[name='invoice.buyerTaxpayerIdentifyNumber']")
       		.not(":input[name='invoice.addressAndPhone']")
       		.not(":input[name='invoice.invoiceTitle']")
       		.not(":input[name='invoice.phone']")
       		.not(":input[name='agree']")
       		.not("#regionSel").css("cursor","not-allowed");
       		//改select的禁用样式
			$('select').css("cursor","not-allowed").css("background-color","#efefef");
			//改input 上的td的禁用样式
       		$('input').not(":input[name='insuredAddress']")
			.not(":input[name='imageFiles']").not(":input[name='invoice.bankAccount']")
       		.not(":input[name='invoice.buyerTaxpayerIdentifyNumber']")
       		.not(":input[name='invoice.addressAndPhone']")
       		.not(":input[name='invoice.invoiceTitle']")
       		.not(":input[name='invoice.phone']").parent().not('form').not('p').not(".fileinput-button")
       		.css("cursor","not-allowed").css("background-color","#efefef");
       		//改select 上的td的禁用样式
			$('select').parent().css("cursor","not-allowed").css("background-color","#efefef");
			//把行业代码的a标签改成禁用样式
			$('#menuBtn').css("cursor","not-allowed");
			$(".list").parent().css("cursor","not-allowed").css("background-color","#efefef");
			$("#regionSel").parent().removeAttr("style");
			$("#regionSel").parents('tr').removeAttr("style");
			//把开标时间的td禁用
			$(":input[name='retroactiveStart']").parents("td").css("cursor","not-allowed").css("background-color","#efefef");
			//把开标时间的laydate禁用
			$(":input[name='retroactiveStart']").attr("disabled","disabled");
		}
		//初始化获取行业代码
		getBusinesssource();
		//初始化鼠标移入移出事件
		$('.zhuyi_tk li').mouseover(function(e) {
	        $(this).siblings().stop().fadeTo(500,0.2);
	    });
		$('.zhuyi_tk li').mouseout(function(e) {
	        $(this).siblings().stop().fadeTo(500,1);
	    });
		//初始化获取项目所在区域
		getRegion();
		//初始化根据所属区域的code给赋值
		ztreeRegionClick();
		//隐藏进度条
		$("#schedule").hide();
	})
	//算保费金额，保留两位小数，四舍五入
	function decimal(num,v){
		var vv = Math.pow(10,v);
		return Math.round(num*vv)/vv;
	}
	function onCheck(){
		var i=0;
		//被保险人名称
		var insuredName=$(":input[name='insuredName']").val();
		var appliName=$("#appliName").val();
		if(insuredName=="" || insuredName==null){
			$(":input[name='insuredName']").parent().find("i").text("请输入被保险人名称");
			i++;
		}else if(insuredName==appliName){
			//如果一致。提示不能提交
			$(":input[name='insuredName']").parent().find("i").text("被保险人名称不能和保险人名称一致");
			i++;
		}
		//组织机构代码
		var insuredIdNo=$(":input[name='insuredIdNo']").val();
		if(insuredIdNo=="" || insuredIdNo==null){
			$(":input[name='insuredIdNo']").parent().find("i").text("请输入组织机构代码");
			i++;
		}
		//社会信用代码
		var insuredSocialcode=$(":input[name='insuredSocialcode']").val();
		var regex =/^([0-9ABCDEFGHJKLMNPQRTUWXY]{2})([0-9]{6})([0-9ABCDEFGHJKLMNPQRTUWXY]{10})$/;
		if(insuredSocialcode=="" || insuredSocialcode==null){
			$(":input[name='insuredSocialcode']").parent().find("i").text("请输入社会信用代码");
			i++;
		}else if(!regex.test(insuredSocialcode)){
			$(":input[name='insuredSocialcode']").parent().find("i").text("请输入正确的社会信用代码");
			i++;
		}
		//联系电话
		var insuredIdMobile=$(":input[name='insuredIdMobile']").val();
		var phone=/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
		var mobel=/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/;
		if(insuredIdMobile=="" || insuredIdMobile==null){
			$(":input[name='insuredIdMobile']").parent().find("i").text("请输入联系电话");
			i++;
		}else if(!phone.test(insuredIdMobile) && !mobel.test(insuredIdMobile)){
			$(":input[name='insuredIdMobile']").parent().find("i").text("请输入正确的联系电话");
			i++;
		}
		//代理机构名称
		var agencyName=$(":input[name='agencyName']").val();
		if(agencyName==""||agencyName==null){
			$(":input[name='agencyName']").parent().find("i").text("请输入代理机构名称");
			i++;
		}
		//电子保险保函
		//地址
		/* var insuredAddress=$(":input[name='insuredAddress']").val();
		if(insuredAddress=="" || insuredAddress==null){
			$(":input[name='insuredAddress']").parent().find("i").text("请输入地址");
			i++;
		} */
		//项目名称
		var certificateDepart=$(":input[name='certificateDepart']").val();
		if(certificateDepart=="" || certificateDepart==null){
			$(":input[name='certificateDepart']").parent().find("i").text("请输入投标项目名称");
			i++;
		}
		//招标文件编号
		var certificateNo=$(":input[name='certificateNo']").val();
		if(certificateNo=="" || certificateNo==null){
			$(":input[name='certificateNo']").parent().find("i").text("请输入招标项目编号");
			i++;
		}
		//开标日期
		var retroactiveStart=$(":input[name='retroactiveStart']").val();
		if(retroactiveStart=="" || retroactiveStart==null){
			$(":input[name='retroactiveStart']").parent().parent().find("i").text("请输入开标日期");
			i++;
		}
		var myDate = new Date();
		var time=myDate.getFullYear() + "/" + (myDate.getMonth() + 1) + "/" + myDate.getDate();
		var myTime=new Date(time);
		var start=new Date(retroactiveStart.replace(/-/g, "/"));
		if(myTime.getTime()-start.getTime()>0){
			$(":input[name='retroactiveStart']").parent().parent().find("i").text("开标时间不得低于当前时间");
			i++;
		}
		//保证金金额
		var electricPower=$(":input[name='electricPower']").val();
		if(electricPower=="" || electricPower==null){
			$(":input[name='electricPower']").parent().find("i").text("请输入保证金金额");
			i++;
		}else if(500>=electricPower){
			$(":input[name='electricPower']").parent().find("i").text("保证金金额不得小于保费金额");
			i++;
		}
		//影像文件
		/*var imageFile=$(":input[name='imageFile']").val();
		var fileKey=$(":hidden[name='fileKey']").val();
		if((imageFile=="" || imageFile==null) && (fileKey==undefined || fileKey=="")){
			$(".fileinput-button").parent().find("i").text("请上传影像文件");
			i++;
		}*/
		//发票手机号
		var phones=$(":input[name='invoice.phone']").val();
		var phone=/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
		if(phones=="" || phones==null){
			$(":input[name='invoice.phone']").parent().find("i").text("请输入手机号");
			i++;
		}else if(!phone.test(phones)){
			$(":input[name='invoice.phone']").parent().find("i").text("请输入正确的手机号");
			i++;
		}
		//行业代码选择
		var businesssource=$("#citySel").val();
		if(businesssource=="" || businesssource==null){
			$(".list").parent().find("i").text("请选择行业代码");
			i++;
		}
		//资金来源
		var fundSource=$(":input[name='fundSource']").val();
		var word="世界银行";;
		var allb="亚洲基础设施投资银行";
		if(fundSource==''||fundSource==null){
			$(":input[name='fundSource']").parent().find("i").text("请输入资金来源");
			i++;
		}else if(fundSource==word){
			$(":input[name='fundSource']").parent().find("i").text("世界银行不能投保");
			i++
		}else if(fundSource==allb){
			$(":input[name='fundSource']").parent().find("i").text("亚洲基础设施投资银行不能投保");
			i++
		}
		//标段编号
		/*var sectionNo=$(":input[name='sectionNo']").val();
		if(sectionNo==''||sectionNo==null){
			$(":input[name='sectionNo']").parent().find("i").text("请输入标段编号");
			i++
		}*/
		//项目所属地
		var regionalism=$(":input[name='regionalism']").val();
		if(regionalism=="" || regionalism==null){
			$(".lists").parent().find("i").text("请选择项目所在区域");
			i++;
		}
		if(i>0){
			return false;
		}
		//阅读并同意
		var check=$("input[name='agree']").is(':checked');
		if(!check){
			layer.msg('请仔细阅读并同意《投保指南、投保须知、投保条款》', {icon: 0});
			return false;
		}
		//提交的时候把select禁用去掉
		$('select').removeAttr("disabled"); 
		//把时间控件的禁用去掉
		$(":input[name='retroactiveStart']").removeAttr("disabled"); 
		//$(":input[name='imageFile']").prop("disabled",true);
		$(":input[name='imageFiles']").attr("disabled","disabled");
		//显示灰色的禁用的样式
		$('.btnSubClass').show();
		//隐藏确定按钮
		$('#btnSub').hide();
		//判断如果是大地的，把文件名称放在一个字段里
		var insuranceCompany=$("#insuranceCompany").val();
		if(insuranceCompany=="CCIC"){
			var imgFile=$("#imgFileValue").val()+","+$("#pdfFileValue").val();
			var imgFileUrl=$("#imgFileValue").attr("data-url")+","+$("#pdfFileValue").attr("data-url");
			$(":input[name='fileKey']").val(imgFile);
			$(":hidden[name='fileKey']").attr("_val",imgFile);
			$(":input[name='imageFile']").val(imgFileUrl);
		}
		return true;
	}
	//被保险人名称
	function getInsuredName(){
		var insuredName=$(":input[name='insuredName']").val();
	    var loginName=$(":input[name='invoice.invoiceTitle']").val();//当前登录人名称
		if(insuredName!=''&&insuredName!=null){
			$(":input[name='insuredName']").parent().find("i").text("");
		}
		//判断保险人名称和被保险人名称是否一致
		if (insuredName==loginName){
			$(":input[name='insuredName']").parent().find("i").text("被保险人名称不能和保险人名称一致");
		}
	}
	//组织机构代码
	function getInsuredIdNo(){
		var insuredIdNo=$(":input[name='insuredIdNo']").val();
		if(insuredIdNo!=''&&insuredIdNo!=null){
			$(":input[name='insuredIdNo']").parent().find("i").text("");
		}
	}
	//社会信用代码
	function getInsuredSocialcode(){
		var insuredSocialcode=$(":input[name='insuredSocialcode']").val();
		if(insuredSocialcode!=''&&insuredSocialcode!=null){
			$(":input[name='insuredSocialcode']").parent().find("i").text("");
		}
	}
	//联系电话
	function getInsuredIdMobile(){
		var insuredIdMobile=$(":input[name='insuredIdMobile']").val();
		if(insuredIdMobile!=''&&insuredIdMobile!=null){
			$(":input[name='insuredIdMobile']").parent().find("i").text("");
		}
	}
	//代理机构名称
	$(":input[name='agencyName']").change(function(){
		var agencyName=$(this).val();
		if(agencyName!="" && agencyName!=null){
			$(":input[name='agencyName']").parent().find("i").text("");
		}
	});
	//地址
	/* function getInsuredAddress(){
		var insuredAddress=$(":input[name='insuredAddress']").val();
		if(insuredAddress!=''&&insuredAddress!=null){
			$(":input[name='insuredAddress']").parent().find("i").text("");
		}
	} */
	//项目名称
	function getCertificateDepart(){
		var certificateDepart=$(":input[name='certificateDepart']").val();
		if(certificateDepart!=''&&certificateDepart!=null){
			$(":input[name='certificateDepart']").parent().find("i").text("");
		}
	}
	//招标文件编号
	function getCertificateNo(){
		var certificateNo=$(":input[name='certificateNo']").val();
		//平台编号
		var sequenceNo=$("input[name='sequenceNo']").val();
		//给标段编号赋值
		if(sequenceNo==null||sequenceNo==""){
			$(":input[name='sectionNo']").val(certificateNo);
		}
		if(certificateNo!=''&&certificateNo!=null){
			$(":input[name='certificateNo']").parent().find("i").text("");
		}
	}
	//保证金金额
	function getElectricPower(){
		var electricPower=$(":input[name='electricPower']").val();
		if(electricPower!=''&&electricPower!=null){
			$(":input[name='electricPower']").parent().find("i").text("");
		}
	}
	//影像文件
	function getImageFile(){
		var imageFile=$(":input[name='imageFile']").val();
		if(imageFile!=''&&imageFile!=null){
			$(".fileinput-button").parent().find("i").text("");
		}
	}
	//资金来源
	function getFundSource(){
		var fundSource=$(":input[name='fundSource']").val();
		if(fundSource!=''&&fundSource!=null){
			$(":input[name='fundSource']").parent().find("i").text("");
		}
	}
	//标段编号
	/*function getSectionNo(){
		var sectionNo=$(":input[name='sectionNo']").val();
		if(sectionNo!=''&&sectionNo!=null){
			$(":input[name='sectionNo']").parent().find("i").text("");
		}
	}*/
	//发票手机号
	function getPhone(){
		var phone=$(":input[name='invoice.phone']").val();
		if(phone!=''&&phone!=null){
			$(":input[name='invoice.phone']").parent().find("i").text("");
		}
	}
	//行业分类树
	var setting = {
	    data: {
		    simpleData: {
		        enable: true
		    }
	    },
	    callback: {
			beforeClick: beforeClick,
			onClick: onClick,
			beforeExpand:beforeExpand
		}
	};
	//获取行业代码
	function getBusinesssource(){
		 $.ajax({
		        type:"get",
		        url:manageUrl+"/homeController/selectIndustryType",
		        data: {},
		        dataType:"json",
		        success:function(dataObj){
		        	if(dataObj.code==200){
		        		var businesssourceList=dataObj.data;
		        		//加载ztree
		        		$.fn.zTree.init($("#tree"), setting, businesssourceList);
		        		//初始化给ztree赋值
		        		ztreeClick();
		        	}
		        }
		 })
		
	}
	function beforeClick(treeId, treeNode) {
		var check = (treeNode && !treeNode.isParent);
		if (!check){
			return false;
		}
		return check;
	}
	//节点展开前（左侧菜单树）
	function beforeExpand(treeId, treeNode){
	    singlePath(treeNode);
	}
	//保持展开单一节点
	function singlePath(currNode) {
	    var cLevel = currNode.level;
	    //这里假设id是唯一的
	    var cId = currNode.id;
	    //此对象可以保存起来，没有必要每次查找
	    var treeObj = $.fn.zTree.getZTreeObj('tree');
	    //展开的所有节点，这是从父节点开始查找（也可以全文查找）
	    var expandedNodes = treeObj.getNodesByParam("open", true, currNode.getParentNode());
	    for(var i = expandedNodes.length - 1; i >= 0; i--){
	        var node = expandedNodes[i];
	        var level = node.level;
	        var id = node.id;
	        if (cId != id && level == cLevel) {
	            treeObj.expandNode(node, false);
	        }
	    }
	}
	function onClick(e, treeId, treeNode) {
		var zTree = $.fn.zTree.getZTreeObj("tree"),
		nodes = zTree.getSelectedNodes(),
		v = "";
		code=""
		nodes.sort(function compare(a,b){return a.id-b.id;});
		for (var i=0, l=nodes.length; i<l; i++) {
			v += nodes[i].name + ",";
			code+=nodes[i].code+","
		}
		if (v.length > 0 ) v = v.substring(0, v.length-1);
		if (code.length > 0 ) code = code.substring(0, code.length-1);
		var cityObj = $("#citySel");
		cityObj.attr("value", v);
		//给businesssource赋code值
		$("input[name='businesssource']").attr("value",code);
		//把行业代码提醒消息去掉
		$(".list").parent().find("i").text("");
		//关闭
		hideMenu();
	}
	
	function showMenu() {
		var cityObj = $("#citySel");
		var cityOffset = $("#citySel").offset();
		$("#menuContent").slideDown("fast");
		$("body").bind("mousedown", onBodyDown);
	}
	function hideMenu() {
		$("#menuContent").fadeOut("fast");
		$("body").unbind("mousedown", onBodyDown);
	}
	function onBodyDown(event) {
		if (!(event.target.id == "menuBtn" || event.target.id == "menuContent" || $(event.target).parents("#menuContent").length>0)) {
			hideMenu();
		}
	}
	function ztreeClick(){
		//var treeCode = "A010152";
		var treeCode = $("input[name='businesssource']").val();
		if(treeCode.trim()!=""){
	       	var tree = $.fn.zTree.getZTreeObj("tree");
	        var strs = treeCode.split(",");
	        for(var j=0;j<strs.length;j++){
	            var node = tree.getNodeByParam("code",strs[j]);
	            tree.selectNode(node , true,true); 
	            var cityObj = $("#citySel");
	    		cityObj.attr("value", node.name);
	        }
		 }
	}
	//项目所在区域的树
	var settings = {
	    data: {
		    simpleData: {
		        enable: true
		    }
	    },
	    callback: {
			beforeClick: beforeClick,
			onClick: onRegionClick,
			onExpand:onRegionExpand,
			beforeExpand:beforeRegionExpand
		}
	};
	//获取项目所在区域
	function getRegion(){
		 $.ajax({
		        type:"get",
		        url:manageUrl+"/homeController/selecFirsttList",
		        data: {code:"CITY"},
		        dataType:"json",
		        success:function(dataObj){
		        	if(dataObj.code==200){
		        		var region = dataObj.data;
		        		//加载ztree
		        		$.fn.zTree.init($("#regionTree"), settings, region);
		        		//默认展开山西省
		        		getOpen();
		        	}
		        }
		 })
	}
	//点击显示树
	function showRegion() {
		var cityObj = $("#regionSel");
		var cityOffset = $("#regionSel").offset();
		//.css({left:cityOffset.left + "px"})
		$("#regionContent").slideDown("fast");
		$("body").bind("mousedown", onBodyDownRegion);
		//给默认定位到山西
		document.getElementById('regionTree').scrollTop=100;
	}
	//展开事件
	function onRegionExpand(e, treeId, treeNode) {
		var param = {'id':treeNode.id};
		var zTree = $.fn.zTree.getZTreeObj("regionTree");
		var parentZNode = zTree.getNodeByParam("id", treeNode.id, null);//获取指定父节点
		var childNodes = zTree.transformToArray(treeNode);//获取子节点集合
	    //因为子节点还包括组织，所以这里需要筛选一下
	    var key = false;
	    for(var i in childNodes){
	        if(childNodes[i].udn){//如果当前组织有终端 就不再加载
	            key = true;
	            break;
	        }                  
	    }
	    if(!key){
	    	$.ajax({
            method:'post',
            url:manageUrl+'/homeController/childrenList',
            data:param,
            success:function(res){
            	if(res.code==200){
            		//添加子节点
            		if(res.data.length>0){
            			var data = res.data;
		        		for(var i in data){
		                    var code = (data[i].code).substring((data[i].code).length - 7);                  
		                    code = Number(code);
		                    data[i].id = Number(data[i].id);
		                    data[i].pId = code;
		                }
		        		zTree.addNodes(parentZNode,data, false);    //添加节点 
            		}
	        	}
            }
        })
	}
}
	//点击事件
	function onRegionClick(){
		var zTree = $.fn.zTree.getZTreeObj("regionTree");
		nodes = zTree.getSelectedNodes();
		var v = nodes[0].name;
		var code=nodes[0].code;
		var parentNode=nodes[0].getParentNode();
		var name="";
		if(parentNode!=null){
			name=parentNode.getParentNode().name+"-"+parentNode.name+"-"+v;
		}else{
			name=parentNode.name+"-"+v;
		}
		var cityObj = $("#regionSel");
		cityObj.attr("value", name);
		//给regionalism赋code值
		$("input[name='regionalism']").attr("value",code);
		//把提醒消息去掉
		$(".lists").parent().find("i").text("");
		//关闭
		hideRegion();
	}
	function hideRegion() {
		$("#regionContent").fadeOut("fast");
		$("body").unbind("mousedown", onBodyDownRegion);
	}
	function onBodyDownRegion(event) {
		if (!(event.target.id == "regionBtn" || event.target.id == "regionContent" || $(event.target).parents("#regionContent").length>0)) {
			hideRegion();
		}
	}
	//节点展开前（左侧菜单树）
	function beforeRegionExpand(treeId, treeNode){
	    singleRegionPath(treeNode);
	}
	//保持展开单一节点
	function singleRegionPath(currNode) {
	    var cLevel = currNode.level;
	    //这里假设id是唯一的
	    var cId = currNode.id;
	    //此对象可以保存起来，没有必要每次查找
	    var treeObj = $.fn.zTree.getZTreeObj('regionTree');
	    //展开的所有节点，这是从父节点开始查找（也可以全文查找）
	    var expandedNodes = treeObj.getNodesByParam("open", true, currNode.getParentNode());
	    for(var i = expandedNodes.length - 1; i >= 0; i--){
	        var node = expandedNodes[i];
	        var level = node.level;
	        var id = node.id;
	        if (cId != id && level == cLevel) {
	            treeObj.expandNode(node, false);
	        }
	    }
	}
	//给传过来的值 赋值
	function ztreeRegionClick(){
		var treeCode = $("input[name='regionalism']").val();
		if(treeCode!=null && treeCode.trim()!=""){
			$.ajax({
	            method:'post',
	            url:manageUrl+'/homeController/getNameStrByCode',
	            data:{"code":treeCode},
	            success:function(res){
	            	if(res.code==200){
	            		$("#regionSel").attr("value", res.data);
		        	}
	            }
	        })
		 }
	}
	//默认展开山西省
	function getOpen(){
         var treeObj = $.fn.zTree.getZTreeObj("regionTree");  //得到该tree
         var node = treeObj.getNodeByParam("code", "140000", null); //选中山西
         var event=window.event || arguments.callee.caller.arguments[0];
         onRegionExpand(event,'regionTree',node);
	}
	//弹框选择保险公司点击确定
	function confirm(){
		var value=$(".pay_gwcactivity").attr("data-id");
		$(".visualSelect").attr("data-id",value);
		if(value==0){
			$(".visualSelect").text("中国人民保险");
			//如果初始化没有点击，默认给赋值并显示上传文件
			$("#insuranceCompany").val("PICC");
			$("#file-row").toggle($("#insuranceCompany").val()=="PICC");
		}else if(value==1){
			$(".visualSelect").text("太平洋保险");
		}else if(value==2){
			$(".visualSelect").text("中华保险");
		}else if(value==3){
			$(".visualSelect").text("中国大地保险");
		}
		if(value==1){
			$("#invoice").text("* 发票抬头默认为投保人");
			$(".inviceMessage").find("input").attr("readonly",true);
			$(".inviceMessage").find("input").css("cursor","not-allowed");
			$(".inviceMessage").find("input").parent().css("background-color","#efefef");
		}else{
			$("#invoice").text("");
			$(".inviceMessage").find("input").attr("readonly",false);
			$(".inviceMessage").find("input").css("cursor","");
			$(".inviceMessage").find("input").parent().css("background-color","");
		}
		//选择换水印
		$('.watermark').remove();
		var img='/static/images/Insurance'+(value*1+1)+'.jpg';
		watermark({},img);
		//隐藏弹框
		$('.zhuyi_wrap').hide();
	}

$(function(){
    //上传图片
	$("#imageFile").change(function(){
		var insuranceCompany=$("#insuranceCompany").val();
        var files = this.files;
        var imgName="";
        if(files.length>0){
        	imgName=files[0].name;
        }
        //var imgName = document.all.imageFile.value;
        var ext="";
        if(imgName==""){
            layer.msg('请选择需要上传的文件!', {icon: 5});
            var fileTd=$("#fileImg").parent();
            fileTd.html('<img id="fileImg" style="width: 120px;height: 125px;margin-top: 17px;background: #fff;">');
            $("#text").text("未选择文件");
            $("#text").attr("title","未选择文件");
            //把file设置为空的
            $(":hidden[name='fileKey']").val("");
            $(":hidden[name='fileKey']").attr("_val","");
            $(":hidden[name='imageFile']").val("");
            //隐藏进度条
            $("#schedule").hide();
            return false;
        }else{
            idx = imgName.lastIndexOf(".");
            if (idx != -1){
                ext = imgName.substr(idx+1).toUpperCase();
                ext = ext.toLowerCase( );
                if (ext != 'jpg' && ext != 'png' && ext != 'jpeg'&& ext != 'bmp'&& ext != 'zip'){
                    layer.msg('只能上传.jpg .png .jpeg .bmp .zip类型的文件!', {icon: 0});
                    //把file设置为空的
                    $(":hidden[name='fileKey']").val("");
                    $(":hidden[name='fileKey']").attr("_val","");
                    $(":hidden[name='imageFile']").val("");
                    var file = document.getElementById('imageFile');
                    file.value = ''; //虽然file的value不能设为有字符的值，但是可以设置为空值
                    //file.outerHTML = file.outerHTML; //重新初始化了file的html
                    $("#text").text("未选择文件");
                    $("#text").attr("title","未选择文件");
                    $("#fileImg").attr("src", "/static/images/white.png");
                    //隐藏进度条
                    $("#schedule").hide();
                    return false;
                }
            }
            //是否ie
            var isIE = /msie/i.test(navigator.userAgent) && !window.opera;
            var fileSize = 0;
            var filemaxsize = 1024*20*1024;//20M
            //获取file的大小
            if (isIE && !target.files){
                var filePath = target.value;
                var fileSystem = new ActiveXObject("Scripting.FileSystemObject");
                var file = fileSystem.GetFile (filePath);
                fileSize = file.Size;
            } else {
                fileSize = files[0].size;
            }
            if(fileSize>filemaxsize){
                layer.msg("文件大小不能超过20M！", {icon: 0});
                //把file设置为空的
                $(":hidden[name='fileKey']").val("");
                $(":hidden[name='fileKey']").attr("_val","");
                $(":hidden[name='imageFile']").val("");
                var file = document.getElementById('imageFile');
                file.value = ''; //虽然file的value不能设为有字符的值，但是可以设置为空值
                //file.outerHTML = file.outerHTML; //重新初始化了file的html
                $("#text").text("未选择文件");
                $("#fileImg").attr("src", "/static/images/white.png");
                return false;
            }
            //显示上传的文件
            var url = null;
            if (window.createObjectURL != undefined) { // basic
                url = window.createObjectURL(files[0]);
            } else if (window.URL != undefined) { // mozilla(firefox)
                url = window.URL.createObjectURL(files[0]);
            } else if (window.webkitURL != undefined) { // webkit or chrome
                url = window.webkitURL.createObjectURL(files[0]);
            }
            var ot;
            var oloaded;
            var formData = new FormData();
            formData.append("imageFile",files[0]);
            $.ajax({
                url:"/insure/upload?insuranceCompany="+insuranceCompany,
                type:"POST",
                data:formData,
                processData : false,
                contentType:false,
                dataType:"json",
                success:function(data){
                	console.log(data);
                	if(data.success){
                		var fileKey=data.data.fileKey;
                        var fileName=data.data.fileName;
                        var fileUrl=data.data.fileUrl;
                        //把返回的key设置到隐藏的input上
                        $(":hidden[name='fileKey']").val(fileName);
                        $(":hidden[name='fileKey']").attr("_val",fileName);
                        $(":hidden[name='imageFile']").val(fileUrl);
                        if(ext=="zip"){
                            $("#fileImg").attr("src", "/static/images/a7.png");
                        }else{
                            $("#fileImg").attr("src", url);
                        }
                        $("#text").text(files[0].name);
                        $("#text").attr("title",files[0].name);
                        $("#schedule").next().text("");
                	}
                },
                error:function(e){
                    layer.msg("文件未上传成功，请重新上传", {icon: 0});
                    //把file设置为空的
                    $(":hidden[name='fileKey']").val("");
                    $(":hidden[name='fileKey']").attr("_val","");
                    $(":hidden[name='imageFile']").val("");
                    var file = document.getElementById('imageFile');
                    file.value = ''; //虽然file的value不能设为有字符的值，但是可以设置为空值
                    //file.outerHTML = file.outerHTML; //重新初始化了file的html
                    $("#text").text("未选择文件");
                    $("#fileImg").attr("src", "/static/images/white.png");
                    //隐藏进度条
                    $("#schedule").hide();
                },
                xhr:function(){
                    var myXhr = $.ajaxSettings.xhr();
                    if (myXhr.upload) {
                        myXhr.upload.onloadstart = function () {//上传开始执行方法
                            ot = new Date().getTime();   //设置上传开始时间
                            oloaded = 0;//设置上传开始时，以上传的文件大小为0
                        };
                        //绑定progress事件的回调函数
                        myXhr.upload.addEventListener('progress', function(event){
                            //console.log(event);
                            $("#schedule").show();
                            var progressBar = document.getElementById("progressBar");
                            var percentageDiv = document.getElementById("percentage");
                            // event.total是需要传输的总字节，event.loaded是已经传输的字节。如果event.lengthComputable不为真，则event.total等于0
                            if (event.lengthComputable) {//
                                progressBar.max = event.total;
                                progressBar.value = event.loaded;
                                percentageDiv.innerHTML = Math.round(event.loaded / event.total * 100) + "%";
                            }
                            var time = document.getElementById("time");
                            var nt = new Date().getTime();//获取当前时间
                            var pertime = (nt-ot)/1000; //计算出上次调用该方法时到现在的时间差，单位为s
                            ot = new Date().getTime(); //重新赋值时间，用于下次计算

                            var perload = event.loaded - oloaded; //计算该分段上传的文件大小，单位b
                            oloaded = event.loaded;//重新赋值已上传文件大小，用以下次计算
                            //上传速度计算
                            var speed = perload/pertime;//单位b/s
                            var bspeed = speed;
                            var units = 'b/s';//单位名称
                            if(speed/1024>1){
                                speed = speed/1024;
                                units = 'k/s';
                            }
                            if(speed/1024>1){
                                speed = speed/1024;
                                units = 'M/s';
                            }
                            speed = speed.toFixed(1);
                            //剩余时间
                            var resttime = ((event.total-event.loaded)/bspeed).toFixed(1);
                            time.innerHTML = '速度：'+speed+units+'，剩余时间：'+resttime+'s';
                            if(bspeed==0) {
                                time.innerHTML = '上传已取消';
                            }
                        }, false);
                    }
                    return myXhr;
                }
            });
        }
    })
});
//上传营业执照
function clickImgFile(){
	$('#imgFile').click();
}
function imageFileChange(obj){
    var file=obj.files[0];
    if(file!=null){
        //验证文件格式和大小
        if(file.size>1024*1024*10){
            layer.msg("所选文件超出允许上传文件大小",{icon:0,time:2000});
            var imgFile = $("#imgFile");
            imgFile.after(imgFile.clone().val(""));
            imgFile.remove();
            $("#imgFile").parent().attr("src", "/static/images/white.png");
            return false;
        }
        var fileName=file.name;
        var suffix=fileName.substring(fileName.lastIndexOf(".")+1,fileName.length);
        var allow=['jpg','png','jpeg'];
        if(allow.indexOf(suffix)<0){
            layer.msg("暂不支持该类型文件",{icon:0,time:2000});
            var imgFile = $("#imgFile");
            imgFile.after(imgFile.clone().val(""));
            imgFile.remove();
            $("#imgFile").parent().attr("src", "/static/images/white.png");
            return false;
        }
        getObjectURL(file,$('#imgFileValue'));
    }
}
function getObjectURL(file,obj) {
    var url = null ;
    if (window.createObjectURL!=undefined) { // basic
        url = window.createObjectURL(file) ;
    } else if (window.URL!=undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file) ;
    } else if (window.webkitURL!=undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file) ;
    }
    uploadFile(file,obj,url);
}
function uploadFile(file,obj,url){
	var formData = new FormData();
    formData.append("imageFile",file);
    /*obj.val(file.name);
    if(obj.attr("id")=="pdfFileValue"){
    	obj.next().text(file.name);
    	obj.attr("data-url","http://img.sxdeliw.com/group1/M00/01/3C/rBpVRF7VrYeARbhIAAUgehCHl1c249.jpg");
    	obj.prev().prev().attr("src", "/static/images/a7.png");
    }else{
    	obj.attr("data-url",url);
    	obj.prev().prev().attr("src", url);
    }*/
   $.ajax({
        url:"/insure/upload?insuranceCompany=CCIC",
        type:"POST",
        data:formData,
        processData : false,
        contentType:false,
        dataType:"json",
        success:function(data){
        	console.log(data);
        	if(data.success){
        		var fileKey=data.data.fileKey;
                var fileName=data.data.fileName;
                var fileUrl=data.data.fileUrl;
                //把返回的key设置到隐藏的input上
                obj.val(fileName);
                obj.attr("data-url",fileUrl);
                if(obj.attr("id")=="pdfFileValue"){
                	obj.next().text(file.name);
                	obj.next().attr("title",file.name);
                	obj.prev().prev().attr("src", "/static/images/a7.png");
                }else{
                	obj.prev().prev().attr("src", url);
                }
        	}
        },
        error:function(e){
            layer.msg("文件未上传成功，请重新上传", {icon: 0});
            obj.after(obj.clone().val(""));
            obj.remove();
            obj.prev().attr("src", "/static/images/white.png");
        }
    });
}
//上传pdf的招标文件
function clickPdfFile(){
	$("#pdfFile").click();
}
function pdfFileChange(obj){
	 var file=obj.files[0];
	    if(file!=null){
	        //验证文件格式和大小
	        if(file.size>1024*1024*10){
	            layer.msg("所选文件超出允许上传文件大小",{icon:0,time:2000});
	            var pdfFile = $("#pdfFile");
	            pdfFile.after(pdfFile.clone().val(""));
	            pdfFile.remove();
	            $("#pdfFile").parent().attr("src", "/static/images/white.png");
	            return false;
	        }
	        var fileName=file.name;
	        var suffix=fileName.substring(fileName.lastIndexOf(".")+1,fileName.length);
	        var allow=['pdf'];
	        if(allow.indexOf(suffix)<0){
	            layer.msg("暂不支持该类型文件",{icon:0,time:2000});
	            var pdfFile = $("#pdfFile");
	            pdfFile.after(pdfFile.clone().val(""));
	            pdfFile.remove();
	            $("#pdfFile").parent().attr("src", "/static/images/white.png");
	            return false;
	        }
	        //上传接口
	        uploadFile(file,$("#pdfFileValue"));
	    }
}