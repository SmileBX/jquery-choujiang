function popup(id){
	$("#"+id).show();
}
function popuphide(id){
	$("#"+id).hide();
}
function msgTip(msg){
	$("#tip_msg_content").html(msg);
	popup('tip_msg');
}
var activityId=getUrlParam("id");//获取链接携带活动id
// var activityId=6;//获取链接携带活动id
var status= false;//大转盘可启动状态
var shopid='';//店铺id
var phone =getUrlParam("phone");
var shopList=[];
var dataList = []
var siteList = [];//地区列表
var InterValObj1 = null
var curCount1 = "" //验证码倒计时
var code="";//短信验证码
$(function(){
		show(5236)
		phone = $("#phone").val()
		// 请求活动是否结束，未结束返回店铺列表
		$('#shopId').hide();
		$('#receive3').hide();
		$.ajax({
			url:"http://h5api.wtvxin.com/api/Activity/GetActivity?id="+activityId,
			type:"POST",
			success:function(res){
				console.log(res)
				// 活动未结束
				if(res.code==0){
					document.title=res.title
					hasTime=true;
					$("#shopName").val(res.obj[0].List[0].ShopName)
					shopid=res.obj[0].List[0].id
					$("#siteName").val(res.obj[0].City)//..
					dataList=res.obj
					shopList = res.obj[0].List
					console.log(shopList,'res.obj[0].List[0]')
					let siteObj = {}
					let id = 0
					res.obj.forEach(item=>{
						siteObj = {
							Id: id++,
							City:item.City
						}
						siteList.push(siteObj)
					})
					console.log(siteList,"site")/*onclick='selectSite("+item.Id+")'  */
					siteList.map(item=>{
						let siteItem = "<div data-id="+item.Id+"  class='siteTap'>"+item.City+"</div>"
						$('#siteId').append(siteItem)
					})
				   
					shopList.forEach(item => {/**onclick='selectShop("+item.id+")' */
						let shopItem="<div data-shopid="+item.id+" class='shopTap' >"+item.ShopName+"</div>"
						$('#shopId').append(shopItem)
					});
					$(".mask").hide()
					if(res.data){
						$("html,body").css("background-image","url("+res.data+")");
					}
				}
				// 活动已结束
				else{	
					msgTips(res.msg)
					$(".mask").hide()
				}
			}
		})
		getActionText();// 活动介绍
		// 选择店铺
		// function selectShop(id){
		// 	event.stopPropagation()   
		// 	console.log(id)
		// 	shopid=id;
		// 	shopList.forEach(item => {
		// 		if(item.id==shopid){
		// 			$("#shopName").val(item.ShopName);
		// 			console.log(item.ShopName)
		// 			$('#shopId').hide();
		// 		}
		// 	});
			
		// }
		$("#siteId").on("click",".siteTap",function(){
			event.stopPropagation()  
			var i = $(this).attr("data-id");
			console.log(i)
			$('#shopId').empty()
			siteList.forEach(item => {
				if(item.Id==i){
					$("#siteName").val(item.City);
					console.log(item.City)
					$('#siteId').hide();
					dataList.map(value=>{
						console.log(value)
						if(value.City == item.City){
								shopList =value.List
								$("#shopName").val(shopList[0].ShopName);
                                shopid=shopList[0].Id
								shopList.forEach(item => {
								let shopItem="<div data-shopid="+item.id+" class='shopTap' >"+item.ShopName+"</div>"
								$('#shopId').append(shopItem)
							});
						}
					})
					console.log(shopList,"shopList")
					
				}
			});
		})
		$("#shopId").on("click",".shopTap",function(){
			event.stopPropagation()  
			var tt = $(this).attr("data-shopid");
			console.log(tt,"lllllllllllllll")
			shopid=tt;
			shopList.forEach(item => {
				if(item.id==shopid){
					$("#shopName").val(item.ShopName);
					console.log(item.ShopName)
					$('#shopId').hide();
				}
			});
		})
		//选择地区
		// function selectSite(i){
		// 	event.stopPropagation()   
		// 	console.log(i)
		// 	$('#shopId').empty()
		// 	siteList.forEach(item => {
		// 		if(item.Id==i){
		// 			$("#siteName").val(item.City);
		// 			console.log(item.City)
		// 			$('#siteId').hide();
		// 			dataList.map(value=>{
		// 				console.log(value)
		// 				if(value.City == item.City){
		// 						shopList =value.List
		// 						$("#shopName").val(shopList[0].ShopName);
        //                         shopid=shopList[0].Id
		// 						shopList.forEach(item => {
		// 						let shopItem="<div onclick='selectShop("+item.id+")'>"+item.ShopName+"</div>"
		// 						$('#shopId').append(shopItem)
		// 					});
		// 				}
		// 			})
		// 			console.log(shopList,"shopList")
					
		// 		}
		// 	});
			
		// }
		$("#siteBox").click(function(){
			console.log("111111")
			$('#siteId').toggle();
		});
		$("#shopBox").click(function(){
			console.log("111111")
			$('#shopId').toggle();
		});
        //提交店铺电话等信息，检查是否有抽奖次数
        $("#submit").click(function () {
            phone = $("#phone").val()
            var r_phone = /^[1]+\d{10}/;
            if (phone == "") {
                msgTips("手机号不能为空");
                return false;
            }
            if (!r_phone.test(phone)) {
                msgTips("请输入正确的手机号");
                return false;
            }
            $.ajax({
                type: "POST",
                url: "http://h5api.wtvxin.com/api/JoinActivities/GetJoinActivities?mobile=" + phone +
                    "&activityId=" + activityId + "&shopid=" + shopid+"&code="+code,
                // data: {
                //     mobile:"15927443397",
                //     shopid:2
                // },
                success: function (res) {
                    console.log(res)
                    if (res.code == 0) {
                        status = true;
						// getWinningResult();// 中奖结果
                    } else {
						msgTips(res.msg)
                    }
					$('#receive3').hide();
                }
            })
		});
		//发送验证码
		$(".code-sj").click(function(){
			console.log("9999999")
			curCount1 = 59;
			phone=$("#phone").val()
			var r_phone = /^[1]+\d{10}/;
			if (phone == "") {
				msgTips("手机号不能为空");
				return false;
			}
			if (!r_phone.test(phone)) {
				msgTips(" 请输入正确的手机号");
				return false;
			}
			//设置button效果，开始计时
			$(".code-sj").attr("disabled", "true");
			$(".code-sj").html(+curCount1 + "秒再获取");
			InterValObj1 = window.setInterval(SetRemainTime1, 1000); //启动计时器，1秒执行一次
			//向后台发送处理数据
			getSmCode()

		});
	var $btn = $('#playbtn');
	var isture = false;//默认为没转转
	var playnum=parseInt($("#playnum").html());
	var playnumId=parseInt($("#playnumId").html());
	var openid=$("#openid").val();
	var actId=$("#actId").val();
	var jwid=$("#jwid").val();
	var basePath=$("#basePath").val();
	var utoken=$("#utoken").val();
	var clickfunc = function() {
		// var url=basePath+"/luckyroulette/luckDraw.do";
		var url=`http://h5api.wtvxin.com/api/LotteryDraw/Lotterydraw?mobile=${phone}&activityId=${activityId}&shopId=${shopid}&code=${code}`;
		$.ajax({
			url:url,
			type:"POST",
			dataType:"JSON",
			data:{
			},
			success:function(data){
				// 抽奖成功
				if(data.code===0){
					switch(data.price.Grade){
						case "特等奖":rotateFunc('特等奖',300,data.price.Title);break;
						case "一等奖":rotateFunc('一等奖',0,data.price.Title);break;
						case "二等奖":rotateFunc('二等奖',60,data.price.Title);break;
						case "三等奖":rotateFunc('三等奖',180,data.price.Title);break;
						case "四等奖":rotateFunc('四等奖',240,data.price.Title);break;
						default :rotateFunc('谢谢参与',120);break;
					}
				}else if(data.code===0){
					msgTips('很遗憾，您的抽奖次数已用完！')
					rotateFunc('谢谢参与',120)
				}else if(data.code===4){
					msgTips('很遗憾，您的抽奖次数已用完！')
					// rotateFunc('谢谢参与',120)
				}else{
					rotateFunc('谢谢参与',120)
					// msgTips(data.msg)
				}
			},
			error:function(){
				msgTips('抽奖失败！请刷新页面重新')
			}
		});
		
	}
	// 点击开始抽奖
	$btn.click(function() {
		if(!phone){
			$('#receive3').show();
			return false;
		}
		// 未满足抽奖条件
		if(!status){
			msgTips('未满足抽奖条件，刷新页面重试！');
			return false;
		}
		if (isture){// 如果在执行就退出
			return; 
		}
		isture = true; // 标志为 在执行
		console.log(isture)
		clickfunc();
		return ;
		playnum=parseInt($("#playnum").html());
		playnumId=parseInt($("#playnumId").html());  //剩余抽奖次数
		var actStatus=$("#actStatus").val();
		if(actStatus=='noStart'||actStatus=='isEnd'){
			isture = false;
			$("#actMsg").css("display","block");
		}else{
			if (playnum <= 0) { // 当抽奖次数为0的时候执行
				var shareFlag=$("#shareFlag").val();
				var countFlag=$("#countFlag").val();
				if('1'==countFlag){
					popup("runoutcountnum"); //抽奖总次数已用完
					isture = false;
				}else{
					//有额外的抽奖机会
					if('0'==extraLuckyDraw){
						//已经分享过
						if(shareFlag=="0"){
							$('#playnum').html(0);
							$('#playnumId').html(0);
							/*if($("#countFlag").val()=="1"){
						popup("runoutcountnum");
					}else{*/
							popup('runoutnum');
							//}
							isture = false;
							//未分享
						}else if(shareFlag=="1"){
							popup('fxpy');
							$('#playnum').html(0);
							$('#playnumId').html(0);
							isture = false;
						}
					}else{
						//没有额外的抽奖机会
						/*if($("#countFlag").val()=="1"){
						popup("runoutcountnum");
					}else{*/
						popup('runoutnum');
						//}
						$('#playnum').html(0);
						$('#playnumId').html(0);
						isture = false;
					}
				}
				
			} else { // 还有次数就执行
				playnum = playnum - 1; // 执行转盘了则次数减1
				playnumId=playnumId-1;
				if (playnum <= 0) {
					playnum = 0;
				}
				clickfunc();
			}
		}
	});
	var rotateFunc = function(awards,angle,Title) {console.log(angle)
		$btn.rotate({
			angle : 0,
			duration : 6000, // 旋转时间
			animateTo : angle + 2160, // 让它根据得出来的结果加上360*6圈旋转
			callback : function() {
				$('#playnum').html(playnum);
				$('#playnumId').html(playnumId);
				
				switch(awards){
					case "特等奖":msgTips('恭喜你中了'+awards+Title+'!');break;
					case "一等奖":msgTips('恭喜你中了'+awards+Title+'!');break;
					case "二等奖":msgTips('恭喜你中了'+awards+Title+'!');break;
					case "三等奖":msgTips('恭喜你中了'+awards+Title+'!');break;
					case "四等奖":msgTips('恭喜你中了'+awards+Title+'!');break;
					default :msgTips('谢谢参与');break;
				}
				isture = false; // 标志为 执行完毕
				// switch(awards){
				// 	case "1":popup('grandPrize');break;//特等奖
				// 	case "2":popup('prize1');break;//一等奖
				// 	case "3":popup('prize2');break;//二等奖
				// 	case "4":popup('prize3');break;//三等奖
				// 	case "5":popup('prize4');break;//四等奖
				// 	case "6":popup('prize5');break;//五等奖
				// 	case "7":popup('prize6');break;//六等奖
				// 	case "8":popup('noprize');break;//没中奖
				// 	case "9":popup('runoutnum');break;//单日次数已用完
				// 	case "10":popup('runoutcountnum');break;//总次数已用完
				// 	case "11":popup('bkzcy');break;//总次数已用完
				// 	default:popup('error');
				// }

			}
		});
	};
	// 点击查看中奖结果列表
	$("#trophy").click(function () {
		console.log(phone,'activityId')
		if (phone) {
			location.href = "trophy.html?id=" + activityId + "&phone=" + phone;
		}else{
			$('#receive3').show();
		}
	});

});

//关闭popup弹框并且刷新页面
function closePopup(id){
	popuphide(id);
	location.reload();
}
// 提示
function msgTips(msg) {
	layer.open({
		content: "<span>" + msg + "</span>",
		skin: 'msg',
		time: 3 //2秒后自动关闭
	});
}

// 活动介绍
function getActionText(){
	$.ajax({
		url:'http://h5api.wtvxin.com/api/LotteryDraw/activitygz?activityId='+activityId,
		type:"POST",
		success:function (res){
			if(res.code===0){
				$("#contentText").append(res.Content)
			}
		}
	})
}	
// 中奖结果
function getWinningResult(){
	$.ajax({
	type: "POST",
	url: "http://h5api.wtvxin.com/api/LotteryDraw/activityzjlb?moblie="+phone+"&activityId="+activityId,
	data: {
		// activityId:2,
		//mobile:"15868306120"
	},
	// dataType:"json",
	success: function (res) {
		$('.trophyList').empty()
		if(res.code==0){
			res.ct.forEach(item => {
				item.Addtime=item.Addtime.replace(/T/g, " ").substr(0,19)
				let shopItem="<div class='item'><span>"+item.Jpname+"</span><span>"+item.Addtime+"</span><span>"+item.Amount+"</span></div>"
				$('.trophyList').append(shopItem)
			});
		}else if(res.code==3){
			let shopItem="<p class='item'>您目前暂无奖品，马上去试试手气吧！</p>"
			$('.trophyList').append(shopItem)
		}else if(res.code==4){
			let shopItem="<p class='item'>很遗憾<br>抽奖次数已用完！</p>"
			$('.trophyList').append(shopItem)
		}
	}
})
}
//获取链接参数
function getUrlParam(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var url = window.location.search.substr(1); //.toLowerCase();
	var r = url.match(reg);
	if(r != null) return unescape(r[2]);
	return null;
}
 //图形验证码
 function show(show_num){
	// show_num = 4
	console.log(show_num.toString().length,"//////////////")
	// var canvas_width=$("#canvas").width();
	// var canvas_height=$("#canvas").height();
	var canvas=document.getElementById("canvas");
	var context=canvas.getContext("2d");
	canvas.width=canvas_width;

	//获取屏幕的宽度
	var clientWidth = document.documentElement.clientWidth;
	console.log(clientWidth,"clientWidth/////")
	var canvas_width = Math.floor(clientWidth*200/1000);
	var canvas_height = Math.floor(clientWidth*200/2500);
	canvas.setAttribute('width',canvas_width+'px');
	canvas.setAttribute('height',canvas_height+'px');
	canvas.width=canvas_width;
	console.log("111111")
	context.fillStyle="rgba(100, 40, 40, 0.3)";
	context.fillRect(0,0,canvas_width,canvas_height);
	console.log("2222222")
	var font = 0
	font = Math.floor(clientWidth*200/4000)
	for(var i=0;i<show_num.toString().length;i++){
		console.log(i,"i///////////")
		var deg=Math.random()*30*Math.PI/180;
		var txt=show_num.toString().charAt(i);
		console.log(txt,"txt")
		// var x=i*18+10;//文字在canvas上x坐标
		 var x=i*font+10;//文字在canvas上x坐标
		var y=Math.random()*3;//文字在canvas上y坐标
		
		// context.font="bold 18px 微软雅黑";
		context.font="bold"+" "+ font+"px"+" 微软雅黑";
		context.translate(x,y);
		context.rotate(deg);
		
		context.fillStyle=randomColor();
		// context.fillStyle="#ff0000";
		context.fillText(txt,0,font);

		context.rotate(-deg);
		context.translate(-x,-y);        
	}

	for(var i=0;i<=4;i++){
		//验证码上显示线条
		context.strokeStyle=randomColor();
		context.beginPath();
		context.moveTo(Math.random()*canvas_width,Math.random()*canvas_height);
		context.lineTo(Math.random()*canvas_width,Math.random()*canvas_height);
		context.stroke();
	}

	for(var i=0;i<=30;i++){
		//验证码上显示小点
		context.strokeStyle=randomColor();
		context.beginPath();
		var x=Math.random()*canvas_width;
		var y=Math.random()*canvas_height;
		context.moveTo(x,y);
		context.lineTo(x+1,y+1);
		context.stroke();
	}

}
function randomColor(){
	//得到随机的颜色值
	var r=Math.floor(Math.random()*256);
	var g=Math.floor(Math.random()*256);
	var b=Math.floor(Math.random()*256);
	return "rgb("+r+","+g+","+b+")"
}

function SetRemainTime1(){
	if(curCount1 == 1){
		window.clearInterval(InterValObj1); //停止计时器
		$(".code-sj").removeAttr("disabled"); //启用按钮
		$(".code-sj").text("重新发送");
	}else{
		console.log(curCount1,"ppppppp")
		curCount1--;
		$(".code-sj").text(+curCount1 + "秒再获取");
	}
}
function getSmCode(){
	$.ajax({
		type: "POST",
		url: "http://h5api.wtvxin.com/api/JoinActivities/GetSms?mobile="+phone+"&activityId="+activityId,
		// data: {
		//     mobile:"15927443397",
		//     shopid:2
		// },
		success: function (res) {
			console.log(res)
			if(res.code==1){
				code=res.data;
				msgTips("获取成功")
			}else{
				msgTips("")
			}
		}
	})
}	
