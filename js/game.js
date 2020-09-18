var close = 0; //关闭声音
var stop = 0; //暂停游戏
var stime = 0; //老鼠出现的时间
var stime2 = 0; //老鼠出现的时间
var sm1 = 0; //老鼠出现的位置
var sm3 = 0; //老鼠出现的位置
var sm2 = 0; //倒计时
var score = 0; //游戏得分
var time = 30; //初始时间
var pass = 1; //设置关卡
var hitsum = 0; //锤

/*
获取老鼠图片
 * 计分规则：打中老鼠得分
 * 	老鼠1  + 总分的20%   
 * 	老鼠2  +100    
 * 	老鼠3  +500   
 * 	老鼠4  -100   
 * 	老鼠5    总分/2
 * 
 * 关卡说明
 * 总共2关
 * 第一关：
 *    1. 总共时长60秒，每秒出现1只老鼠
 *    2. 总分大于等于2000分即进入下一关
 * 
 * 第二关：
 *    1. 总共时长90秒，每秒同时出现2只老鼠
 *    2. 总分大于等于5000分即过关
 * 
 */

var mouse = {
	m1: {
		score: function(score) {
			return(score + (score * 0.2));
		},
		pos: [{
			m: 'url(img/m1.png)',
			m1: 'url(img/m1-1.png)'
		}]
	},
	m2: {
		score: function(score) {
			return parseInt(score + 100);
		},
		pos: [{
			m: 'url(img/m2.png)',
			m1: 'url(img/m2-1.png)'
		}]
	},
	m3: {
		score: function(score) {
			return(score + 500);
		},
		pos: [{
			m: 'url(img/m3.png)',
			m1: 'url(img/m3-1.png)'
		}]
	},
	m4: {
		score: function(score) {
			var c = score - 100;
			return(c < 0 ? 0 : c);
		},
		pos: [{
			m: 'url(img/m4.png)',
			m1: 'url(img/m4-1.png)'
		}]
	},
	m5: {
		score: function(score) {
			var c = score / 2;
			return(c < 0 ? 0 : c);
		},
		pos: [{
			m: 'url(img/m5.png)',
			m1: 'url(img/m5-1.png)'
		}]
	}
};

//声音控制
function setSounds(e) {
	var ad = document.querySelector("#ad");
	if(close % 2 == 0) {
		ad.muted = true;
		e.style.background = 'url(img/sound1.png)';
	} else {
		ad.muted = false;
		e.style.background = 'url(img/sound0.png)';
	}
	close++;
}

//游戏帮助按钮事件
function showHelp(e) {
	//获取初始界面对象
	var help = document.querySelector("#gamehelp");
	help.style.display = 'block';
	e.parentNode.style.display = 'none';
}

//返回首页
function backMain(e) {
	//获取初始界面对象
	var main = document.querySelector("#gamemain");
	main.style.display = 'block';
	e.parentNode.style.display = 'none';
}

//重新开始游戏
function restartGame(e) {
	//获取游戏页面
	var game = document.querySelector("#gamebody");
	game.style.display = 'block';
	e.parentNode.style.display = 'none';
	esc();
	score = 0; //分数清零
	showScore(); //重新显示分数
	start();
}

//退出 其实没有退出
function exit() {
	var str = "其实没有退出游戏\n因为是没有其他键\n这就放个退出键咯 \n"
	alert(str);
}

//开始游戏
function startGame(e) {
	//获取初始界面对象
	var main = document.querySelector("#gamebody");
	main.style.display = 'block';
	e.parentNode.style.display = 'none';
	//开始计时
	start();
}
//开始计时
function start() {
	if(pass==2){
		sm1 = setInterval("showMouse()", 1200);	
		sm3 = setInterval("showMouse()", 1800);	
	}else{
		sm1 = setInterval("showMouse()", 1000);		
	}
	sm2 = setInterval("setTime()", 1000);
}

//设置时间
function setTime() {
	time--;
	document.querySelector("#time").innerHTML = time;
	if(time <= 0) {
		esc();
		if(score > 2000) {
			//提示过关
			var next = document.querySelector("#result");
			var s = document.querySelector("#sresult");
			s.innerHTML = score;
			next.style.display = 'block';
		} else {
			//提示结束
			var gm = document.querySelector("#gamebody");
			var end = document.querySelector("#gameover");
			var rs = document.querySelector("#end_result");
			//显示最后得分
			rs.innerHTML = score;
			gm.style.display = 'none';
			end.style.display = 'block';
		}

	}
}

/*
 * 进入下一关
 */
function nextPass(e) {
	//隐藏结果层
	var end = e.parentNode;
	end.style.display = 'none';
	time = 60; //设置时间
	score = 0; //结果清零
	pass++; //设置关卡
	start();  //重新开始游戏
}
//暂停游戏
function setStop(e) {
	if(stop % 2 == 0) {
		e.style.background = 'url(img/stop1.png)';
	} else {
		e.style.background = 'url(img/stop0.png)';
	}
	stop++;
}

/*
 * 随机生成老鼠
 */
function showMouse() {
	//随机生成老鼠
	var num = Math.floor(Math.random() * 5 + 1);
	//随机生成显示位置
	var setnum = Math.floor(Math.random() * 9 + 1);

	var m = mouse['m' + num].pos; //获取老鼠图片
	//显示老鼠
	var showm = document.querySelector("#m" + setnum);

	showm.style.backgroundImage = m[0].m;
	showm.dataset.mousenum = num;
	stime = setTimeout("disMouse(" + setnum + ")", 1000);

}

/*
 * 设置老鼠消失
 */
function disMouse(num) {
	var dism = document.querySelector("#m" + num);
	dism.style.backgroundImage = '';
}


/*
 * 打老鼠
 * @param {Object} e
 */
function hitMouse(e) {
	//获取当前背景坐标
	var mx = e.style.backgroundImage;
	
	if(mx != "") {
		//获取老鼠序号
		var mousenum = e.dataset.mousenum;
		//获取老鼠图片
		var m = mouse['m' + mousenum].pos;
		e.style.backgroundImage = m[0].m1;
		hitsum++;
		score = Math.floor(mouse['m' + mousenum].score(score));
		console.log(score);
		//重新显示
		showScore();
		
	}

}
/*
 * 显示分数
 */
function showScore() {
	var gewei = Math.floor(score % 10);
	var shiwei = Math.floor(score / 100 % 10);
	var baiwei = Math.floor(score / 100 % 10);
	var qianwei = Math.floor(score / 1000 % 10);
	var wanwei = Math.floor(score / 10000 % 10);
	var sc = "" + score;
	//清空所有样式
	var scspan = document.querySelector("#score").getElementsByTagName("span");
	for(i = 0; i < scspan.length; i++) {
		scspan[i].className = "";
	}
	//显示分数
	for(i = 0; i < sc.length; i++) {
		var cc = document.querySelector("#sc" + i);
		cc.classList.add("num" + sc.charAt(i));

	}
}

/*
 * 鼠标按下事件
 * @param {Object} e
 */
function mouseDown(e) {
	e.style.cursor = 'url(img/hm2.png),pointer';
}
/*
 * 鼠标松开事件
 * @param {Object} e
 */
function mouseUp(e) {
	e.style.cursor = 'url(img/hm1.png),pointer';
}

/*
 * 停止游戏
 */
function esc() {
	window.clearTimeout(stime);
	window.clearTimeout(stime2);
	window.clearInterval(sm1);
	window.clearInterval(sm2);
	window.clearInterval(sm3);	
	time = 30;
	
}