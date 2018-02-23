
const background = class{
  constructor(canvas, WIDTH, HEIGHT, POINT, maxR, minR){

    canvas.width = WIDTH
    canvas.height = HEIGHT
    const context = canvas.getContext('2d')
    context.fillStyle = 'rgba(0,0,0,0.25)'
    let circleArr = []

    //线条：开始xy坐标，结束xy坐标，线条透明度
    function Line(x1, y1, x2, y2, o){
      this.x1 = x1
      this.y1 = y1
      this.x2 = x2
      this.y2 = y2
      this.o = o
    }

    //点：圆心xy坐标，半径，每帧移动xy的距离
    function Circle(x, y, r, moveX, moveY){
      this.x = x
      this.y = y
      this.r = r
      this.moveX = moveX
      this.moveY = moveY
    }

    //生成max和min之间的随机数
    function num(max,min){
      return (Math.random()*(max-min)+min) | 0
    }

    // 绘制原点
    function drawCircle(ctx, x, y, r){
      const circle = new Circle(x, y, r, 0, 0)
      ctx.beginPath()
      ctx.arc(circle.x, circle.y, circle.r, 0, 2*Math.PI)
      ctx.closePath()
      ctx.fill()
    }

    //绘制线条
    function drawLine(ctx, x1, y1, x2, y2, o){
      const line = new Line(x1, y1, x2, y2, o)
      ctx.beginPath()
      ctx.strokeStyle = `rgba(0, 0, 0, ${o})`
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.closePath()
      ctx.stroke()
    }

    //初始化生成原点
    function init(){
      for(let i=0;i<POINT;i++){
          let circle = new Circle(num(WIDTH, 0), num(HEIGHT, 0), num(maxR, minR), num(10, -10)/40, num(10, -10)/40)
          circleArr.push(circle)
      }
    }

    //每帧绘制
    function draw(){
      context.clearRect(0, 0 , canvas.width, canvas.height)    //  清除整个canvas画布，重绘
      for(let i=0;i<POINT;i++){
          //  每个圆的圆心坐标变动，超出屏幕就要回到另外一个端点
          circleArr[i].x += circleArr[i].moveX
          circleArr[i].y += circleArr[i].moveY
          if(circleArr[i].x>WIDTH){ circleArr[i].x = 0 }
          else if(circleArr[i].x<0){ circleArr[i].x = WIDTH }
          if(circleArr[i].y>HEIGHT){ circleArr[i].y = 0 }
          else if(circleArr[i].y<0){ circleArr[i].y = HEIGHT }

          drawCircle(context, circleArr[i].x, circleArr[i].y, circleArr[i].r)
          for(let j=0;j<POINT;j++){
              if(i+j<POINT){
                  const A = Math.abs(circleArr[i+j].x - circleArr[i].x),
                        B = Math.abs(circleArr[i+j].y - circleArr[i].y),
                        lineLength = Math.sqrt(A*A + B*B),
                        C = POINT/lineLength-0.1,
                        lineOpacity = C > 0.15 ? 0.15 : C
                  drawLine(context, circleArr[i].x, circleArr[i].y, circleArr[i+j].x, circleArr[i+j].y, lineOpacity)
              }
          }
      }
    }

    this.run = () => {
      init()
      setInterval(function(){
          draw()
      }, 16)
    }
  }
}

export default background
