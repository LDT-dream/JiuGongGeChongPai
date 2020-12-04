function startAndStop(){
	document.write("开始按钮调用成功");
}

function Reset(){
	document.write("重置按钮调用成功");
}

var s = new Array(10); /*0-9每个框的情况，被数字占着or空着0*/
var s_can_walk = new Array(
	[0,0],
	[2,4],
	[1,3,5],
	[2,6],
	[1,5,7],
	[2,4,6,8],
	[3,5,9],
	[4,8],
	[5,7,9],
	[6,8]
);
var s_xyposition = new Array(
	[0,0],
	[0,0],
	[0,150],
	[0,300],
	[150,0],
	[150,150],
	[150,300],
	[300,0],
	[300,150],
	[300,300],
)

for (var i = 0; i < 9; i++) { s[i] = i;}/*默认9是空的，给1-8赋值*/
s[9] = 0;

function findPosition(from_number){
	for (var i = 1; i < s.length; i++) {
		if (s[i]==from_number){ //扫一遍s表，看看数字在哪个位置
			return i;
		}
	}
}
// 移动数字div，移动完顺便判断一下是否游戏结束
function move(from_number){

	var from_position = findPosition(from_number);
//	alert("数字在"+from_position);
	
	for (var i = 0; i < s_can_walk[from_position].length; i++) {
//		alert(s[ s_can_walk[from_position][i] ]);
		if ( s[ s_can_walk[from_position][i] ] == 0 ){ //有可以选择走的地方了
//			alert("要去位置是"+s_can_walk[from_position][i]);
			moveSquare(from_number,from_position, s_can_walk[from_position][i]);
			break;
		}
	}
	judge();
}

// 做一个移动操作试试看，包括移动，更新目前框的占用情况
function moveSquare(from_number,from_position, to_position){
	document.getElementById("small_bolck"+from_number).style.top=s_xyposition[to_position][0]+"px";
	document.getElementById("small_bolck"+from_number).style.left=s_xyposition[to_position][1]+"px";
	// 目的地的位置占用情况和源头地的都改下
	s[to_position] = s[from_position]; 
	s[from_position] = 0;
} 

// 判断游戏是否结束
function judge(){
	var end = 1;
	// 9的地方要是0，不是9
	for (var i = 1; i < s.length-1; i++) {
		if(s[i]!= i) {
			end= 0 ;
			break;
		}
	}
	if(s[9]!=0) end = 0;
	if(end==1) {alert("你赢了！"); startAndStop();}
}

// 随机布局
function randomLayout(){
	var right_layout = 1;
	// 从1开始,一个一个把数放进去,要是之前有的话,那就-1再放进去试试看
	do{
		for (var i = 0; i < s.length; i++) { s[i] = 0;}/*全设置为0，重新开始*/
		for (var i = 1; i < s.length-1; i++) { //9宫格里只有八个数！
			// 平均的得到1-9的一个数字
			var to_position = Math.ceil((Math.random()*8 + 1)) ; //random是生成0-1的数，要随机生成1-9的数
			// 下边是确保等概率且高效的去重复移动目的地的方式
			while(s[to_position]!=0){
				if(to_position==1) to_position=9;
				else to_position--;
			} 
			moveSquare(i,0, to_position);// 这样设置的话对s[0]没影响
			s[to_position] = i;
		}
		right_layout = judgeHaveSolution();
	}while(!right_layout); //当产生的初始布局无解时，重新产生	

}

//初始化函数，页面加载的时候调用重置函数，重新开始
window.onload=function(){
    randomLayout();
}

var pause = true;
function startAndStop(){
	// 开始计时
	var myclass = document.getElementsByClassName("square");
	if(pause){ //改字，改状态，开始计时+改div不能选定
		document.getElementById("start_and_stop").innerHTML = "暂停游戏";
		for (var i = 0; i < myclass.length; i++) {
			myclass[i].style.cssText += "pointer-events: auto;"/*开始了游戏才能点按钮*/
		}
		pause = false;
		set_timer = setInterval(timer,1000);
	}
	else{
		document.getElementById("start_and_stop").innerHTML = "开始游戏";
		for (var i = 0; i < myclass.length; i++) {
			myclass[i].style.cssText += "pointer-events: none;"/*停止了游戏就不能点按钮*/
		}
		pause = true;
		clearInterval(set_timer);	
	}
}

var time = 0;
// 计时函数,计时+改文字
function timer(){
	time ++;
	var sec = time%60;
	var min = (time-sec)/60;
	document.getElementById("timer").innerHTML =  min + "分" + sec + "秒";
}

function reset(){
	time = 0;
	if(pause==false){ //如果正在计时，就停下再开始
		startAndStop(); //其实按照逻辑的话，重新开始就是先停一次，再开始
	}
	startAndStop();// 但是如果没开始就先停止的话就会有error
	randomLayout(); // 所以在停止函数里写个有这个对象再停止√
	last="12345678.";
	alert("最终状态恢复为"+last); 
}

function judgeHaveSolution(){
	/*result = doubleBFS();
	set();
	if(result == -1) return false;
	else return true;
	下边那个不知道为什么没用，因为前边写错了...*/
	var inversion_number=0; //逆序数
	for (var i = 1; i < s.length; i++) { //i在前，j在后，求逆序数,从1求到9，要去掉空白块再排列
		if(s[i]==0) continue;
		for (var j = i+1; j < s.length; j++) {
			if(s[j]==0) continue;
			if(s[i]>s[j]) inversion_number++;
		}
	}
	// 逆序数为偶数,则返回有解,反之返回无解，
	if(inversion_number%2==0) return true; 
	else {return false};
}


/**
 * js HashTable哈希表实现
 * 参数及方法说明：
 * 函数名              |说明             |   返回值
 * ---------------------|-------------------|----------
 * add(key,value)       |添加项                |无
 * ----------------------------------------------------
 * getValue(key)        |根据key取值            |object
 * ----------------------------------------------------
 * remove(key)          |根据key删除一项      |无
 * ----------------------------------------------------
 * containsKey(key)     |是否包含某个key      |bool
 * ----------------------------------------------------
 * containsValue(value) |是否包含某个值        |bool
 * ----------------------------------------------------
 * getValues()          |获取所有的值的数组  |array
 * ----------------------------------------------------
 * getKeys()            |获取所有的key的数组    |array
 * ----------------------------------------------------
 * getSize()            |获取项总数          |int
 * ----------------------------------------------------
 * clear()              |清空哈希表          |无
 */
function HashTable() {
    var size = 0;
    var entry = new Object();
    this.add = function (key, value) {
        if (!this.containsKey(key)) {
            size++;
        }
        entry[key] = value;
    }
    this.getValue = function (key) {
        return this.containsKey(key) ? entry[key] : null;
    }
    this.remove = function (key) {
        if (this.containsKey(key) && (delete entry[key])) {
            size--;
        }
    }
    this.containsKey = function (key) {
        return (key in entry);
    }
    this.containsValue = function (value) {
        for (var prop in entry) {
            if (entry[prop] == value) {
                return true;
            }
        }
        return false;
    }
    this.getValues = function () {
        var values = new Array();
        for (var prop in entry) {
            values.push(entry[prop]);
        }
        return values;
    }
    this.getKeys = function () {
        var keys = new Array();
        for (var prop in entry) {
            keys.push(prop);
        }
        return keys;
    }
    this.getSize = function () {
        return size;
    }
    this.clear = function () {
        size = 0;
        entry = new Object();
    }
}

function Queue(){
    this.dataStore = [];
	this.push = function push ( element ) {
		this.dataStore.push( element );
	}     //入队
    this.pop = function pop () {
		if( this.empty() ) return 'This queue is empty';
		else this.dataStore.shift();
	}     //出队	
       this.back = function back () {
   		if( this.empty() ) return 'This queue is empty';
   		else return this.dataStore[ this.dataStore.length - 1 ];
   	}          //查看队尾元素
	this.mytoString = function mytoString(){
		return this.dataStore.join('\n');
	}   //显示队列所有元素
	this.clear = function clear(){
		delete this.dataStore;
		this.dataStor = [];
	}         //清空当前队列
	this.empty = function empty(){
		if( this.dataStore.length == 0 ) return true;
		else return false;
	}         //判断当前队列是否为空
	this.front = function front(){
		if( this.empty() ) return 'This queue is empty';
		else return this.dataStore[ 0 ];
	}          //查看队首元素
}

// 九宫格字符数组转换为字符串12354678.成功,是把s[10]化成字符串
function myToString(){
	var str = "";
	for (var i = 1; i < s.length; i++) {
		if(s[i]==0) str += ".";
		else str += s[i];
	}
	return str;
}

// 人工从c++转JS!来吧奥利给!

var first = "";
var last = "12345678.";
var walk_timer;
var result;
function cheater(){ 
	route = "";
	first = myToString();
	if(first==last){alert("这个布局已经赢了！");}
	else{
		result = doubleBFS(); //这里多算了一次..不严重的话就不改了吧_(:з」∠)_
		if(result==-1) alert("这个布局竟然无解，看来我又要改bug了o(╥﹏╥)o");
		else {
			alert("这个布局最少需要" + result + "步才能完成");
			var word_route= "";
			for (var i = 0; i < route.length; i++) {
				if(route[i]=="0") word_route += "右";
				else if(route[i]=="1") word_route += "左";
				else if(route[i]=="2") word_route += "下";
				else if(route[i]=="3") word_route += "上";
			}
			alert("从空位移动方向看步骤为： " + word_route + "  才能完成");
			}
		if(result != -1) walk_timer  = setInterval(walk, 400);
		set();
	}
}

var route; //路线里0是右，1是左，2是下，3是上
var dis = new HashTable();
var vis = new HashTable(); //map<string, int>dis, vis;
var route1 = new HashTable(); //map<string, string>route1, route2;
var route2 = new HashTable(); //不知道value为string的时候会不会有问题
var q1 = new Queue();
var q2 = new Queue();
var dir = new Array([0,1],[0,-1],[1,0],[-1,0])
var str1 = "";
var str2 = "";
var str = "";
var flag = 0;
var BFSx = 0;
var BFSy = 0;
function doubleBFS(){
	q1.push(first);
	dis.add(first,1);
	vis.add(first,1);
	route1.add(first,"");
	q2.push(last);
	dis.add(last,1);
	vis.add(last,2);
	route2.add(last,""); 
//	alert(vis.getValue(last)); 哈希表和队列应该没问题
	while(!q1.empty() && !q2.empty()){
		if(q1.dataStore.length < q2.dataStore.length){
			str1 = q1.front(); 
			q1.pop();
			flag = 1;
		}
		else{
			str1 = q2.front();
			q2.pop();
			flag = 2; 
		}
		toMatrix(str1);
		for (var i = 0; i < 3; i++) { //找空格在的位置
			for (var j = 0; j < 3; j++) {
				if(m[i][j]== '.'){
					BFSx = i;
					BFSy = j;
					break;
				}
			}
			if(m[i][j]==".") break;
		}
		for (var i = 0; i < 4; i++) {
			str2 = ""; //每次寻找时都清零，不然会累计
			var tx = BFSx + dir[i][0];
			var ty = BFSy + dir[i][1];
			if(inBoundary(tx,ty)){ //就是c++里的swap
				var temp = m[BFSx][BFSy];
				m[BFSx][BFSy] = m[tx][ty];
				m[tx][ty] = temp;
				// 原来函数里的tostring功能
				for (var j = 0; j < 3; j++) {
					for (var k = 0; k < 3; k++) {
						str2 += m[j][k];
					}
				}

				if(!dis.containsKey(str2)){
					dis.add(str2,dis.getValue(str1) + 1) ;
					vis.add(str2,vis.getValue(str1) ) ;
					//alert(vis.getValue(str2)); 这里好像也没问题
					str = i.toString();
					if(flag == 1 ){
						q1.push(str2);
						route1.add(str2,route1.getValue(str1) + str) ;
					}else if(flag==2){
						q2.push(str2);
						route2.add(str2,route2.getValue(str1) + str) ;					
					}
				} //我的哈希表好像没这个函数！containsKey(key)     |是否包含某个key
				else{
					str = i.toString();
					if(flag == 1 ){
						route1.add(str2,route1.getValue(str1) + str) ;
					}else if(flag==2){
						route2.add(str2,route2.getValue(str1) + str) ;					
					}				
					if(vis.getValue(str1) + vis.getValue(str2) == 3){
						var ans = dis.getValue(str1) + dis.getValue(str2) -1;
						var ahead_route;
						var later_route;
						var change_later_route = "";
						var r11 = route1.getValue(str1);
						var r12 = route1.getValue(str2);
						var r21 = route2.getValue(str1); //找两条真的路线
						var r22 = route2.getValue(str2);
						if(r11 && r12)	r11.length>r12.length? ahead_route=r11 : ahead_route=r12 ; //三元选择符输出长的
						else if(!r11 && r12) ahead_route=r12; //r11是null，输出r12
						else if(r11 && !r12) ahead_route=r11; //r12是null，输出r11 
						
						// 回推的方向还要再颠倒下...
						if(r21 && r22)	r21.length>r22.length? later_route=r21 : later_route=r22 ; //三元选择符输出长的
						else if(!r21 && r22) later_route=r22; //r21是null，输出r22
						else if(r21 && !r22) later_route=r21; //r22是null，输出r21
						later_route = later_route.split('').reverse().join('');
						for (var i = 0; i < later_route.length; i++) { //不能边遍历边改？那就再来个变量吧
							if(later_route[i]=="0") change_later_route += "1";
							else if(later_route[i]=="1") change_later_route += "0";
							else if(later_route[i]=="2") change_later_route += "3";
							else if(later_route[i]=="3") change_later_route += "2";
						}
						route = ahead_route + change_later_route ;
						return ans;
					}
				}
			var temp = m[BFSx][BFSy];
			m[BFSx][BFSy] = m[tx][ty];
			m[tx][ty] = temp;
			}
		}
	}
	return -1;
}

var m = new Array([0,0,0],[0,0,0],[0,0,0]);

// 原来的改m数组果然在这有问题，第一位得化成3的倍数
function toMatrix(str){ //把字符串变成九宫字符数组
	for (var i = 0; i < str.length; i++) {
		m[(i-(i % 3)) / 3][i % 3] = str[i];
	}
}

function inBoundary(x,y){
	return (x>=0 && x<3) && (y>=0 && y<3);
}

function set(){
	dis = new HashTable();
	vis = new HashTable(); //map<string, int>dis, vis;
	route1 = new HashTable(); //map<string, string>route1, route2;
	route2 = new HashTable(); //不知道value为string的时候会不会有问题
	q1 = new Queue();
	q2 = new Queue();
	str1 = "";
	str2 = "";
	str = "";
	flag = 0;
	BFSx = 0;
	BFSy = 0;
	last = "12345678.";
	m = new Array([0,0,0],[0,0,0],[0,0,0]);
}

var walk_times = 0 ;

function walk(){
	var space_position = findPosition(0); //找空格的位置 这里是s[n]位置
	var i = walk_times;
	var myTag = document.getElementsByTagName("div");
	for (var j = 0; j < myTag.length; j++) {
		 myTag[j].style.cssText += "pointer-events: none;"/*停止了游戏就不能点按钮*/
	}
	if(route[i]=="0"){ //向右走
		move( s[space_position+1] ); //move是移动数字吧
	}
	else if (route[i]=="1"){ //向左走
		move( s[space_position-1] );
	}
	else if (route[i]=="2"){ //向下走
		move( s[space_position+3] );
	}
	else if (route[i]=="3"){ //向上走
		move( s[space_position-3] );
	}
	walk_times++;
	if(walk_times == route.length){ //如果步数走到了，就关计时器，并且步数清零
		walk_times = 0;
		clearInterval(walk_timer);
		for (var j = 0; j < myTag.length; j++) {
			 myTag[j].style.cssText += "pointer-events: auto;"/*停止了游戏就不能点按钮*/
		}
	}
}


function test(){
	if(last=="12345678."){
//		last = "67834.521";
		last = prompt("请你想到达的布局:如67834.521","67834.521");
		alert("调整最终状态成功:"+last);		
	}
	else{
		last="12345678.";
		alert("恢复最终状态成功");	
	}
}

