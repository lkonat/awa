const Selector = (function() {
  var layerDisplay = false;
  var timer = false;
  var frame = false;
  var iternalEvents = {};
  var WorkSpace = false;
  var currentHovered = false;
  var currentSelected = false;
  var currentEditing = false;
  const ItemSelectedClass ="selector-item-selected";
  const ItemHoveredClass = "selector-item-hovered";
  const ItemUnderEditClass = "selector-item-editing";
  const getCurrentSelected = ()=>{
    return $(WorkSpace.getElt({className:ItemSelectedClass}));
  };
  const getCurrentHovered = ()=>{
    return $(WorkSpace.getElt({className:ItemHoveredClass}));
  };
  const getCurrentEditing = ()=>{
    return $(WorkSpace.getElt({className:ItemUnderEditClass}));
  };
  const on = (eventX,callBack)=>{
    iternalEvents[eventX] = callBack;
  };
  const fireEvent = (eventX,args)=>{
    if(iternalEvents[eventX]){
      iternalEvents[eventX](args);
    }
  };
 const setLayerDisplay =({display})=>{
   if(display){
     layerDisplay = display;
   }
 };
 function refreshBoard(){
   if(WorkSpace){
     WorkSpace.refresh();
   }
 }
 function setBoard(elem){
   if(elem){
     WorkSpace = elem;
   }
 }
 function refreshSelector(){
   if(currentHovered){
     showHoverItemLabel(currentHovered);
   }
   if(currentSelected){
     console.log("refreshing",currentSelected);
     showSelectedItemLabel(currentSelected);
   }
   if(currentEditing){
     showEditingItemLabel(currentEditing);
   }
 }
  function select({board,item,doubleClick}){
    let selected = $(item);
    clearAll();
    if(doubleClick && ComponentsBoard.getHtmlTagInfo({item:$(item)}).textEditable){
      showEditingItemLabel({item,board});
    }else {
      showSelectedItemLabel({item:selected,board});
      if(ComponentsBoard.getHtmlTagInfo({item:$(item)}).label.toLowerCase() !=="body"){
        selected.attr("draggable",true);
        selected.addClass("draggable");
        selected.on("dragstart",(event)=>{
          selected[0].classList.add("selector-hide-dragg");
          Dragger.setData({
            item:selected[0],
            display:selected[0].style.display,
            height:selected.height(),
            width:selected.width(),
            onDrop:(info)=>{
              if(info.hasDropped){
                Selector.itemDroppedToBoard({element:$(info.item),target:$(info.dropTarget),event:info.event});
              }
             selected.removeClass("selector-hide-dragg");
              event.target.style.opacity = "1";
              event.target.style.display = info.display;
            }
          });
          event.target.style.opacity = "0.1";
          setTimeout(()=>{
            selected[0].style.display = "none";
          }, 1);
        });
        selected.on("dragend",(event)=>{
          Dragger.end();
        });
      }
    }
    StyleBoard.renderItem({item:selected});
  };
  function clearEditing(){
    let elt = WorkSpace.getElt({className:ItemUnderEditClass});
    if(elt.length>0){
      $(elt).removeAttr("contenteditable");
      $(elt).removeClass(ItemUnderEditClass);
    }
    DisplayLayer1.clear({idName:`display1-${ItemUnderEditClass}`});
    currentEditing = false;
  }
  function clearHovers(){
    let elt = WorkSpace.getElt({className:ItemHoveredClass});
    if(elt.length>0){
      $(elt).removeClass(ItemHoveredClass);
      $(elt).removeClass("draggable");
      $(elt).removeAttr("draggable");
    }
    DisplayLayer1.clear({idName:`display1-${ItemHoveredClass}`});
    currentHovered = false;
  }
  function clearSelection(){
    let elt = WorkSpace.getElt({className:ItemSelectedClass});
    if(elt.length>0){
      $(elt).removeAttr("contenteditable");
      $(elt).removeClass("draggable");
      $(elt).removeClass("editable");
      $(elt).removeAttr("draggable");
      $(elt).removeClass(ItemSelectedClass);
    }
    currentSelected = false;
    DisplayLayer1.clear({idName:`display1-${ItemSelectedClass}`});
  }
  function clearAll(){
    clearHovers();
    clearSelection();
    clearEditing();
  }
  function showHoverItemLabel({item,board}){
    $(WorkSpace.getElt({className:ItemHoveredClass})).removeClass(ItemHoveredClass);
    $(item).addClass(ItemHoveredClass);
    if(!$(item).hasClass(ItemSelectedClass) && !$(item).hasClass(ItemUnderEditClass)){
      const boardOffset = board.offset();
      const boardTop = boardOffset.top;
      const {top,left} = item.offset();
      const label = ComponentsBoard.getHtmlTagInfo({item}).label;
      if((top-boardTop)<30){
         DisplayLayer1.drawTextInsideRect({top,left,text:label,id:`display1-${ItemHoveredClass}`});
      }else {
         DisplayLayer1.drawTextAboveRect({top,left,text:label,id:`display1-${ItemHoveredClass}`});
      }
      currentHovered = {item,board};
    }else {
      clearHovers();
    }
  }
  function showEditingItemLabel({item,board}){
    if(currentEditing){
        $(WorkSpace.getElt({className:ItemUnderEditClass})).removeClass(ItemUnderEditClass);
    }
    $(item).addClass(ItemUnderEditClass);
    $(item).attr("contenteditable",true);
    $(item).focus();
    const boardOffset = board.offset();
    const boardTop = boardOffset.top;
    const {top,left} = $(item).offset();
    const label = ComponentsBoard.getHtmlTagInfo({item:$(item)}).label;
    if((top-boardTop)<30){
       DisplayLayer1.drawTextInsideRect({top,left,text:`Editing ${label}....`,id:`display1-${ItemUnderEditClass}`});
    }else {
       DisplayLayer1.drawTextAboveRect({top,left,text:`Editing ${label}....`,id:`display1-${ItemUnderEditClass}`});
    }
    currentEditing = {item,board};
  }
  function showSelectedItemLabel({item,board}){
    console.log({item,board});
    const boardOffset = board.offset();
    const boardTop = boardOffset.top;
    const {top,left} = item.offset();
    const label = ComponentsBoard.getHtmlTagInfo({item}).label;
    const labelView = $(`<div>${label}</div>`);
    const setting = $(`<span> Setting</span>`);
    labelView.append(setting);
    item.addClass(ItemSelectedClass);
    if(top<=boardTop+100){
       DisplayLayer1.drawTextInsideRect({top,left,htmlText:labelView,id:`display1-${ItemSelectedClass}`});
    }else {
       DisplayLayer1.drawTextAboveRect({top,left,htmlText:labelView,id:`display1-${ItemSelectedClass}`});
    }
    setting.click((e)=>{
      e.stopPropagation();
      console.log("click on item label setting ",label);
    });
    clearHovers();
    clearEditing();
    currentSelected = {item,board};
  };
  function bodyScroll(){
    console.log("refresh");
    refreshSelector();
  }
  function itemDroppedToBoard({target,event,element}){
    NormalDragDrop.handleDrop({target,event,dragged:element});
    refreshBoard();
  }
  function dragLeftBoard(){
   console.log("drag left board");
   DisplayLayer1.clear();
  }
  let currentDraggingTarget = false;
  function draggingOnBoard(event){
    return new Promise((resolve, reject)=>{
      clearSelection();
      clearHovers();
      NormalDragDrop.handleDragging(event);
      setTimeout(()=>{
        return resolve();
      },30);
    });
  }
  function clear(){
    clearAll();
  }
  return {
    select,
    setLayerDisplay,
    on,
    clearHovers,
    showHoverItemLabel,
    itemDroppedToBoard,
    dragLeftBoard,
    draggingOnBoard,
    bodyScroll,
    setBoard,
    clearSelection,
    refreshSelector,
    clear
  }
})();
