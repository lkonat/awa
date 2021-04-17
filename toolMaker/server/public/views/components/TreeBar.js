class BoardTreeBar {
  constructor(args) {
    this.host = args.host;
    this.internalEvents = {};
    this.initView();
  }
  fireEvent(name,args){
    if(this.internalEvents[name]){
      this.internalEvents[name](args);
    }
  }
  on(eventX,callBack){
    this.internalEvents[eventX]=callBack;
  }
  initView(){
    this.box = $(`<div class="tree-bar-items-holders"></div>`);
    this.host.append(this.box);
  }
  reset(){
    this.box.empty();
  }
  showFor({item}){
    let parents = $(item).parents();
    this.box.empty();
    let start = false;


    const showOne =(item)=>{
      const label = ComponentsBoard.getHtmlTagInfo({item}).label;
      let one = $(`<div class="tree-bar-items">${label}</div>`);
      this.box.append(one);
      one.click((e)=>{
        e.stopPropagation();
        this.fireEvent("select-item",{item});
      });
    };
    for(let i =parents.length -1; i>=0; i--){
      if(parents[i].tagName.toLowerCase()==="body"){
         start = true;
      }
      if(start){
        showOne(parents[i]);
      }
    }
    showOne(item);
  }
}
