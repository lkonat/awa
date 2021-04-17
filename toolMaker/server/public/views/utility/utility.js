function makeid() {
  var text = "";
  var possible =
    "abcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 5; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

function getNextSiblingPad({x,y,elem, selector}) {
  if($(elem).hasClass("pads")){
    return {element:elem,exactHover:true};
  }
  let siblings = [elem.previousElementSibling,elem.nextElementSibling];
  let minDistance = Infinity;
  let chosen = false;
  for(let i =0; i<siblings.length; i++){
    if(siblings[i] && siblings[i].matches(selector)){
      const {top,left} = $(siblings[i]).offset();
      const height =$(siblings[i]).height(),width= $(siblings[i]).width();
      let a = x - (left+(width/2));
      let b = y - (top + (height/2));
      let distance = Math.sqrt( a*a + b*b );
      if(minDistance>distance){
        minDistance =distance;
        chosen = siblings[i]
      }
    }
  }
  if(!chosen){
    return false;
  }
  return {element:chosen};
};
