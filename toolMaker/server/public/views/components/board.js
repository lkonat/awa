class Board {
  constructor(args) {
    this.treeBar = args.treeBar;
    this.boardName=`awa-board`;
    this.board = args.board;
    this.internalEvents = {};
    this.lastCommand = false;
    this.clickable = true;
    this.lastState = false;
    this.states = [];
    this.reverseStates = [];
    this.ItemSelectedClass =`${this.boardName}-item-selected`;
    this.ItemHoveredClass = `${this.boardName}-item-hovered`;
    this.ItemUnderEditClass = `${this.boardName}-item-editing`;
    this.DropAreaId = `display1-${this.boardName}-computed-drop-area`;
    this.collectifEditingListenner = (e)=>{
      let target = e.target;
      let value = target.textContent;
      let eltX = this.getEditingItem();
      for(let i =0; i< eltX.length; i++){
        if(eltX[i]!== target){
          eltX[i].textContent = value;
        }
      }
    }
    this.itemDragStart = (e)=>{
      const {target} = e;
      let command = new PopBoardItem({item:target});
      this.alterBoard(command);
      const elt = $(`<div style="width:100px;height:30px;background-color:rgba(7, 166, 245,0.5);color:white;cursor:grabbing;" ><center>${target.tagName}</center></div>`);
      document.body.appendChild(elt[0]);
      e.dataTransfer.setDragImage(elt[0], 50, -30);
      target.classList.add(`${this.boardName}-hide-dragg`);
      elt[0].classList.add(`${this.boardName}-hide-dragg`);
      Dragger.setData({
        type:"relocate",
        item:target,
        display:target.style.display,
        height:$(target).height(),
        width:$(target).width(),
        onDrop:(info)=>{
          $(target).removeClass(`${this.boardName}-hide-dragg`);
          elt.remove();
          target.style.opacity = "1";
          target.style.display = info.display;
        }
      });
      target.style.opacity = "0.1";
      setTimeout(()=>{
        target.style.display = "none";
        elt.hide();
      }, 1);
    }
    this.itemDragEnd = ()=>{
      Dragger.end();
    };
    this.treeBar.on("select-item",async({item})=>{
      await this.unsetHoveredItem();
      this.removeEditingItem();
      await this.removeSelectedItem();
      this.setSelectedItem({target:item});
      await this.showSelectedItem();
    });
  }
  pauseEvent(e){
    if(e.stopPropagation) e.stopPropagation();
    if(e.preventDefault) e.preventDefault();
    e.cancelBubble=true;
    e.returnValue=false;
    return false;
 }
 addItemToBoard({item,before,after,target}){
   return new Promise(async(resolve, reject)=>{
     if(before){
       $(item).insertBefore($(target));
     }else if (after) {
       $(item).insertAfter($(target));
     }else{
       $(target).append($(item));
     }
     await this.unsetHoveredItem();
     this.removeEditingItem();
     await this.removeSelectedItem();
     this.setSelectedItem({target:item});
     this.treeBar.showFor({item});
     await this.showSelectedItem();
     return resolve();
   });
 }
 relocateBoardItem({item,before,after,target}){
   return new Promise(async(resolve, reject)=>{
     await this.addItemToBoard({item,before,after,target});
     return resolve();
   });
 }
 popItem({item}){
   this.saveState();
 }
 removeItems({items}){
   this.saveState();
   for(let i =0; i<items.length; i++){
     items[i].remove();
   }
   this.updateExternalScreens();
 }
 addNewBoardItem({item,before,after,target}){
   return new Promise(async(resolve, reject)=>{
     this.saveState();
     await this.addItemToBoard({item,before,after,target});
     return resolve();
   });
 }
 updateExternalScreens(){
   DisplayLayer1.clear();
   this.showSelectedItem();
   this.highlightHoveredItem();
   this.highlightEditingItems();
   this.heightifyBoardItems(this.board);
 }
  removeEditingItem(args){
    return new Promise((resolve, reject)=>{
      let eltX = this.getEditingItem();
      if(eltX.length>0){
        if(args && args.target){
          for(let i =0; i< eltX.length; i++){
            if(eltX[i] === args.target){
              $(eltX[i]).removeAttr("contenteditable");
              eltX[i].removeEventListener("input", this.collectifEditingListenner);
              $(eltX[i]).removeClass(this.ItemUnderEditClass);
            }
          }
        }else {
          $(eltX).removeAttr("contenteditable");
          $(eltX).removeClass(this.ItemUnderEditClass);
        }
        DisplayLayer1.clear({className:`display1-${this.ItemUnderEditClass}`});
        return resolve();
      }
    });
  }
  removeSelectedItem(args){
    return new Promise((resolve, reject)=>{
      let eltX = this.getSelectedItem();
      if(eltX.length>0){
        if(args && args.target){
          for(let i =0; i< eltX.length; i++){
            if(eltX[i] === args.target){
              $(eltX[i]).removeClass("draggable");
              $(eltX[i]).removeAttr("draggable");
              eltX[i].removeEventListener("dragstart", this.itemDragStart);
              eltX[i].removeEventListener("dragend", this.itemDragEnd);

              $(eltX[i]).removeClass(this.ItemSelectedClass);
            }
          }
        }else {
          $(eltX).removeClass("draggable");
          $(eltX).removeAttr("draggable");
          for(let i =0; i< eltX.length; i++){
            eltX[i].removeEventListener("dragstart", this.itemDragStart);
            eltX[i].removeEventListener("dragend", this.itemDragEnd);
          }
          $(eltX).removeClass(this.ItemSelectedClass);
        }
      }
      DisplayLayer1.clear({className:`screen1-${this.ItemSelectedClass}`});
      return resolve();
    });
  }
  unsetHoveredItem(){
    return new Promise((resolve, reject)=>{
      let eltX = this.getHoveredItem();
      if(eltX.length>0){
        $(eltX).removeClass(this.ItemHoveredClass);
        DisplayLayer1.clear({idName:`display1-${this.ItemHoveredClass}`});
      }
      return resolve();
    });
  }
  getSelectedItem(){
    return this.getElt({className:this.ItemSelectedClass});
  }
  getEditingItem(){
    return this.getElt({className:this.ItemUnderEditClass});
  }
  getHoveredItem(){
    return this.getElt({className:this.ItemHoveredClass});
  }
  highlightEditingItems(){
    return new Promise(async(resolve, reject)=>{
      const selected = this.getEditingItem();
      if(selected.length>0){
        for(let i =0; i< selected.length; i++){
          const board = this.getBoard();
          const boardOffset = board.offset();
          const {top,left} = $(selected[i]).offset();
          const label = ComponentsBoard.getHtmlTagInfo({item:selected[i]}).label;
          const labelView = $(`<div>${label}</div>`);
          const setting = $(`<span> Editing</span>`);
          labelView.append(setting);
          const boardTop = boardOffset.top;
          if(top<=boardTop+10){
             DisplayLayer1.drawTextInsideRect({top,left,htmlText:labelView,className:`display1-${this.ItemUnderEditClass}`});
          }else {
             DisplayLayer1.drawTextAboveRect({top,left,htmlText:labelView,className:`display1-${this.ItemUnderEditClass}`});
          }
        }
        return resolve(true);
      }else {
        return resolve(false);
      }
    });
  }
  showSelectedItem(){
    return new Promise(async(resolve, reject)=>{
      const selected = this.getSelectedItem();
      if(selected.length>0){
        for(let i =0; i< selected.length; i++){
          const board = this.getBoard();
          const boardOffset = board.offset();
          const {top,left} = $(selected[i]).offset();
          const label = ComponentsBoard.getHtmlTagInfo({item:selected[i]}).label;
          const labelView = $(`<div>${label}</div>`);
          const setting = $(`<span> Setting</span>`);
          labelView.append(setting);
          const boardTop = boardOffset.top;
          const isGrid = selected[i].style.display === "grid";
          if(isGrid){
               DisplayLayer1.drawGrid({grid:selected[i],htmlText:labelView,className:[`screen1-${this.ItemSelectedClass}`]});
          }else {
            if(top<=boardTop+10){
               DisplayLayer1.drawTextInsideRect({top,left,htmlText:labelView,className:[`screen1-${this.ItemSelectedClass}`,`display1-${this.ItemSelectedClass}`]});
            }else {
               DisplayLayer1.drawTextAboveRect({top,left,htmlText:labelView,className:[`screen1-${this.ItemSelectedClass}`,`display1-${this.ItemSelectedClass}`]});
            }
          }
        }
        return resolve(true);
      }else {
        return resolve(false);
      }
    });
  }
  highlightHoveredItem(){
    return new Promise(async(resolve, reject)=>{
      const hovered = this.getHoveredItem();
      if(hovered.length>0){
        const board = this.getBoard();
        const boardOffset = board.offset();
        const {top,left} = hovered.offset();
        const label = ComponentsBoard.getHtmlTagInfo({item:hovered[0]}).label;
        const boardTop = boardOffset.top;
        const isGrid = hovered[0].style.display === "grid";
        if(isGrid){
             DisplayLayer1.drawGrid({grid:hovered[0],text:label,id:`display1-${this.ItemHoveredClass}`});
        }else{
          if(top<=boardTop+10){
             DisplayLayer1.drawTextInsideRect({top,left,text:label,id:`display1-${this.ItemHoveredClass}`});
          }else {
             DisplayLayer1.drawTextAboveRect({top,left,text:label,id:`display1-${this.ItemHoveredClass}`});
          }
        }
        return resolve(true);
      }else {
        return resolve(false);
      }
    });
  }
  setSelectedItem({target}){
    return new Promise(async(resolve, reject)=>{
      const targetX = $(target);
      targetX.addClass(this.ItemSelectedClass);
      let parent = $(target).parent();
      if(parent[0].tagName.toLowerCase()!=="html"){
        targetX.attr("draggable",true);
        target.addEventListener("dragstart", this.itemDragStart, false);
        target.addEventListener("dragend", this.itemDragEnd,false);
      }
      let items = this.getSelectedItem();
      StyleBoard.renderItem({items});
      return resolve(true);
    });
  }
  setEditingItem({target}){
    return new Promise(async(resolve, reject)=>{
      const targetX = $(target);
      targetX.addClass(this.ItemUnderEditClass);
      targetX.attr("contenteditable",true);
      return resolve(true);
    });
  }
  setHoveredItem({target}){
    return new Promise(async(resolve, reject)=>{
      await this.unsetHoveredItem();
      const targetX = $(target);
      if(!targetX.hasClass(this.ItemSelectedClass) && !targetX.hasClass(this.ItemUnderEditClass)){
        targetX.addClass(this.ItemHoveredClass);
        await this.highlightHoveredItem();
        return resolve(true);
      }else {
        await this.unsetHoveredItem();
        return resolve(false);
      }
    });
  }
  getBoard(){
    return this.board;
  }
  getElt({className,idName}){
    if(className){
       return this.board.find(`.${className}`).addBack(`.${className}`);
    }else if (idName) {
      return this.board.find(`#${idName}`).addBack(`#${idName}`);
    }
  }
  saveReverseState(){
    this.reverseStates.push(new BoardState({innerHTML:this.board[0].innerHTML}));
  }
  saveState(){
    this.states.push(new BoardState({innerHTML:this.board[0].innerHTML}));
  }
  restoreState(){
    let state = this.states.pop();
    if(state){
      this.saveReverseState();
      this.board[0].innerHTML = state.get().innerHTML;
    }
  }
  cancelRestore(){
    this.saveState();
    let state = this.reverseStates.pop();
    if(state){
      this.board[0].innerHTML = state.get().innerHTML;
    }
  }
  fireEvent(name,args){
    if(this.internalEvents[name]){
      this.internalEvents[name](args);
    }
  }
  on(eventX,callBack){
    this.internalEvents[eventX]=callBack;
  }
  addCommand(command){
    this.alterBoard(command);
  }
  alterBoard(command){
    this.reverseStates = [];
    command.execute(this);
    this.fireEvent("undo-command",{undo:this.states.length>0?true:false, cancelUndo:this.reverseStates.length>0?true:false});
    this.updateExternalScreens();
  }
  undo(){
    this.restoreState();
    this.fireEvent("undo-command",{undo:this.states.length>0?true:false, cancelUndo:this.reverseStates.length>0?true:false});
    this.updateExternalScreens();
  }
  cancelUndo(){
    this.cancelRestore();
    this.fireEvent("undo-command",{undo:this.states.length>0?true:false, cancelUndo:this.reverseStates.length>0?true:false});
    this.updateExternalScreens();
  }

  initView(){
    this.timer = false;
    this.board.scroll(()=>{
      this.updateExternalScreens();
    });
    this.board.on("dragenter",async(event)=>{
      event.preventDefault();
      this.possibleDropArea = false;
      DisplayLayer1.clear();
      await this.unsetHoveredItem();
      this.removeEditingItem();
      await this.removeSelectedItem();
      this.heightifyBoardItems(this.board);
    });

    this.board.on("dragover",async(event)=>{
      event.preventDefault();
      DisplayLayer1.blur();
      this.possibleDropArea = false;
      if(!this.timer){
         this.timer = true;
         const label = ComponentsBoard.getHtmlTagInfo({item:event.target}).label;
         const drop = await this.computeDropTarget({
            x:event.originalEvent.clientX,
            y: event.originalEvent.clientY,
            elem:event.target
          });
         this.possibleDropArea = drop;
         let area  = await this.computeItemArea({elem:drop.element,position:drop.position});
         if(area){
           DisplayLayer1.drawLabeledRect({label:`${drop.position!=='self'?`${drop.position} ${label}` :label}` ,top:area.top,left:area.left,height:area.height,width:area.width,id:this.DropAreaId,className:drop.position!=="self"?`${this.DropAreaId}-side`:`${this.DropAreaId}-cover`});
         }
         this.timer = false;
      }
    });
    this.board.on("dragleave",(event)=>{
      this.possibleDropArea = false;
      let isStillIn =this.board.has(event.originalEvent.fromElement).length>0 || this.board.is(event.originalEvent.fromElement);
      if(!isStillIn){
          this.updateExternalScreens();
          DisplayLayer1.unBlur();
      }
    });
    let droppedTarget = false;
    this.board.on("drop", (event)=>{
      event.preventDefault();
      DisplayLayer1.unBlur();
      let draggedInfo = Dragger.getData();
      let dragType = draggedInfo.type;
      const dragged = draggedInfo.item;
      if(this.possibleDropArea && dragged){
        const {position,element} =this.possibleDropArea;
        let commandArgs = false;
        if(position==="self"){
          commandArgs = {item:dragged,target:element};
        }else if (position==="top") {
          commandArgs = {item:dragged,before:true,target:element};
        }else if (position==="bottom") {
          commandArgs = {item:dragged,after:true,target:element};
        }else if (position==="left") {
          commandArgs = {item:dragged,before:true,target:element};
        }else if (position==="right") {
          commandArgs = {item:dragged,after:true,target:element};
        }
        if(dragType==="relocate" && commandArgs){
            let command = new RelocateBoardItem(commandArgs);
            this.alterBoard(command);
        }else if(commandArgs) {
            let command = new AddNewBoardItem(commandArgs);
            this.alterBoard(command);
        }else {
          console.error("position missing");
        }
      }
      if(draggedInfo.onDrop){
        draggedInfo.onDrop(draggedInfo);
      }
      this.heightifyBoardItems(this.board);
      this.possibleDropArea = false;
    });
    this.board.on("mouseenter",(e)=>{
      this.heightifyBoardItems(this.board);
    });
    this.board.on("mousemove",(e)=>{
      let {target} = e;
      this.setHoveredItem({target});
    });
    this.board.on("mouseout",(e)=>{
      let isStillIn =this.board.has(e.toElement).length>0 || this.board.is(e.toElement);
      if(!isStillIn){
        console.log("mouse out Board");
      }
      this.heightifyBoardItems(this.board);
    });
    this.board.on("contextmenu",(e)=>{
      e.preventDefault();
      e.stopPropagation();
      const {clientX,clientY}=e;
      const boardOffset = this.board.offset();
      console.log(this.board.parents(),"frame");
      PopUpMenu.show({top:clientY,left:clientX});
    });
    this.board.on("keydown",async(e)=>{
      console.log("key down", e);
      if(e.which ===8){
        let allSelected = this.getSelectedItem();
        let removeList = [];
        for(let i =0; i<allSelected.length; i++ ){
          let tagName = allSelected[i].tagName.toLowerCase();
          if(tagName!=="body" && tagName!=="html"){
            removeList.push(allSelected[i]);
          }
        }

        if(removeList.length>0){
          let command = new RemoveBoardItems({items:removeList});
          this.alterBoard(command);
        }
      }else if (e.which=== 38 || e.which=== 37) {//top left
          let allSelected = this.getSelectedItem();
          if(allSelected.length===1){
            let previousSibling = allSelected[0].previousElementSibling;
            if(previousSibling){
              await this.removeSelectedItem();
              this.setSelectedItem({target:previousSibling});
              this.treeBar.showFor({item:previousSibling});
              await this.showSelectedItem();
            }
          }
      }else if (e.which=== 40 || e.which=== 39) { //bottom right
        let allSelected = this.getSelectedItem();
        if(allSelected.length===1){
          let nextSibling = allSelected[0].nextElementSibling;
          if(nextSibling){
            await this.removeSelectedItem();
            this.setSelectedItem({target:nextSibling});
            this.treeBar.showFor({item:nextSibling});
            await this.showSelectedItem();
          }
        }
      }
    });
    this.board.click(async(e)=>{
      let {target} = e;
      const multiple = e.altKey;
      const itemInfo = ComponentsBoard.getHtmlTagInfo({item:target});
      const isSecondClikSelect = $(target).hasClass(this.ItemSelectedClass) && itemInfo.textEditable; //setEditingItem({target})
      const isClikEditing = $(target).hasClass(this.ItemUnderEditClass);
      await this.unsetHoveredItem();
      if(isSecondClikSelect && !multiple){ //set edit
        //get all seleted
        let allSelected = this.getSelectedItem();
        if(allSelected.length>0){
          for(let i =0; i< allSelected.length; i++){
             let elt = $(allSelected[i]);
             this.removeSelectedItem({target:allSelected[i]});
             if(allSelected[i].tagName.toLowerCase() === itemInfo.tag.toLowerCase()){
               this.setEditingItem({target:allSelected[i]});
               allSelected[i].addEventListener("input", this.collectifEditingListenner, false);
             }
          }
          this.updateExternalScreens();
          $(target).focus();
        }
        //
        //
      }else if(!isClikEditing){
        this.removeEditingItem();
        if(multiple && $(target).hasClass(this.ItemSelectedClass)){
          await this.removeSelectedItem({target:target});
        }else if(multiple) {
          this.setSelectedItem({target});
        }else {
          await this.removeSelectedItem();
          this.setSelectedItem({target});
          this.treeBar.showFor({item:target});
        }
        await this.showSelectedItem();
      }
      PopUpMenu.hide();
      return this.pauseEvent(e);
    });
  }
  heightifyBoardItems(elt){
    let childrens = $(elt).children();
    if(childrens && childrens.length>0){
      for(let i =0; i< childrens.length; i++){
        let child = childrens[i];
        // if(child.style.display==="grid" ){
        //   let tmpRows = window.getComputedStyle(child, null).getPropertyValue("grid-template-rows");
        //   let tmpCol = window.getComputedStyle(child, null).getPropertyValue("grid-template-columns");
        //   let Nc = tmpCol.split(" ");
        //   let Nr = tmpRows.split(" ");
        //   const start = child.childNodes.length;
        //   let counter =0;
        //   for(let r =0; r< Nr.length; r++){
        //     for(let cl =0; cl< Nc.length; cl++){
        //       if(counter>=start){
        //         $(child).append(`<div class='tmp-grid-item-holder' style="width:${Nc[cl]};  height:${Nr[r]}; data-gridcell="true" data-hoverable="false" data-selectable="false"></div>`);
        //       }
        //       counter = counter+1;
        //     }
        //   }
        //   // console.log({col:col.split(" "),row:rows.split(" ")});
        //   // for (var x = start; x < Nc * Nr; x++) {
        //   //   $(child).append(`<div class='tmp-grid-item-holder ${x===start?"next-cell":''}' data-gridcell="true" data-hoverable="false" data-selectable="false"></div>`);
        //   // }
        // }
        if(childrens[i].innerHTML.trim().length<=0){
          $(child).addClass("awa-board-empty-items");
        }else {
          $(child).removeClass("awa-board-empty-items");
        }
        this.heightifyBoardItems(child);
      }
    }
  }
  computeItemArea({elem,position}){
    return new Promise(async(resolve, reject)=>{
      const {top,left} = $(elem).offset();
      const eltHeight = elem.offsetHeight;
      const eltWidth = elem.offsetWidth;
      const hX = 15;
      if(position==="self"){
        let xTop = top, xLeft=left;
        let height =eltHeight;
        let width = eltWidth;
        return resolve({top:xTop ,left:xLeft, height, width});
      }else if (position==="top") {
        let height =hX;
        let width = eltWidth;
        let xTop = (top -(height/1.5)), xLeft=left;
        return resolve({top:xTop ,left:xLeft, height, width});
      }else if (position==="bottom") {
        let height =hX;
        let width = eltWidth;
        let xTop = (top+eltHeight), xLeft=left;
        return resolve({top:xTop ,left:xLeft, height, width});
      }else if (position==="left") {
        let height =eltHeight;
        let width = hX;
        let xTop = top, xLeft=left - (width/1.5);
        return resolve({top:xTop ,left:xLeft, height, width});
      }else if (position==="right") {
        let height =eltHeight;
        let width = hX;
        let xTop = top, xLeft=(left +eltWidth)- (width/1.5);
        return resolve({top:xTop ,left:xLeft, height, width});
      }
      return resolve(false);
    });
  }
  computeDropTarget({x,y,elem}) {
    return new Promise((resolve, reject)=>{
      let parent = $(elem).parent();
      const info = ComponentsBoard.getHtmlTagInfo({item:elem});
      if(parent[0].tagName.toLowerCase()==="html"){
        return resolve({element:elem,position:"self"});
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
        return resolve({element:elem,position:"self"});
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
       return resolve({element:elem,position:chosen});
     }
    });
  };
}
