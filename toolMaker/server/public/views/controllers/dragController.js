const Dragger = (function() {
  var data = {};
  function setData(data0){
    if(!data0){
      data = {};
    }else {
      data = data0;
    }
  }
  function getData(){
    return data;
  }
  function clearData(){
    data = {};
  }
  function setDropTarget(elem){
    data.dropTarget = elem;
  }
  function dropOn(event){
    data.dropTarget = event.target;
    data.event = event;
    data.hasDropped = true;
  }
  function end(){
    if(data.onDrop){
      data.onDrop(data);
    }
    clearData();
  }
  return {
    setData,
    getData,
    clearData,
    setDropTarget,
    dropOn,
    end
  }
})();
