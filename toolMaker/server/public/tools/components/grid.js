class Grid extends BoardItems{
  constructor(args) {
    super(args);
    this.rows = new Array(args.rows?args.rows:3).fill("max-content");
    this.columns = new Array(args.columns?args.columns:3).fill("auto");
  }
  initView({host}){
    this.main= $(`<div class="grid" style="width:100%; height:100%;display:grid; grid-template-rows:${this.rows.join(" ")}; grid-template-columns:${this.columns.join(" ")};"></div>`);
    host.append(this.main);
    let idx = 0;
    for(let i =0; i<this.rows.length; i++){
      for(let j =0; j<this.columns.length; j++ ){
        ((i,j)=>{
          let item = $(`<div class="grid-items">${idx}</div>`);
          idx++;
          this.main.append(item);
          item.click((e)=>{
            e.stopPropagation();
            // const options = [
            //   {
            //     label:"test",
            //     onClick:()=>{
            //       this.box.css({"grid-template-rows":"max-content auto max-content"});
            //     }
            //   },
            //   {label:"test"},
            //   {label:"test"},
            //   {label:"test"},
            //   {label:"test"},
            // ];
            // Selector.select({item,options});
          });
        })(i,j);
      }
    }
  }
}
