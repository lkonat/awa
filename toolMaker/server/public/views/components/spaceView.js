class SpaceView {
  constructor(args) {
    this.width = 200;
    this.height = 100;
    this.host = args.host;
    this.internalEvent = {};
    this.elts = {};
    this.data ={};
  }
  on(eventX,callBack){
   this.internalEvent[eventX] = callBack;
  }
  fireEvent(eventX,args){
    if(this.internalEvent[eventX]){
      this.internalEvent[eventX](args);
    }
  }
  updateText({styleName,distance}){
    if(this.elts[styleName]){
      this.elts[styleName].updateText(distance);
    }
  }
  init(args){
    this.data ={};
    for(let elt in args){
      let tmp = parseFloat(args[elt]);
      tmp = tmp && tmp>0?tmp:0;
      this.data[elt] = `${tmp}`;
    }
    this.initView();
  }
  initView(){
    this.host.empty();
    let xFactor = 70;
    let xWidth = 70;
    let xHeight = 10;
    let width1  = xWidth+xFactor;
    let height1  = xHeight+xFactor;
    let width0  = width1+xFactor;
    let height0  = height1+xFactor;
    this.width = width0;
    this.height = height0;
    this.div = $(`<div contenteditable style="outline:none;"></div>`);
    this.svg = $(`<svg width="${this.width}" height="${this.height}" style="  fill:black;box-shadow: 0 0 5px grey;"></svg>`);
    this.div.append(this.svg);
    this.host.append(this.div);
    this.svg.on("mouseleave",()=>{
      this.outOfBound = true;
      console.log("mouse leave");
    });
    let x0 = (this.width/2)-(width0/2);
    let y0 =(this.height/2)-(height0/2);
    let rect0 = this.createRect({
      x:x0,
      y:y0 ,
      width:width0,
      height:height0,
      styles:{
        fill:"white",
        "stroke-width":2,
        stroke:"whitesmoke"
      }});
      this.svg[0].appendChild(rect0);
      let x1 = (this.width/2)-(width1/2);
      let y1 =(this.height/2)-(height1/2);
      let rect2 = this.createRect({
        x:x1,
        y:y1 ,
        width:width1,
        height:height1,
        styles:{
          fill:"white",
          "stroke-width":2,
          stroke:"lightgrey"
        }});
        this.svg[0].appendChild(rect2);
        let xX = (this.width/2)-(xWidth/2);
        let xY = (this.height/2)-(xHeight/2);
        let rect = this.createRect({
          x:xX,
          y:xY,
          width:xWidth,
          height:xHeight,
          styles:{
            fill:"grey",
            "stroke-width":2,
            stroke:"grey"
          }});
          this.svg[0].appendChild(rect);


          // this.svg[0].appendChild(this.elts.margins.right.elt);
          const strokes = "transparent";
          const paddingBottom = this.createPath({path:`M${xX+xWidth} ${xY+xHeight}  L${x1+width1} ${y1+height1} L${x1} ${y1+height1} L${xX} ${xY+xHeight} Z`,styles:{stroke:strokes},className:'space-tool-padding-bottom'});
          this.svg[0].appendChild(paddingBottom);
          const marginBottom = this.createPath({path:`M${x1+width1} ${y1+height1}  L${x0+width0} ${y0+height0} L${x0} ${y0+height0} L${x1} ${y1+height1} Z`,styles:{stroke:strokes},className:'space-tool-margin-bottom'});
          this.svg[0].appendChild(marginBottom);
          const paddingLeft = this.createPath({path:`M${xX} ${xY}  L${x1} ${y1} L${x1} ${y1+height1} L${xX} ${xY+xHeight} Z`,styles:{stroke:strokes},className:'space-tool-padding-left'});
          this.svg[0].appendChild(paddingLeft);
          const marginLeft= this.createPath({path:`M${x1} ${y1}  L${x0} ${y0} L${x0} ${y0+height0} L${x1} ${y1+height1} Z`,styles:{stroke:strokes},className:'space-tool-margin-left'});
          this.svg[0].appendChild(marginLeft);
          const paddingRight = this.createPath({path:`M${xX+xWidth} ${xY}  L${x1+width1} ${y1} L${x1+width1} ${y1+height1} L${xX+xWidth} ${xY+xHeight} Z`,styles:{stroke:strokes},className:'space-tool-padding-right'});
          this.svg[0].appendChild(paddingRight);
          const marginRight= this.createPath({path:`M${x1+width1} ${y1}  L${x0+width0} ${y0} L${x0+width0} ${y0+height0} L${x1+width1} ${y1+height1} Z`,styles:{stroke:strokes},className:'space-tool-margin-right'});
          this.svg[0].appendChild(marginRight);
          const paddingTop = this.createPath({path:`M${xX} ${xY}  L${x1} ${y1} L${x1+width1} ${y1} L${xX+xWidth} ${xY} Z`,styles:{stroke:strokes},className:'space-tool-padding-top'});
          this.svg[0].appendChild(paddingTop);
          const marginTop= this.createPath({path:`M${x1} ${y1}  L${x0} ${y0} L${x0+width0} ${y0} L${x1+width1} ${y1} Z`,styles:{stroke:strokes},className:'space-tool-margin-top'});
          this.svg[0].appendChild(marginTop);


          this.elts.marginLeft = this.createText({id:"marginLeft",x:x0,y:y0+(height0/2),size:10,maxWidth:30,maxHeight:xHeight, value:this.data.marginLeft?this.data.marginLeft:0,styles:{
            fill:"transparent",
            "stroke-width":1,
            stroke:"black"
          }});
          this.svg[0].appendChild(this.elts.marginLeft.elt);

          this.elts.marginRight = this.createText({id:"marginRight",x:(x0+width0)- 35,y:y0+(height0/2),size:10,maxWidth:30,maxHeight:xHeight, value:this.data.marginRight?this.data.marginRight:0,styles:{
            fill:"transparent",
            "stroke-width":1,
            stroke:"black"
          }});
          this.svg[0].appendChild(this.elts.marginRight.elt);


          this.elts.marginTop = this.createText({id:"marginTop",x:(x0+(width0)/2),y:y0+10,size:10,maxWidth:-5,maxHeight:30, value:this.data.marginTop?this.data.marginTop:0,styles:{
            fill:"transparent",
            "stroke-width":1,
            stroke:"black"
          }});
          this.svg[0].appendChild(this.elts.marginTop.elt);


          this.elts.marginBottom = this.createText({id:"marginBottom",x:(x0+(width0)/2),y:(y0+height0)-30,size:10,maxWidth:-5,maxHeight:30, value:this.data.marginBottom?this.data.marginBottom:0,styles:{
            fill:"transparent",
            "stroke-width":1,
            stroke:"black"
          }});
          this.svg[0].appendChild(this.elts.marginBottom.elt);
          const allSections = [
            {
              elt:paddingBottom,
              label:"bottom",
              styleName:"paddingBottom"
            },
            {
              elt:paddingLeft,
              label:"left",
              styleName:"paddingLeft"
            },
            {
              elt:paddingRight,
              label:"right",
              styleName:"paddingRight"
            },
            {
              elt:paddingTop,
              label:"top",
              styleName:"paddingTop"
            },
            {
              elt:marginBottom,
              label:"bottom",
              styleName:"marginBottom"
            },
            {
              elt:marginLeft,
              label:"left",
              styleName:"marginLeft"
            },
            {
              elt:marginRight,
              label:"right",
              styleName:"marginRight"
            },
            {
              elt:marginTop,
              label:"top",
              styleName:"marginTop"
            }
          ];


          const getOvered = ({arr,target})=>{
            for(let i =0 ; i< arr.length; i++){
              if(arr[i].elt === target){
                return arr[i];
              }
            }
            return false;
          };
          function pauseEvent(e){
            if(e.stopPropagation) e.stopPropagation();
            if(e.preventDefault) e.preventDefault();
            e.cancelBubble=true;
            e.returnValue=false;
            return false;
         }
         const updateMouseIcon=({styleName})=>{
           if(styleName.endsWith("top") || styleName.endsWith("bottom")){
             $("html").css({cursor:"ns-resize"});
           }else if (styleName.endsWith("left") || styleName.endsWith("right")) {
             $("html").css({cursor:"ew-resize"});
           }else {
             $("html").css({cursor:""});
           }
         };
         const handleMovement = ({section,distance,eventType})=>{
             let label = section.label;
             if(label==="left"){
                this.fireEvent(eventType,{styleName:section.styleName,distance:(-1*distance.x)});
             }else if (label==="right") {
               this.fireEvent(eventType,{styleName:section.styleName,distance:(distance.x)});
             }else if (label==="top") {
               this.fireEvent(eventType,{styleName:section.styleName,distance:(-1*distance.y)});
             }else if (label==="bottom") {
               this.fireEvent(eventType,{styleName:section.styleName,distance:(distance.y)});
             }
             updateMouseIcon({styleName:section.styleName});
         }
          $("html").on("mousedown",(e)=>{
            let section = getOvered({arr:allSections,target:e.target});
            if(section){
               this.mouseDown = {X:e.clientX,Y:e.clientY,section};
            }else {
              this.mouseDown = false;
            }
          });
          $("html").on("mouseup",(e)=>{
            if(this.mouseDown){
              let x = this.mouseDown.X - e.clientX;
              let y = this.mouseDown.Y - e.clientY;
              handleMovement({section:this.mouseDown.section,distance:{x,y},eventType:"change"});
              this.mouseDown = false;
              return pauseEvent(e);
            }
          });
          $("html").on("mousemove",(e)=>{
            let target = e.target;
            if(this.mouseDown){
              let x = this.mouseDown.X - e.clientX;
              let y = this.mouseDown.Y - e.clientY;
              handleMovement({section:this.mouseDown.section,distance:{x,y},eventType:"input"});
              return pauseEvent(e);
            }
          });
          const extractText =(id)=>{
            let elt = $(this.div).find(`#${id}`);
            if(elt.length>0){
              let val = elt[0].textContent?parseFloat(elt[0].textContent):0;
              val = val>=0?val:0;
              this.updateText({styleName:id,distance:val});
              return val;
            }
            return 0;
          };
          this.div.on("input",(e)=>{
            let option = {
              marginLeft:extractText("marginLeft"),
              marginRight:extractText("marginRight"),
              marginTop:extractText("marginTop"),
              marginBottom:extractText("marginBottom")
            };
            this.fireEvent("update",option);
          });
  }
  handleMove({type,elements}){
    for(let i =0; i< elements.length; i++){
      ((i)=>{
        let down = false;
        $(elements[i].elt).on("mousedown",(e)=>{
          this.outOfBound = false;
          down = {offsetX:e.offsetX,offsetY:e.offsetY};
        });
        $(elements[i].elt).on("mouseup",(e)=>{
          down = false;
        });
        let timer = false;
        $(elements[i].elt).on("mousemove",(e)=>{
          if(!this.outOfBound){
            if(down && !timer){
              timer = setTimeout(()=>{
                let metric = 0, direction=false;;
                if(elements[i].label ==="left"){
                  metric = -1 * (e.offsetX-down.offsetX);
                }else if (elements[i].label ==="right") {
                  metric = (e.offsetX-down.offsetX);
                }else if (elements[i].label ==="top") {
                  metric = -1 * (e.offsetY-down.offsetY);
                }
                else if (elements[i].label ==="bottom") {
                  metric = (e.offsetY-down.offsetY);
                }
                if(metric){
                  this.fireEvent(type,{position:elements[i].label,distance:metric});
                }
                timer = false;
              },70);
            }
          }else {
            timer = false;
            down = false;
          }
        });
      })(i);
    }
  }
  createText({id,x,y,size,maxWidth,maxHeight, value,styles}){
    let lenX = (x+(maxWidth/2)) - ((value.length*size*0.5)/2);
    let lenY = (y+(maxHeight/2)) - ((size*0.5)/2);
    var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'text'); //Create a path in SVG's namespace
    newElement.setAttribute("value",value); //Set path's data
    newElement.setAttribute("x",lenX); //Set path's data
    newElement.setAttribute("y",lenY); //Set path's data
    newElement.setAttribute("font-size",size);
    newElement.setAttribute("font-family","monospace");
    newElement.setAttribute("id",id);
    for(let style in styles){
      newElement.style[style] = styles[style]; //Set stroke colour
    }
    newElement.textContent = value;
    const updateText = (text)=>{
      text = text.toString();
      newElement.textContent = text;
      let len = (x+(maxWidth/2)) - ((text.length*size*0.5)/2);
      newElement.setAttribute("x",len);
    }
    return {elt:newElement,updateText};
  }
  createRect({x,y,width,height,styles}){
    var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'rect'); //Create a path in SVG's namespace
    newElement.setAttribute("width",width); //Set path's data
    newElement.setAttribute("x",x); //Set path's data
    newElement.setAttribute("y",y); //Set path's data
    newElement.setAttribute("height",height); //Set path's data
    for(let style in styles){
      newElement.style[style] = styles[style]; //Set stroke colour
    }
    return newElement
  }
  createPath({path,styles,className}){
    var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'path'); //Create a path in SVG's namespace
    newElement.setAttribute("d",path); //Set path's data
    newElement.setAttribute("class",className);
    for(let style in styles){
      newElement.style[style] = styles[style]; //Set stroke colour
    }
    return newElement
  }
}
