class SizeBoard {
  constructor(args) {
    this.host = args.host;
    this.view = $(`<div style=" width:100%; padding:3px; background-color:rgb(54,54,54);box-shadow: 0 0 2px black; "></div>`);
    this.host.append(this.view);
  }
  init({minWidth,minHeight,maxWidth,maxHeight,width,height,onUpdate}){
    console.log({minWidth,minHeight,maxWidth,maxHeight,width,height});
    this.view.empty();
    const inputUnits = ["px","%","em","auto","none"];
    const inputUnitsResetValues = {
      "px": {value:100},
      "%":{value:100},
      "em":{value:1}
    };
    const buildOne = ({location,inputUnits,label,defaultValue,styleName})=>{
      const extractUnit = ({value})=>{
        for(let i =0; i< inputUnits.length; i++){
          if(value.endsWith(inputUnits[i])){
            let tmp = parseFloat(value);
            return {value:tmp ||tmp===0?tmp:false, unit:inputUnits[i]};
          }
        }
        return false;
      };
        let area = $(`<div style="width:100%;display:grid; grid-template-rows:30px; grid-template-columns:40px auto; grid-gap:5px; align-items:center;"></div>`);
        location.append(area);
        let labelView = $(`<div style="display:flex;width:100%; height:100%; align-items:center;font-size:10px;">${label}</div>`);
        let inputArea = $(`<div style="width:100%; height:100%; display:grid; grid-template-rows:auto; grid-template-columns:auto auto; background-color:rgb(34, 34, 34); color:grey;align-items:center;"></div>`);
        let inputView =  $(`<input type="text" minlength="1" maxlength="4" size="4" autocomplete="off" style="background-color:inherit; border:none; outline:none;color:inherit; height:100%;">`);
        let unitDiv = $(`<div style="width:20px; height:100%;position:relative;"></div>`);
        inputArea.append(inputView,unitDiv);
        area.append(labelView,inputArea);
        let unitsView= $(`<select style="  -webkit-appearance: none;-moz-appearance: none;text-indent: 0px;background-color: inherit; width:100%; height:100%;color:transparent;cursor:pointer; outline:none;border:none;">${inputUnits.map((x)=>{
          return `<option value="${x}">${x.toUpperCase()}</option>`;
        })}</select>`);
        let over = $(`<div style='width:100%; height:100%; position:absolute; top:0px; left:0px;pointer-events:none; display:flex; justify-content:center; align-items:center;font-family:monospace;font-size:10px;'></div>`);
        unitDiv.append(unitsView,over);
        const updateUnit = ({unit,value})=>{
          if(unit==="auto" || unit==="none"){
            inputView.val(unit);
            inputView.attr("disabled",true);
            over.html("-");
          }else {
            let tmp = inputUnitsResetValues[unit];
            if(value>=0){
              inputView.val(value);
            }else if(tmp && tmp.value){
              inputView.val(tmp.value);
            }else {
              inputView.val("..");
            }
            inputView.attr("disabled",false);
            over.html(unit.toUpperCase());
          }
        };
        const setValue = ({value,unit})=>{
          unitsView.val(unit);
          updateUnit({value,unit});
        };
        if(defaultValue){
          const {unit, value} = extractUnit({value:defaultValue});
          setValue({value,unit});
        }else {
          setValue({value:0,unit:'auto'});
        }
        unitsView.on("change",()=>{
          let unit = unitsView.val();
          updateUnit({unit});
          let value = inputView.val();
          let str = `${value==="auto" || value==="none"?"":value}${unit}`;
          if(onUpdate){
            onUpdate({styleName,value:str});
          }
        });
        const updateValue = (valueX)=>{
            const {unit, value} = extractUnit({value:valueX});
            setValue({value,unit});
        };
        return {unitsView,inputView,labelView,updateValue};
    };


    let holder = $(`<div style="width:100%;display:grid; grid-template-rows: max-content max-content max-content; grid-template-columns:auto auto; grid-gap:5px;padding:10px;"></div>`);
    this.view.append(holder);
    const styles ={};
    styles.minWidth = buildOne({location:holder,inputUnits,label:"Min W",defaultValue:minWidth,styleName:"minWidth"});
    styles.minHeight = buildOne({location:holder,inputUnits,label:"Min H",defaultValue:minHeight,styleName:"minHeight"});
    styles.maxWidth = buildOne({location:holder,inputUnits,label:"Max W",defaultValue:maxWidth,styleName:"maxWidth"});
    styles.maxHeight = buildOne({location:holder,inputUnits,label:"Max H",defaultValue:maxHeight,styleName:"maxHeight"});
    styles.width = buildOne({location:holder,inputUnits,label:"Width",defaultValue:width,styleName:"width"});
    styles.height = buildOne({location:holder,inputUnits,label:"Height",defaultValue:height,styleName:"height"});
    const setValue=({styleName,value})=>{
      if(styles[styleName]){
        styles[styleName].updateValue(value);
      }
    };
    return {
      setValue,

    }
  }
}
