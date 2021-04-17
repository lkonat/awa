class Header extends BoardItems{
  constructor(args) {
    super(args);
  }
  initView({host}){
    this.main = $(`<h1>Header 1</h1>`);
    host.append(this.main);
    this.main.click((e)=>{
      e.stopPropagation();
      Selector.doubleClickSelect({item:this.main});
    });
  }
}
