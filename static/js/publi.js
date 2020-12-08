function Score(obj){
	var _this = this;
	this.node  = obj.node;
	this.width = obj.width;
	this.height = obj.height;
	this.bgColor = obj.bgColor;
	this.score = obj.score;
	this.show = obj.show;
	$(this.node).append(this.createScore());
	this.initSet();
}

Score.prototype.createScore = function(){
    return '<div style="position: relative;"><div class="custom_score" style="position: relative;width: 300px;height: 8px;float: left;background: #e5e5e5;"><span class="custom_score-color" style="width: 70%;position: absolute;height: 8px;left: 0;top: 0;background: #21d376;"></span></div></div>'
}

Score.prototype.initSet = function(){
	var scoreNumber = $(this.node).find(".custom_score-number"),
	    score = $(this.node).find(".custom_score"),
	    scoreColor = $(this.node).find(".custom_score-color");
    if(this.score > 100 || this.score > this.width){
		alert("您输入的分值有误");
		return
	}			
    score.css({"width":this.width,"height":this.height});
	scoreColor.css({"background":this.bgColor,"height":this.height,"width":this.score+"%"});
	scoreNumber.css({"color":this.bgColor});
	scoreNumber.html(this.score + "%");
	if(this.show){
		scoreNumber.show();
	}else {
		scoreNumber.hide();
	}
}

//Score.prototype.setScore = function(num){
//  var scoreNumber = $(this.node).find(".custom_score-number"),
//	    scoreColor = $(this.node).find(".custom_score-color");			
//	if(num > 100 || num > this.width){
//		alert("您设置的分值有误");
//		return
//	}
//	scoreColor.css({"width":num + "%"});
//	scoreNumber.html(num + "%");
//}

//Score.prototype.getScore = function(){
//	var scoreNumber = $(this.node).find(".custom_score-number"),
//	    score = parseInt(scoreNumber.text());
//	    return score;
//}
//
//Score.prototype.disScore = function(bool){
//	var scoreNumber = $(this.node).find(".custom_score-number");
//	if(bool){ 
//      scoreNumber.show().css("display","inline");
//	}else{
//      scoreNumber.hide();
//	}
//     
//}
//
//Score.prototype.setTextColor = function(color){
//	$(this.node).find(".custom_score-number").css("color",color);
//}
//      