class StylePanel {
  constructor(args) {
     this.host = args.host;
     this.main = $(`<div style="width:250px; display:grid; grid-template-rows:max-content max-content auto;"></div>`);
     this.host.append(this.main);
     this.section
  }
  init({item}){
    return new Promise((resolve, reject)=>{
      this.main.empty();
      const bodyBgColor = `rgb(24,24,24)`;
      const label = ComponentsBoard.getHtmlTagInfo({item}).label;
      this.headerView = $(`<div style="padding:5px;background-color:rgb(8,10,20); color:white;">${label}</div>`);
      this.menuView = $(`<div style="background-color:rgb(44,44,44); color:grey; display:flex; flex-direction:row; padding:5px; padding-bottom:0px;gap:10px;"></div>`);
      this.bodyView = $(`<div style="background-color:${bodyBgColor}; color:grey; position:relative; width:100%; min-height:400px;border:1px solid blue;"></div>`);
      this.main.append(this.headerView,this.menuView,this.bodyView);
      const appearanceButton = $(`<div style="cursor:pointer;padding:7px; padding-bottom:3px;padding-top:3px; border-top-left-radius:5px;border-top-right-radius:5px;">Appearance</div>`);
      const actionButton = $(`<div style="cursor:pointer;padding:7px; padding-bottom:3px;padding-top:3px; border-top-left-radius:5px;border-top-right-radius:5px;">Action</div>`);
      this.menuView.append(appearanceButton,actionButton);
      const appearanceDiv = $(`<div style="width:100%; height:100%; position:absolute; top:0px; left:0px;padding:7px;">Appearance</div>`);
      this.bodyView.append(appearanceDiv);
      const actionDiv = $(`<div style="width:100%; height:100%; position:absolute; top:0px; left:0px;padding:7px;">Action</div>`);
      this.bodyView.append(actionDiv);
      const views = {
        appearance:{
          view:appearanceDiv,
          trigger:appearanceButton
        },
        action:{
          view:actionDiv,
          trigger:actionButton
        }
      };
      function activate(viewName){
         for(let view in views){
           if(view===viewName){
             views[view].view.show();
             views[view].trigger.css({"background-color":bodyBgColor,"color":"white"});
           }else {
             views[view].view.hide();
             views[view].trigger.css({"background-color":"inherit","color":"inherit"});
           }
         }
      }
      function showAppearance(){
        activate("appearance");
        const styles = StyleAgent.fetchItemStyle({item});
        // let styles = window.getComputedStyle(item);
        // console.log(styles);
          // let sheet = StyleAgent.setStyle({fileName:`http://localhost:3000/views/frame/css/board.css`,style:false});
          //   //sheet.insertRule(".awa-board-item-selected { background-color: black; color:blue;}", 10);
          //   console.log({sheet});
        console.log("CSS sheet",styles);
        //           const sizeBoard = new SizeBoard({host:appearanceDiv});
        // sizeBoard.init({
        //   minWidth:styles.minWidth,
        //   minHeight:styles.minHeight,
        //   maxWidth:styles.maxWidth,
        //   maxHeight:styles.maxHeight,
        //   width:styles.width,
        //   height:styles.height,
        //   onUpdate:(update)=>{
        //     console.log("update",update);
        //   }
        // });
      }
      function showActions(){
        activate("action");
      }
      showAppearance();
      appearanceButton.click((e)=>{
        e.stopPropagation();
        showAppearance();
      });
      actionButton.click((e)=>{
        e.stopPropagation();
        showActions();
      });
      return resolve(true);
    });
  }
}
