const PopUpMenu = (function(host) {
  var mainBox = false;
  var page = false;
  function show({top,left}){
    if(mainBox){
      mainBox.remove();
    }
    mainBox = $(`<div style="position:fixed; top:${top}px; left:${left}px; width:200px; min-height:300px; background-color: #2b2b2b; box-shadow: 0 0 5px grey;z-index:1000;">hello</div>`);
    host.append(mainBox);
  }
  function setPage(elem){
    page =elem;
  }
  function hide(){
    if(mainBox){
      mainBox.remove();
      mainBox = false;
    }
  }
  $("html").click((e)=>{
    hide();
  });
  return {
    show,
    hide,
    setPage
  }
})($("body"));
