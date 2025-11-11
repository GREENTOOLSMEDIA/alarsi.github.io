function SiriWave9Curve(opt){opt=opt||{};this.controller=opt.controller;this.color=opt.color;this.tick=0;this.respawn();}
SiriWave9Curve.prototype.respawn=function(){this.amplitude=0.3+Math.random()*0.7;this.seed=Math.random();this.open_class=2+(Math.random()*3)|0;};
SiriWave9Curve.prototype.equation=function(i){var p=this.tick;var y=-1*Math.abs(Math.sin(p))*this.controller.amplitude*this.amplitude*this.controller.MAX*Math.pow(1/(1+Math.pow(this.open_class*i,2)),2);if(Math.abs(y)<0.001){this.respawn();}return y;};
SiriWave9Curve.prototype._draw=function(m){this.tick+=this.controller.speed*(1-0.5*Math.sin(this.seed*Math.PI));var ctx=this.controller.ctx;ctx.beginPath();var x_base=this.controller.width/2+(-this.controller.width/4+this.seed*(this.controller.width/2));var y_base=this.controller.height/2;var x,y,x_init;var i=-3;while(i<=3){x=x_base+i*this.controller.width/4;y=y_base+(m*this.equation(i));x_init=x_init||x;ctx.lineTo(x,y);i+=0.01;}var h=Math.abs(this.equation(0));var gradient=ctx.createRadialGradient(x_base,y_base,h*1.15,x_base,y_base,h*0.3);gradient.addColorStop(0,'rgba('+this.color.join(',')+',0.25)');gradient.addColorStop(1,'rgba('+this.color.join(',')+',0.08)');ctx.fillStyle=gradient;ctx.lineTo(x_init,y_base);ctx.closePath();ctx.fill();};
SiriWave9Curve.prototype.draw=function(){this._draw(-1);this._draw(1);};

function SiriWave9(opt){
  opt=opt||{};
  this.tick=0;this.run=false;
  this.ratio=opt.ratio||window.devicePixelRatio||1;
  this.width=this.ratio*(opt.width||600);
  this.height=this.ratio*(opt.height||150);
  this.MAX=this.height/2;
  this.speed=opt.speed||0.04;
  this.amplitude=opt.amplitude||0.6;
  this.canvas=document.createElement('canvas');
  this.canvas.width=this.width;this.canvas.height=this.height;
  this.canvas.style.width=(this.width/this.ratio)+'px';
  this.canvas.style.height=(this.height/this.ratio)+'px';
  this.canvas.style.display='block';
  this.canvas.style.margin='0 auto';
  this.canvas.style.filter='drop-shadow(0 0 15px rgba(255,120,80,0.4))';
  this.container=opt.container||document.body;
  this.container.appendChild(this.canvas);
  this.ctx=this.canvas.getContext('2d');
  this.curves=[];
  for(var i=0;i<SiriWave9.prototype.COLORS.length;i++){
    var color=SiriWave9.prototype.COLORS[i];
    for(var j=0;j<(3*Math.random())|0;j++){
      this.curves.push(new SiriWave9Curve({controller:this,color:color}));
    }
  }
  if(opt.autostart){this.start();}
}

SiriWave9.prototype._clear=function(){
  this.ctx.globalCompositeOperation='destination-out';
  this.ctx.fillRect(0,0,this.width,this.height);
  this.ctx.globalCompositeOperation='lighter';
};

SiriWave9.prototype._draw=function(){
  if(!this.run)return;
  this._clear();
  for(var i=0,len=this.curves.length;i<len;i++){this.curves[i].draw();}
  requestAnimationFrame(this._draw.bind(this));
};

SiriWave9.prototype.start=function(){this.run=true;this._draw();};
SiriWave9.prototype.stop=function(){this.run=false;};
SiriWave9.prototype.COLORS=[[255,0,0],[0,255,0],[0,0,255]];

(function init(){
  function createWave(){
    const container = document.getElementById("siriWave");
    if(!container) return;
    container.innerHTML="";
    new SiriWave9({
      width: container.clientWidth,
      height: 100,
      speed: 0.022,
      amplitude: 0.7,
      container: container,
      autostart: true
    });
  }
  createWave();
  window.addEventListener("resize", () => setTimeout(createWave, 250));
})();
