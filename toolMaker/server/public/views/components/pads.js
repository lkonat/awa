class Pad {
  constructor({after,before,where}) {
   this.after = after;
   this.before = before;
   this.show();
  }
  show(){
    this.box= $(`<div class="pads" ${this.after?'data-pos1="before" data-pos2="after"':this.before?`data-pos1="after" data-pos2="before"`:''} style="display:flex;justify-content: center; align-items:center;"></div>`);
    if(this.after){
     this.box.insertAfter(this.after);
   }else if (this.before) {
     this.box.insertBefore(this.before);
   }
  }
}
