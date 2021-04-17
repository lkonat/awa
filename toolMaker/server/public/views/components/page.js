const Page = (function({host}) {
  var layers = [];
  const layerStyles=`pointer-events: none;width:100%;height:100%;position:absolute;top:0px;left:0px;overflow:scroll; background-color:transparent;`;
  const includeIframe=(frame)=>{
    return new Promise((resolve, reject)=>{
      frame.on("load",()=>{
        frame.click((e)=>{
          console.log("click");
          if(e.stopPropagation) e.stopPropagation();
          if(e.preventDefault) e.preventDefault();
          e.cancelBubble=true;
          e.returnValue=false;
          return false;
        });
        return resolve();
    });
      // frame.on("load",()=>{
      //   return resolve();
      // });
    });
  }
  function build(){
    return new Promise(async(resolve, reject)=>{
      const buildView = ()=>{
        return new Promise(async(resolve, reject)=>{
          var view = {};
          view.page = $(`<div style="width:100%; height:100%;background-color:#2b2b2b;"></div>`);
          host.append(view.page);
          view.header = $(`<div>ooo</div>`);
          view.undoArea = $(`<div></div>`);
          view.header.append(view.undoArea);
          view.body = $(`<div style="width:100%; height:100%; display:grid; grid-template-columns:max-content auto max-content;  grid-template-rows:100%; grid-gap:7px;"></div>`);
          view.leftBody  = $(`<div><b>Awa</b></div>`);
          view.centerBody = $(`<div style="height:100%; display:grid; grid-template-rows:max-content auto max-content;"></div>`);
          view.centerMenuArea = $(`<div style="height:100%; "></div>`);
          view.frame = $(`<iframe class="workSpace-iframe" title="description" src="/folder/empty.html" scrolling="no"><p>Your browser does not support an iframe!</p></iframe>`);
          view.centerBottomArea = $(`<div style="height:100%; "></div>`);
          view.centerBody.append(view.centerMenuArea,view.frame,view.centerBottomArea);
          view.rightBody  = $(`<div style="width:100%; height:100%; display:grid; grid-template-rows:auto auto;  grid-template-columns:auto;"></div>`);
          view.componentsArea = $(`<div style="width:100%; overflow:scroll;"></div>`);
          view.selectionArea = $(`<div style="width:100%; overflow:scroll;"></div>`);
          view.rightBody.append(view.selectionArea,view.componentsArea);
          view.body.append(view.leftBody,view.centerBody,view.rightBody);
          view.footer = $(`<div>Footer</div>`);
          view.page.append(
            //view.header,
            view.body,
            //view.footer
          );
          await includeIframe(view.frame);
          var head = view.frame.contents().find("head");
          head.append(`<link class="awa-board-sheets" rel="stylesheet" href="/views/frame/css/board.css">`);
          head.append(`<link class="awa-board-sheets" rel="stylesheet" href="/views/frame/css/display1.css"> `);
          head.append(`<link class="awa-board-sheets" rel="stylesheet" href="/views/frame/css/selector.css">`);
          head.append(`<link class="awa-board-sheets" rel="stylesheet" href="/views/frame/css/body.css" >`);
          let doc = view.frame.contents()[0]
          view.html = view.frame.contents().find("html");
          view.scene = view.frame.contents().find("body");
          console.log(view.frame[0].contentWindow);
          view.html.click((e)=>{
             console.log("click iframe html");
             PopUpMenu.hide();
          });
          return resolve(view);
          });
        };
        const view = await buildView();
        const getBoard= ()=>{
          return view.scene;
        }
        const getIframe = ()=>{
          return view.frame;
        };
        const getStyleArea= ()=>{
          return view.selectionArea;
        }
        const getSelectionArea= ()=>{
          return view.selectionArea;
        }
        const getcomponentsArea= ()=>{
          return view.componentsArea;
        }
        const getUndoArea= ()=>{
          return view.centerMenuArea;
        }
        const getCenterBottomArea = ()=>{
          return view.centerBottomArea;
        };
        const getTargetedFrame = ()=>{
          return view.frame.contents()[0];
        };
        const addLayer= ()=>{
          const layer = $(`<div class="board-rear board-scene-layout" style="${layerStyles}"></div>`);
          view.html.append(layer);
          return layer;
        };

      return resolve({
        getBoard,
        getSelectionArea,
        getcomponentsArea,
        getUndoArea,
        addLayer,
        getStyleArea,
        getCenterBottomArea,
        getIframe,
        getTargetedFrame
      });
    });
  }

  return {
    build
  }
})({host:$("body")});
