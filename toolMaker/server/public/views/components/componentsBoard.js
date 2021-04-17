const ComponentsBoard = (function() {
   var view = {};
   var area = false;
   var components = {};
   function initView(){
     view.box = $(`<div style="height:100%;display:grid; grid-template-rows:max-content auto; grid-template-columns:auto;padding:5px; color:silver;"></div>`);
     area.append(view.box);
     view.header = $(`<div>Components</div>`);
     view.body = $(`<div style=" overflow:scroll; font-size:12px;"></div>`);
     view.box.append(view.header,
      view.body
     );
   }
   function setHost({host}){
     if(host){
       area = host;
       initView();
     }
   }
   function addComponent({id,tag,label,textEditable,item, icon,detail}){
     components[id] = {label,tag,label,textEditable,item, icon,detail};
     let viewX = $(`<div style="display:grid; grid-template-rows:auto; grid-template-columns:max-content auto;grid-gap:5px;margin-top:10px;background-color:rgb(64, 64, 64);"></div>`);
     let iconView = $(`<div draggable="true" style="width:70px; height:50px;border:1px solid black;background-color:rgb(24, 24, 24);padding:3px; display:grid; align-items:center; justify-content: center;cursor: grab;color:grey;">${id}</div>`);
     let detailView = $(`<div style="display:grid; grid-template-columns:auto; grid-template-rows:max-content auto;"></div>`);
     viewX.append(iconView,detailView);
     let labelView = $(`<span >${label}</span>`);
     let detailPara = $(`<p style="color:grey;">${detail}</p>`);
     detailView.append(labelView,detailPara);
     view.body.append(viewX);
     iconView.on("dragstart",(event)=>{
       const elt = $(`<div style="width:100px;height:30px;background-color:rgba(7, 166, 245,0.5);color:white;cursor:grabbing;" ><center>${$(item)[0].tagName}</center></div>`);
       document.body.appendChild(elt[0]);
       event.originalEvent.dataTransfer.setDragImage(elt[0], 50, -30);
       event.originalEvent.dataTransfer.setData("info",JSON.stringify({item}));
       $(item).addClass(`awa-board-component-hide-dragg`);
       $(elt).addClass(`awa-board-component-hide-dragg`);
       Dragger.setData({
         item:$(item)[0],
         height:"50",
         onDrop:(info)=>{
           $(item).removeClass(`awa-board-component-hide-dragg`);
           elt.remove();
             $(item)[0].style.opacity = "1";
             $(item)[0].style.display = info.display;
         }
        });
        $(item)[0].style.opacity = "0.1";
        setTimeout(()=>{
            $(item)[0].style.display = "none";
            elt.hide();
        }, 1);
     });
     iconView.on("dragend",(event)=>{
       Dragger.end();
     });
   }
   function getHtmlTagInfo({item}){
     const setLabel = $(item).data("htmllabel");
     if(setLabel){
       return {label:setLabel,tag:"Body",description:"Body"};
     }
     const tag = item.tagName.toLowerCase();
     if(tag==="div"){
       let display = item.style.display;
       if(display==="grid"){
         return {label:"grid",tag:"div",description:"grid"};
       }else if (display==="flex") {
         return {label:"flex-box",tag:"div",description:"flex-box"};
       }else {
         return {label:"Div",tag:"div",description:"fDiv"};
       }
     }else {
       for(let elt in components){
         if(components[elt].tag ===tag){
            return {label:components[elt].label,tag,description:components[elt].detail,textEditable:components[elt].textEditable};
         }
       }
       return {label:tag,tag:tag,description:tag};
     }
   }
   return {
     setHost,
     addComponent,
     getHtmlTagInfo
   }
})();
