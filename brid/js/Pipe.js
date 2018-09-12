function Pipe(pipe_up, pipe_down, step, x){
	// 上图片
	this.pipe_up = pipe_up;
	// 下图片
	this.pipe_down = pipe_down;
	// 定义步长
	this.step = step;
	// 定义上管子高度
	this.up_height=parseInt(Math.random()*249)+1;
	// 定义下管子高度
	this.down_height=250-this.up_height;
	// x位置
	this.x = x;
	// 计数器
	this.count = 0;
}
Pipe.prototype.createPipe=function(){
	return new Pipe(this.pipe_up,this.pipe_down,this.step,this.x);
}