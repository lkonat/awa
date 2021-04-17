const DisplayLayer1 = (function() {
    var displayScreen = false;
    function on(eventX,callBack){
      iternalEvents[eventX] = callBack;
    };
    function fireEvent(eventX,args){
      if(iternalEvents[eventX]){
        iternalEvents[eventX](args);
      }
    };
    function setScreen(target){
      if(target){
        displayScreen = target;
      }
    };
    function clear(args){
      if(displayScreen){
        if(args && args.className){
           displayScreen.find(`.${args.className}`).remove();
        }else if (args && args.idName) {
          displayScreen.find(`#${args.idName}`).remove();
        }else {
          displayScreen.empty();
          selectedItem = false;
          hoveredItem = false;
        }
      }
    };
    function drawRect({top,left,height,width,text,className,id}){
      if(id){
        clear({idName:id});
      }
      const boardOffset = $(displayScreen.parent()[0]).offset();
      const box = $(`<div ${id?`id="${id}"`:""} ${className?`class="${Array.isArray(className)?className.join(" "):className}"`:""} style="display:flex;justify-content: center; align-items:center; position:absolute; top:${((top-boardOffset.top))}px; left:${(left-boardOffset.left)}px; height:${height}px; width:${width}px;">${text?text:""}</div>`);
      displayScreen.append(box);
    }
    function drawGrid({grid,htmlText,text,className,id}){
      if(id){
        clear({idName:id});
      }
      let tmpRows = window.getComputedStyle(grid, null).getPropertyValue("grid-template-rows");
      let tmpCol = window.getComputedStyle(grid, null).getPropertyValue("grid-template-columns");
      const boardOffset = $(displayScreen.parent()[0]).offset();
      const {top,left} = $(grid).offset();
      const height = $(grid).height();
      const width = $(grid).width();
      const labelView = $(`<div id="content" style="position:absolute; bottom:100%; left:0px;">${text?text:""}</div>`);
      if(htmlText){
        labelView.append(htmlText);
      }
      const box = $(`<div ${id?`id="${id}"`:""} ${className?`class="${Array.isArray(className)?className.join(" "):className}"`:""} style="display:grid;grid-template-rows:${tmpRows}; grid-template-columns:${tmpCol}; position:absolute; top:${((top-boardOffset.top))}px; left:${(left-boardOffset.left)}px; "></div>`);
      box.append(labelView);
      displayScreen.append(box);
      let Nc = tmpCol.split(" ");
      let Nr = tmpRows.split(" ");
      const start = grid.childNodes.length;
      for(let r =0; r< Nr.length; r++){
        for(let cl =0; cl< Nc.length; cl++){
          box.append(`<div class='tmp-grid-item-holder' style="display:flex; width:${Nc[cl]};  height:${Nr[r]}; justify-content: center; align-items:center;" data-gridcell="true" data-hoverable="false" data-selectable="false">Cell</div>`);
        }
      }
    }
    function drawLabeledRect({top,left,height,width,text,className,id,label}){
      if(id){
        clear({idName:id});
      }
      const boardOffset = $(displayScreen.parent()[0]).offset();
      const box = $(`<div ${id?`id="${id}"`:""} ${className?`class="${Array.isArray(className)?className.join(" "):className}"`:""} style="display:flex;justify-content: center; align-items:center; position:absolute; top:${((top-boardOffset.top))}px; left:${(left-boardOffset.left)}px; height:${height}px; width:${width}px;"></div>`);
      let labelView = $(`<div id="label" style="width:100px; position:absolute; bottom:100%; left:50%;margin-left:-50px; "><center>${label}</center></div>`);
      box.append(labelView);
      displayScreen.append(box);
    }
   function drawTextAboveRect({top,bottom,left,right,height,width,htmlText,text,className,id}){
     if(id){
       clear({idName:id});
     }
     const boardOffset = $(displayScreen.parent()[0]).offset();
     const box = $(`<div ${id?`id="${id}"`:""} ${className?`class="${Array.isArray(className)?className.join(" "):className}"`:""} style="position:absolute; top:${(top-boardOffset.top)}px; left:${left-boardOffset.left}px;"></div>`);
     const labelX = $(`<div id="content" style="dispaly:table; white-space:nowrap; position:absolute; bottom:100%; left:0px;">${text?text:""}</div>`);
     box.append(labelX);
     if(htmlText){
       labelX.append(htmlText);
     }
     displayScreen.append(box);
     return box;
   }

   function drawTextInsideRect({top,bottom,left,right,height,width,htmlText,text,className,id}){
     if(id){
       clear({idName:id});
     }
     const boardOffset = $(displayScreen.parent()[0]).offset();
     const box = $(`<div ${id?`id="${id}"`:""} ${className?`class="${Array.isArray(className)?className.join(" "):className}"`:""} style="position:absolute; top:${(top-boardOffset.top)}px; left:${left-boardOffset.left}px;"></div>`);
     const labelX = $(`<div id="content" style="dispaly:table; white-space:nowrap; position:absolute; top:0px; left:0px;">${text?text:""}</div>`);
     if(htmlText){
       labelX.append(htmlText);
     }
     box.append(labelX);
     displayScreen.append(box);
     return box;
   }

    function showPoint({top,left,label}){
       const className = "layer1-point"+label;
       clear({className});
       const boardOffset = $(displayScreen.parent()[0]).offset();
       let box = $(`<div class='${className}' style="position:absolute; top:${(top-boardOffset.top)}px; left:${left-boardOffset.left}px; color:red;margin:0px; padding:0px;">${label}</div>`);
       displayScreen.append(box);
    };

    function blur(){
       displayScreen.addClass("display1-awa-board-blur-screen");
    }
    function unBlur(){
       displayScreen.removeClass("display1-awa-board-blur-screen");
    }

  return {
    setScreen,
    clear,
    on,
    showPoint,
    //-------
    drawTextAboveRect,
    drawTextInsideRect,
    drawLabeledRect,
    drawRect,
    blur,
    unBlur,
    drawGrid
  }
})();
