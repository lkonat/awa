class BoardCommand {
  constructor({execute, undo, value,item}) {
    this.execute = execute;
    this.undo = undo;
    this.value = value;
    this.item =item;
  }
}
class AddItemCommand {
  constructor({execute,undo,item,host}) {
    this.execute = execute;
    this.undo = undo;
    this.item = item;
    this.host = host;
  }
}
class SnapHistoryCommand {
  constructor({execute,undo,item,host}) {
    this.execute = execute;
    this.undo = undo;
    this.item = item;
    this.host = host;
  }
  execute(board){
    this.currentState = board.getState();
  }
  undo(){
    this.item[0].style[this.prop] = this.oldValue;
  }
}
class UpdateCSSPropertyCommand {
  constructor({item,prop,value}) {
    this.item = item;
    this.prop = prop;
    this.value = value;
    this.oldValue = this.item[0].style[this.prop];
  }
  execute(){
    this.item[0].style[this.prop] = this.value;
  }
  undo(){
    this.item[0].style[this.prop] = this.oldValue;
  }
}

class UpdateAttrCommand {
  constructor({item,prop,value}) {
    this.item = item;
    this.prop = prop;
    this.value = value;
    this.oldValue = $(this.item).attr(prop);
  }
  execute(){
    let option = {};
    option[this.prop] = this.value;
    $(this.item).attr(option);
  }
  undo(){
    let option = {};
    option[this.prop] = this.oldValue;
    $(this.item).attr(option);
  }
}
class UpdateValCommand {
  constructor({item,value}) {
    this.item = item;
    this.prop = prop;
    this.value = value;
    this.oldValue = $(this.item).val();
  }
  execute(){
    $(this.item).val(this.value);
  }
  undo(){
    $(this.item).attr(this.oldValue);
  }
}


class AddNewBoardItem {
  constructor({item,before,after,target,execute,signal}) {
    this.item = item;
    this.before = before;
    this.after = after;
    this.execute0 = execute;
    this.target=target;
    this.signal = signal;
  }
  execute(board){
    board.addNewBoardItem({item:this.item,before:this.before,after:this.after,target:this.target});
    if(this.execute0){
      this.execute0();
    }
  }
}

class PopBoardItem {
  constructor({item,execute,signal}) {
    this.item = item;
    this.execute0 = execute;
    this.signal = signal;
  }
  execute(board){
    board.popItem({item:this.item});
    if(this.execute0){
      this.execute0();
    }
  }
}
class RemoveBoardItems {
  constructor({items,execute,signal}) {
    this.items = items;
    this.execute0 = execute;
  }
  execute(board){
    board.removeItems({items:this.items});
    if(this.execute0){
      this.execute0();
    }
  }
}
class RelocateBoardItem {
  constructor({item,before,after,target,execute,signal}) {
    this.item = item;
    this.before = before;
    this.after = after;
    this.execute0 = execute;
    this.target=target;
    this.signal = signal;
  }
  execute(board){
    board.relocateBoardItem({item:this.item,before:this.before,after:this.after,target:this.target});
    if(this.execute0){
      this.execute0();
    }
  }
}
