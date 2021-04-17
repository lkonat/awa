const StyleAgent = (()=>{
    var targetedContent = false;

    function getStyleSheet({exclude}){
      var sheets = [];
      var classes = targetedContent.styleSheets;
      for (var x = 0; x < classes.length; x++) {
        let excludeClass= exclude.className && classes[x].ownerNode.className === exclude.className;
        if(excludeClass){
           continue;
        }
        let rules = false;
        let type = false;
          try {
            rules = classes[x].Rules || classes[x].cssRules;
            type = classes[x].type;
          } catch (e) {
            rules = false;
          }
          if(rules && type==="text/css"){
            sheets.push(classes[x]);
          }
      }
      return sheets;
    }
    function setTargetContent(target){
      targetedContent = target;
    }
    function getItemStyles(selectors) {
      var cssText = "";
      var result = {};
      let allStyles = false;
      const sheets = getStyleSheet({exclude:{className:'awa-board-sheets'}});
      var classes = targetedContent.styleSheets;
      for (var x = 0; x < sheets.length; x++) {
          let rules = sheets[x].Rules || sheets[x].cssRules;
          if(rules){
            for(let i=0; i< rules.length; i++){
              let selector = rules[i].selectorText
              if (selector in selectors) {
                result[selector] = {location:[],styles:{},selector,lastIdx:0};
                result[selector].location.push(sheets[x].href);
                let next =0;
                result[selector].lastIdx = i;
                while(rules[i].style[next]){
                  let prop = rules[i].style[next];
                  if(!result[selector].styles){
                    result[selector].styles = {};
                  }
                  if(!allStyles){
                    allStyles = {};
                  }
                  result[selector].styles[prop] = rules[i].style[prop];
                  allStyles[prop] = rules[i].style[prop];
                  next++;
                }
                // cssText += rules[i].cssText || rules[i].style.cssText;
              }

            }
          }
      }
      return {...result,styles:allStyles};
    }
    function findStylseSheet(fileName) {
      const sheets = getStyleSheet({exclude:false});
      for (var x = 0; x < sheets.length; x++) {
          if(sheets[x].href ===fileName){
            return sheets[x]
          }
      }
      return false;
    }
    function getInlineStyles({item}){
      let result = {};
      let styles = item.style.cssText.split(";");
      for(let i =0; i<styles.length; i++ ){
        let parts = styles[i].split(":");
        let prop = parts[0]? parts[0].trim():false;
        let value =parts[1]? parts[1].trim():false;
        if(prop.length>0){
          result[prop] = value;
        }
      }
      return result;
    }
    function fetchItemStyle({item}){
       let selectors = {};
       let classes =[];
       let tmpClasses = item.className.split(" ");
       for(let i =0; i< tmpClasses.length; i++){
         let name = tmpClasses[i].trim();
         console.log({name});
         if(name.length>0 && !name.startsWith("awa-board")){
           selectors[`.`+name] = true;
           classes.push(name);
         }
       }
       let id = item.id ? item.id.trim():false;
       if(id){
        selectors[`#`+id] = true;
       }
       let inlineStyle = getInlineStyles({item});
       return {inlineStyle,classes,id,styleSheet:getItemStyles(selectors)}
    }
    function setStyle({fileName,style}){
      return findStylseSheet(fileName);
    }

    return{
      fetchItemStyle,
      setTargetContent,
      setStyle
    }
})();
