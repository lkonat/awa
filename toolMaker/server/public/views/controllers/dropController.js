const NormalDragDrop = (function() {
  var currentDraggingTarget = false;
  var str = false;
  var iternalEvents = {};
  function on(eventX,callBack){
    iternalEvents[eventX] = callBack;
  };
  function fireEvent(eventX,args){
    if(iternalEvents[eventX]){
      iternalEvents[eventX](args);
    }
  };
  function removeAllPads(){
    $(".pads").remove();
  }
  function getDropTarget({x,y,elem, selector}) {
    let info = ComponentsBoard.getHtmlTagInfo({item:$(elem)});
    if(info.label.toLowerCase() ==="body"){
      return {element:elem,position:"self"};
    }
    let siblings = [elem.previousElementSibling,elem.nextElementSibling];
    let chosen = false;
    let elemHeight = elem.offsetHeight;
    let elemWidth = elem.offsetWidth;
    let elemOffset = $(elem).offset();
    let tresholdY = 20;
    let tresholdX = 2.5;
    let middleY = (elemHeight/2);
    let factorY = middleY-((tresholdY*middleY)/100);//(middleY/tresholdY);
    let middleX = (elemWidth/2);
    let factorX = middleX-((tresholdX*middleX)/100); //(middleX/tresholdX);
    let cy = y-elemOffset.top;
    let cx = x-elemOffset.left;
    let boundBottom = (middleY+factorY);
    let boundTop = middleY-factorY;
    let boundLeft = middleX-factorX;
    let boundRight = middleX+factorX;
    const isInside = (cy <= boundBottom && cy >= boundTop) && (cx <= boundRight && cx >= boundLeft);
    if(isInside){
     return {element:elem,position:"self"};
   }else {
     const points =[
       {label:"top",x:cx,y:boundTop},
       {label:"bottom",x:cx,y:boundBottom},
       {label:"left",x:boundLeft,y:cy},
       {label:"right",x:boundRight,y:cy}
     ];
     let minDistance = Infinity;
     for(let i =0; i< points.length; i++){
       let a = cx - (points[i].x);
       let b = cy - (points[i].y);
       let distance = Math.sqrt( a*a + b*b );
       if(minDistance>distance){
         minDistance =distance;
         chosen = points[i].label;
       }
     }
     return {element:elem,position:chosen};
   }
  };

  function cleaArea(){
    DisplayLayer1.clear({className:"layer1-last-child-option-drop"});
  };
  function isItDroppable({elem,target}){
    if($(target).hasClass("pads")){
      let siblings = [target.previousElementSibling,target.nextElementSibling];
      for(let i =0; i<siblings.length; i++){
         if(elem.item && siblings[i] === elem.item){
           return false;
         }
      }
    }
    return true;
  }

  function handleDragging(event){
    let data_x = event.originalEvent.dataTransfer.getData("info");
    let target = $(event.target);
    if(event.target !== currentDraggingTarget && !target.hasClass("pads")){
      removeAllPads();
    }
    currentDraggingTarget = event.target;

    let dropTargetElt = getDropTarget({elem:target[0],x:event.originalEvent.clientX,y: event.originalEvent.clientY});
    DisplayLayer1.showDropArea({elem:dropTargetElt.element,position:dropTargetElt.position});
  }
  function handleDrop ({target,event,dragged}){
    const {element,position} = getDropTarget({elem:target[0],x:event.originalEvent.clientX,y: event.originalEvent.clientY});
    if(position==="self"){
      const command = new AddItemCommand({
        execute:(board)=>{
          $(element).append(dragged);
          board.selectElement({item:dragged});
        },
        undo:(board)=>{
          dragged.remove();
          board.clearSelection();
        },
        item:dragged,
        host:element
      });
      fireEvent("command",command);
    }else if (position==="top") {
      const command = new AddItemCommand({
        execute:(board)=>{
          $(dragged).insertBefore($(element));
          board.selectElement({item:dragged});
        },
        undo:(board)=>{
          dragged.remove();
          board.clearSelection();
        },
        item:dragged,
        host:element
      });
      fireEvent("command",command);
    }else if (position==="bottom") {
      const command = new AddItemCommand({
        execute:(board)=>{
          $(dragged).insertAfter($(element));
          board.selectElement({item:dragged});
        },
        undo:(board)=>{
          dragged.remove();
          board.clearSelection();
        },
        item:dragged,
        host:element
      });
      fireEvent("command",command);
    }else if (position==="left") {
      const command = new AddItemCommand({
        execute:(board)=>{
          $(dragged).insertBefore($(element));
          board.selectElement({item:dragged});
        },
        undo:(board)=>{
          dragged.remove();
          board.clearSelection();
        },
        item:dragged,
        host:element
      });
      fireEvent("command",command);
    }else if (position==="right") {
      const command = new AddItemCommand({
        execute:(board)=>{
          $(dragged).insertAfter($(element));
          board.selectElement({item:dragged});
        },
        undo:(board)=>{
          dragged.remove();
          board.clearSelection();
        },
        item:dragged,
        host:element
      });
      fireEvent("command",command);
    }
    cleaArea();
  }
  return {
    handleDragging,
    handleDrop,
    on
  }
})();
