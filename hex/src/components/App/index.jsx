
import HexGame from "./hexGame.jsx"
let urlSearchParams;
let url = window.location.href.split("/",4);
if(url[3] == ""){
  urlSearchParams = new URLSearchParams('?hostname=hex2048szb9jquj-hex15.functions.fnc.fr-par.scw.cloud&radius=2');
  window.history.replaceState({}, '', `?hostname=hex2048szb9jquj-hex15.functions.fnc.fr-par.scw.cloud&radius=2`);
} else {
  urlSearchParams = new URLSearchParams(window.location.search);
}

const params = Object.fromEntries(urlSearchParams.entries());
let radius = parseInt(params.radius);
let hostname = (params.hostname);
console.log(hostname);

let hexGame = new HexGame(radius, hostname);
hexGame.start();
let hexArray = hexGame.getHexArr();
let isReady = true;

document.addEventListener('keydown', function(event) {
  switch (event.keyCode) {
    case 87:
      if(isReady){
      hexGame.fullMove('top');
      isReady = false;
      setTimeout(function(){
        isReady=true;
      }, 350);
      }  
      break;

    case 69:
      if(isReady){
      hexGame.fullMove('topR');
        setTimeout(function(){
          isReady=true;
        }, 350);
        }
      break;

    case 81:
      if(isReady){
      hexGame.fullMove('topL');
      isReady = false;
        setTimeout(function(){
          isReady=true;
        }, 350);
        }  
      break;
      
    case 83:
      if(isReady){
      hexGame.fullMove('bot');
      isReady = false;
      setTimeout(function(){
        isReady=true;
      }, 350);
      }
      break;
      
    case 68:
      if(isReady){
      hexGame.fullMove('botR');
      isReady = false;
      setTimeout(function(){
        isReady=true;
      }, 350);
      }
      break;

    case 65:
      if(isReady){
      hexGame.fullMove('botL');
      isReady = false;
      setTimeout(function(){
        isReady=true;
      }, 350);
      }
      break;

    default:
  }
});

export const App = () => {
  return (
  <>
    <div id="gameView" style={{marginTop: radius*120}}>
    {hexArray.map((hex)=>{
      return hex;
    })}
    <div id="gameStatus">Game Status: <span id="data-status" data-status="playing">playing</span></div>
  </div> 
  </>
  
  );
}
