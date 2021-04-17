const StyleBoard = (function(){



  var iternalEvents = {};
  var SpaceViewController = false;
  var host = false;
  var mainBox = false;
  var box = false;
  var labelView= false;
  var table= false;
  var spaceArea  = false;
  var sizeArea = false;
  var sizeBoard = false;
  var newArea = false;
  var stylePanel = false;
  const on = (eventX,callBack)=>{
    iternalEvents[eventX] = callBack;
  };
  const fireEvent = (eventX,args)=>{
    if(iternalEvents[eventX]){
      iternalEvents[eventX](args);
    }
  };
  function initView(){
    mainBox = $(`<div style="width:100%;color:#d9d9d9;padding:3px;"></div>`);
    labelView = $(`<div></div>`);
    table = $(`<table style="font-size:12px; width:100%;border-collapse:separate;border-spacing:0.5em;"></table>`);
    spaceArea = $(`<div></div>`);
    sizeArea = $(`<div ></div>`);
    newArea = $(`<div></div>`);
    host.append(mainBox);
    mainBox.append(labelView,newArea,spaceArea,sizeArea,table);
    stylePanel = new StylePanel({host:newArea});
    // sizeBoard = new SizeBoard({host:sizeArea});
    // SpaceViewController = new SpaceView({host:spaceArea});
    // SpaceViewController.init({
    //   paddingTop:0,
    //   paddingLeft:0,
    //   paddingBottom:0,
    //   paddingRight:0,
    //   marginTop:0,
    //   marginLeft:0,
    //   marginBottom:0,
    //   marginRight:0
    // });
  }
  function setHost({area}){
    if(area){
      host = area
      initView();
    }
  }
  function renderOne({item}){
    table.empty();
    // const label = ComponentsBoard.getHtmlTagInfo({item}).label;
    // labelView.html(`<b>${label}</b>`);
    // let styles = window.getComputedStyle(item);
    // console.log(styles.width, styles.height,styles.maxWidth);
    //   let sheet = StyleAgent.setStyle({fileName:`http://localhost:3000/views/frame/css/board.css`,style:false});
    //     //sheet.insertRule(".awa-board-item-selected { background-color: black; color:blue;}", 10);
    //     console.log({sheet});
    //           console.log("CSS sheet",item.className,StyleAgent.fetchItemStyle({item}));
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
   stylePanel.init({item});
    // SpaceViewController.init({
    //   paddingTop:(item.style.paddingTop),
    //   paddingLeft:(item.style.paddingLeft),
    //   paddingBottom:(item.style.paddingBottom),
    //   paddingRight:(item.style.paddingRight),
    //   marginTop:item.style.marginTop,
    //   marginLeft:item.style.marginLeft,
    //   marginBottom:item.style.marginBottom,
    //   marginRight:item.style.marginRight
    // });
    // SpaceViewController.on("update",(info)=>{
    //   console.log("update",info);
    //   // let currentMargin= parseFloat(item[0].style[info.styleName]);
    //   // currentMargin = currentMargin>=0?currentMargin:0;
    //   // if((currentMargin+info.distance)>=0){
    //   //   currentMargin = currentMargin+info.distance;
    //   //   space.updateText({styleName:info.styleName,distance:currentMargin});
    //   //   item[0].style[info.styleName] = currentMargin+"px";
    //   //   Selector.refreshSelector();
    //   // }
    // });
    // SpaceViewController.on("input",(info)=>{
    //   console.log(info);
    //   // let currentMargin= parseFloat(item[0].style[info.styleName]);
    //   // currentMargin = currentMargin>=0?currentMargin:0;
    //   // if((currentMargin+info.distance)>=0){
    //   //   currentMargin = currentMargin+info.distance;
    //   //   space.updateText({styleName:info.styleName,distance:currentMargin});
    //   //   item[0].style[info.styleName] = currentMargin+"px";
    //   //   Selector.refreshSelector();
    //   // }
    // });
    // SpaceViewController.on("change",(info)=>{
    //   console.log(info,"changed");
    //   // let currentMargin= parseFloat(item[0].style[info.styleName]);
    //   // currentMargin = currentMargin>=0?currentMargin:0;
    //   // if((currentMargin+info.distance)>=0){
    //   //   currentMargin = currentMargin+info.distance;
    //   //   space.updateText({styleName:info.styleName,distance:currentMargin});
    //   //   let command = new UpdateCSSPropertyCommand({item,prop:info.styleName,value:currentMargin+"px"});
    //   //   fireEvent("command",command);
    //   // }
    // });
    showCssProperty({prop:"width",label:'Width',inputType:'number-and-unit',value:false,table:table,item:$(item),inputUnits:["px","%","em","auto"]});
    showCssProperty({prop:"height",label:'Height',inputType:'number-and-unit',value:false,table:table,item:$(item),inputUnits:["px","%","em","auto"]});
    showCssProperty({prop:"color",label:'Color',inputType:'color',value:false,table:table,item:$(item)});
    showCssProperty({prop:"background-color",label:'Background',inputType:'color',value:false,table:table,item:$(item)});
    showCssProperty({prop:"font-size",label:'Font Size',inputType:'number-and-unit',value:false,table:table,item:$(item),inputUnits:["px","%","em","auto"]});
  }
  function renderItem({items}){
    if(items.length===1){
      renderOne({item:items[0]});
    }
     console.log({items});

  }
  function rgba2hex(orig) {
      var a, isPercent,
        rgb = orig.replace(/\s/g, '').match(/^rgba?\((\d+),(\d+),(\d+),?([^,\s)]+)?/i),
        alpha = (rgb && rgb[4] || "").trim(),
        hex = rgb ?
        (rgb[1] | 1 << 8).toString(16).slice(1) +
        (rgb[2] | 1 << 8).toString(16).slice(1) +
        (rgb[3] | 1 << 8).toString(16).slice(1) : orig;

      if (alpha !== "") {
        a = alpha;
      } else {
        a = 01;
      }
      // multiply before convert to HEX
      a = ((a * 255) | 1 << 8).toString(16).slice(1)
      hex = hex + a;

      return hex;
  }
  function rgb2hex(rgb) {
    const hexDigits = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"];
    const hex =(x)=>{
      return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
    }
    try {
      if (rgb.startsWith("rgb")) {
        rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
      }else {
        return rgb;
      }
    } catch (e) {
      return false;
    }
  }
  function showCssProperty({prop,label,inputType,inputUnits,value,table,item}){
     let row =  $(`<tr ></tr>`);
     let labelCol =  $(`<td style="padding:3px;">${label}</td>`);
     let inputCol =  $(`<td style="background-color:rgb(24, 24, 24);"></td>`);
     row.append(labelCol,inputCol);
     table.append(row);
     if(inputType === "color"){
       let currentColor = item.css(prop);
       const hexaColor = rgb2hex(currentColor);
       currentColor = currentColor? currentColor.startsWith("#")?currentColor:hexaColor?hexaColor:'#FFFFFF':"#FFFFFF";
       const colorField = $(`<input type="${inputType}" value="${currentColor}" style="border:none; outline:none;background-color:inherit;width:100%;">`);
       inputCol.append(colorField);
       let timer = false;
       colorField.on("input",()=>{
         if(timer){
           clearTimeout(timer);
         }
         timer = setTimeout(()=>{
           let command = new UpdateCSSPropertyCommand({item,prop,value:colorField.val()});
           fireEvent("command",command);
         },700);
       });
     }else if (inputType === "number-and-unit") {
       let currentValue = item[0].style[prop];
       let nInput =false, tmpUnit = false;
       if(currentValue.endsWith("px")){
         nInput = parseFloat(currentValue);
         tmpUnit = "px";
       }else if(currentValue.endsWith("%")) {
         nInput = parseFloat(currentValue);
         tmpUnit = "%";
       }
       else if(currentValue.endsWith("em")) {
         nInput = parseFloat(currentValue);
         tmpUnit = "em";
       }
       let boxX = $(`<div style="display:flex; flex-direction:row; width:100%;"></div>`);
       inputCol.append(boxX);
       let number = $(`<input type="number" min="0"  value="${nInput?nInput:0}" style="border:none; outline:none; width:50px;background-color:inherit;">`);
       let units= $(`<select style="border:none; outline:none;background-color:inherit; color:grey;">${inputUnits.map((x)=>{
         return `<option value="${x}">${x}</option>`;
       })}</select>`);
       let defaultUnit = tmpUnit?tmpUnit:"auto";
       if(defaultUnit ==="auto"){
         $(number).prop("disabled",true);
       }else {
         $(number).prop("disabled",false);
       }
       units.val(defaultUnit);
       boxX.append(number,units);
       number.on("change",()=>{
         let tmpUnit = units.val();
         const value = tmpUnit==="auto"?`${tmpUnit}`:`${number.val()}${tmpUnit}`;
         if(value ==="auto"){
           $(number).prop("disabled",true);
         }else {
           $(number).prop("disabled",false);
         }
         let command = new UpdateCSSPropertyCommand({item,prop,value:value});
         fireEvent("command",command);
       });
       units.on("change",()=>{
         let tmpUnit = units.val();
         const value = tmpUnit==="auto"?`${tmpUnit}`:`${number.val()}${tmpUnit}`;
         if(value ==="auto"){
           $(number).prop("disabled",true);
         }else {
           $(number).prop("disabled",false);
         }
         let command = new UpdateCSSPropertyCommand({item,prop,value:value});
         fireEvent("command",command);
       });
     }
   }
  return {
    setHost,
    renderItem,
    on
  }
})();
