function Game(ctx,bird,pipe,land,mountain){
   this.ctx=ctx;
   this.bird=bird;
   this.pipeArr=[pipe];
   this.land = land;
  this.mountain = mountain;

  this.timer=null;

// 定义帧
 this.iframe=0;

  this.init();

}

// 初始化方法
Game.prototype.init = function() {
	this.start();
	this.bindEvent();
}


// 渲染Mountain
Game.prototype.renderMountain=function(){
	var img=this.mountain.img;
	this.mountain.x-=this.mountain.step;
	// 判断
	if(this.mountain.x<-img.width){
		this.mountain.x=0;
	}
	this.ctx.drawImage(img, this.mountain.x, this.mountain.y);
	this.ctx.drawImage(img, this.mountain.x + img.width, this.mountain.y);
	this.ctx.drawImage(img, this.mountain.x + img.width * 2, this.mountain.y);
}
// 渲染地面
Game.prototype.renderLand = function() {
	var img=this.land.img;
	this.land.x-=this.land.step;
	// 判断
	if(this.land.x < - img.width){
		this.land.x = 0;
	}
	// 绘制图片
	this.ctx.drawImage(img, this.land.x, this.land.y);
	this.ctx.drawImage(img, this.land.x + img.width, this.land.y);
	this.ctx.drawImage(img, this.land.x +  img.width * 2, this.land.y);
}

// 游戏开始
Game.prototype.start = function() {
  var me =this;
  this.timer=setInterval(function(){
    	// 帧自加
        me.iframe++;
        // 像素检测
		// me.checkPix();
        // 清屏
		me.clear();
		// 渲染背景
		me.renderMountain();
		// 渲染地
		me.renderLand();
		me.renderBird();
		if(!(me.iframe%10)){
			me.bird.fly();
		}
		me.bird.fallDown();
		if(!(me.iframe%70)){
		   me.createPipe();
		}
		// 渲染管子
		me.movePipe();
		me.clearPipe();
		me.renderPipe();
		// 渲染鸟的四个点
		me.renderPoints();
		me.renderPipePoints();
		me.checkBoom();
  },20)
}

// 	清屏
Game.prototype.clear = function() {
	this.ctx.clearRect(0, 0, 360, 512);
}


// 渲染鸟
Game.prototype.renderBird=function(){
	var img=this.bird.img;
	this.ctx.save();
	// 平移坐标系
	this.ctx.translate(this.bird.x, this.bird.y);
	// 绘制矩形
	 this.ctx.strokeRect(-this.bird.img.width / 2 +8, -this.bird.img.height / 2 + 10, this.bird.img.width - 15, this.bird.img.height - 20);
	var deg=this.bird.state==="D"?this.bird.speed*Math.PI/180:-this.bird.speed*Math.PI/180;
	// 鸟的旋转
	this.ctx.rotate(deg);
	// 绘制图片后参数不在改变
	this.ctx.drawImage(img,-img.width/2,-img.height/2);
	// 恢复状态
	this.ctx.restore();
}



//添加点击事件
Game.prototype.bindEvent=function(){
	var me=this;
	this.ctx.canvas.onclick=function(){
		me.bird.goUp();
	}
}


// 绘制管子
Game.prototype.renderPipe=function(){
	var me=this;
	this.pipeArr.forEach(function(value, index) {
// 绘制上馆子
		var img_up=value.pipe_up;
		// 因为管子只需要一部分所以用9个参数的绘制方式
		var img_x=0;
		var img_y=img_up.height-value.up_height;
		// 上管子图片的宽
		var img_w = img_up.width;
		// 上管子图片的高
		var img_h = value.up_height;
		// 图片在canvas上的x值
		var canvas_x = me.ctx.canvas.width - value.step * value.count;
		// 图片在canvas上的y值
		var canvas_y = 0;
		// 图片在canvas上的宽
		var canvas_w = img_up.width;
		// 图片在canvas上的高
		var canvas_h = img_h;
		// 绘制管子
		me.ctx.drawImage(img_up, img_x, img_y, img_w, img_h, canvas_x, canvas_y, canvas_w, canvas_h);

// 绘制下管子
        // 获取下管子的图片
		var down_img = value.pipe_down;
		// 下管子图片x值
		var down_img_x = 0;
		// 下管子图片y值
		var down_img_y = 0;
		// 下管子图片宽
		var down_img_w = down_img.width;
		// 下管子图片高
		var down_img_h = 250 - value.up_height;
		// 图片在canvas上的x值
		var down_canvas_x = me.ctx.canvas.width - value.step * value.count;
		// 图片在canvas上的y值
		var down_canvas_y = img_h + 150;
		// 图片在canvas上的宽
		var down_canvas_w = img_w;
		// 图片在canvas上的高
		var down_canvas_h = 250 - img_h;
		// 绘制下管子
		me.ctx.drawImage(down_img, down_img_x, down_img_y, down_img_w, down_img_h, down_canvas_x, down_canvas_y, down_canvas_w, down_canvas_h);


	})
}


// 管子移动方法
Game.prototype.movePipe=function(){
	this.pipeArr.forEach(function(value,index){
		value.count++;
	})

}

// 创建多根管子
// Game.prototype.createPipe=function(){
// 	// 创建管子
// 	var pipe = this.pipeArr[0].createPipe();
// 	// 放入到PipeArr中
// 	this.pipeArr.push(pipe);
	
// }
Game.prototype.createPipe = function() {
	// 创建管子
	var pipe = this.pipeArr[0].createPipe();
	// 放入到PipeArr中
	this.pipeArr.push(pipe);
}

//移除管子
Game.prototype.clearPipe=function(){
	for(var i=0;i<this.pipeArr.length;i++){
		// 获取一根管子
		var pipe=this.pipeArr[i];
		if(pipe.x-pipe.step*pipe.count<-pipe.pipe_up.width){
			this.pipeArr.splice(i,1);
			return;
		}
	}
}


// 绘制鸟的四个点
Game.prototype.renderPoints=function(){
	var bird_A={
		x:-this.bird.img.width / 2 + 8+ this.bird.x,
		y:-this.bird.img.height / 2 + 10 + this.bird.y
	}
	var bird_B={
		x:-this.bird.img.width / 2 + 8 + this.bird.img.width - 15 + this.bird.x,
		y:-this.bird.img.height / 2 + 10 + this.bird.y
	}
	var bird_C={
		x:-this.bird.img.width / 2 + 8 + this.bird.x,
		y:-this.bird.img.height / 2 + 10 + this.bird.img.height - 20 + this.bird.y
	} 
	var bird_D={
		x:-this.bird.img.width / 2 + 8 + this.bird.img.width - 15 +  this.bird.x,
		y:-this.bird.img.height / 2 + 10 + this.bird.img.height - 20 +  this.bird.y
	}

	// 连线
	this.ctx.beginPath();
	this.ctx.moveTo(bird_A.x,bird_A.y);
	this.ctx.lineTo(bird_B.x,bird_B.y);
	this.ctx.lineTo(bird_D.x,bird_D.y);
	this.ctx.lineTo(bird_C.x,bird_C.y);
	this.ctx.closePath();
	this.ctx.strokeStyle="blue";
	this.ctx.stroke();
}


// 获取管子上8个点
Game.prototype.renderPipePoints=function(){
 for(var i=0;i < this.pipeArr.length;i++){
 	// 获取一根管子
      var pipe = this.pipeArr[i];
      // 获取上管子上4个点
      var pipe_up_A = {
			x: this.ctx.canvas.width - pipe.step * pipe.count,
			y: 0
		}
	  var pipe_up_B = {
			x: this.ctx.canvas.width - pipe.step * pipe.count + pipe.pipe_up.width,
			y: 0
		}
	  var pipe_up_C = {
			x:this.ctx.canvas.width - pipe.step * pipe.count,
			y:pipe.up_height
		}
	  var pipe_up_D = {
			x:this.ctx.canvas.width - pipe.step * pipe.count + pipe.pipe_up.width,
			y: pipe.up_height
		}

         // 连线
        this.ctx.beginPath();
		this.ctx.moveTo(pipe_up_A.x, pipe_up_A.y);
		this.ctx.lineTo(pipe_up_B.x, pipe_up_B.y);
		this.ctx.lineTo(pipe_up_D.x, pipe_up_D.y);
		this.ctx.lineTo(pipe_up_C.x, pipe_up_C.y);
		this.ctx.closePath();
		this.ctx.strokeStyle = "red";
		this.ctx.stroke();

        // 获取下管子四个点

        var pipe_down_A = {
			x: pipe_up_A.x,
			y: pipe.up_height + 150
		}
		var pipe_down_B = {
			x: pipe_up_B.x,
			y: pipe.up_height + 150
		}
		var pipe_down_C = {
			x: pipe_down_A.x,
			y: 400
		}

		var pipe_down_D = {
			x: pipe_down_B.x,
			y: 400
		}

    // 连线
    this.ctx.beginPath();
    this.ctx.moveTo(pipe_down_A.x, pipe_down_A.y);
    this.ctx.lineTo(pipe_down_B.x, pipe_down_B.y);
    this.ctx.lineTo(pipe_down_D.x, pipe_down_D.y);
    this.ctx.lineTo(pipe_down_C.x, pipe_down_C.y);
    this.ctx.closePath();
    this.ctx.strokeStyle="red";
    this.ctx.stroke();


	}
}


// 检测管子与小鸟是否碰撞
Game.prototype.checkBoom=function(){
	 for(var i=0;i < this.pipeArr.length;i++){
 	// 获取一根管子
      var pipe = this.pipeArr[i];
      // 获取上管子上4个点
      var pipe_up_A = {
			x: this.ctx.canvas.width - pipe.step * pipe.count,
			y: 0
		}
	  var pipe_up_B = {
			x: this.ctx.canvas.width - pipe.step * pipe.count + pipe.pipe_up.width,
			y: 0
		}
	  var pipe_up_C = {
			x:this.ctx.canvas.width - pipe.step * pipe.count,
			y:pipe.up_height
		}
	  var pipe_up_D = {
			x:this.ctx.canvas.width - pipe.step * pipe.count + pipe.pipe_up.width,
			y: pipe.up_height
		}

        // 获取下管子四个点

        var pipe_down_A = {
			x: pipe_up_A.x,
			y: pipe.up_height + 150
		}
		var pipe_down_B = {
			x: pipe_up_B.x,
			y: pipe.up_height + 150
		}
		var pipe_down_C = {
			x: pipe_down_A.x,
			y: 400
		}

		var pipe_down_D = {
			x: pipe_down_B.x,
			y: 400
		}

	var bird_A={
		x:-this.bird.img.width / 2 + 8+ this.bird.x,
		y:-this.bird.img.height / 2 + 10 + this.bird.y
	}
	var bird_B={
		x:-this.bird.img.width / 2 + 8 + this.bird.img.width - 15 + this.bird.x,
		y:-this.bird.img.height / 2 + 10 + this.bird.y
	}
	var bird_C={
		x:-this.bird.img.width / 2 + 8 + this.bird.x,
		y:-this.bird.img.height / 2 + 10 + this.bird.img.height - 20 + this.bird.y
	} 
	var bird_D={
		x:-this.bird.img.width / 2 + 8 + this.bird.img.width - 15 +  this.bird.x,
		y:-this.bird.img.height / 2 + 10 + this.bird.img.height - 20 +  this.bird.y
	}
// 碰撞检测
if(bird_B.x>pipe_up_C.x&& bird_B.y <= pipe_up_C.y &&bird_A.x <= pipe_up_B.x){
	this.gameOver();
	return;
}
if(bird_D.x>pipe_down_A.x&&bird_D.y>=pipe_down_A.y&&bird_C.x<=pipe_down_B.x){
	this.gameOver();
	return;
}
}
}
Game.prototype.gameOver=function(){
	clearInterval(this.timer);
}

// Game.prototype.checkPix=function(){
// 	this.ctx.clearRect(0,0,10000,10000);
// 	this.ctx.save();
// 	this.ctx.globalCompositeOperation="source-in";
// 	this.ctx.restore();
// 	var imgData = this.ctx.getImageData(0, 0, 1000, 600);
// 	for(var i=0;i<imgData.data.length;i++){
// 		if(imgData.data[i]){
// 			console.log("撞到了");
// 			this.gameOver();
// 			return;
// 		}
// 	}
// }

Game.prototype.checkPix = function() {
		// 清屏
		this.ctx.clearRect(0, 0, 10000, 10000);
		// 保存状态
		this.ctx.save();
		this.renderPipe();
		// 要在第一个图形之后第二个图形之前，去改变融合方式
		this.ctx.globalCompositeOperation = "source-in";
		this.renderBird();
		// 恢复状态
		this.ctx.restore();
		// 获取像素信息
		var imgData = this.ctx.getImageData(0, 0, 1000, 600);
		for (var i = 0; i < imgData.data.length; i++) {
			if (imgData.data[i]) {
				console.log("撞到了");
				this.gameOver();
				return;
			}
		}
}