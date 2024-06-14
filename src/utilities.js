export const drawRect=(detections,ctx) =>{
    detections.forEach(prediction=>{
        //get prediction results
        const[x,y,width,height]= prediction['bbox'];
        const text = prediction['class'];

        //set stlying
        //const color='#'+Math.floor(Math.random()*16777215).toString(16);
        const color='green'
        ctx.strokeStyle=color
        ctx.font='18px Arial'
        ctx.fillStyle=color
        //draw rectangle
        ctx.beginPath()
        ctx.fillText(text,x,y)
        ctx.rect(x,y,width,height)
        ctx.stroke()
    })
}