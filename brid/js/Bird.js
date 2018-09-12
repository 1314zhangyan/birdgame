function Bird(imgArr,x,y){
        // 图片数组
        this.imgArr=imgArr;
        // 定义图片索引
        this.idx=parseInt(Math.random()*imgArr.length);
        this.img=this.imgArr[this.idx];
        this.x=x;
        this.y=y;
        this.state="D";
        this.speed=0;
}


// 鸟飞方法
Bird.prototype.fly=function(){
	this.idx++;
	if(this.idx>=this.imgArr.length){
		this.idx=0;
	}
	// 虽然只是索引改变， 图片没有改变
	this.img = this.imgArr[this.idx];
}
// 鸟下落
Bird.prototype.fallDown=function(){
	if(this.state==="D"){
		this.speed++;
		// 修正this.speed
		this.y+=Math.sqrt(this.speed)
	}else{
		this.speed--;
		if (this.speed === 0) {
			// 修改状态
			this.state = "D";
			return;
	}
	this.y -= Math.sqrt(this.speed);
	}
}
// 鸟上升
Bird.prototype.goUp=function(){
	this.state = "U";
	// 修改鸟的速度
	this.speed = 20;
}