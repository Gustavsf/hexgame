
export default class HexGame{
    constructor(radius, hostname){
        this.radius = radius;
        this.hostname = hostname;
    }
    x = 0;
    y = 0;
    xOffSet = 53;
    yOffSet = 90;
    hexConfig;
    offSetConfig;
    hexDivArray;
    marginTop = this.radius * 100;
    
    //initial setup
    start(){
      this.getHexConfig();
      this.getOffSetConfig();
      this.getHexArray();
      if(this.radius >= 4){
        document.body.style.zoom=0.8;
      }
      this.fetchR([]);
    }
    getHexArr(){
      return this.hexDivArray;
    }
    //returns array if radius 3 then [3,4,5,4,3]
    getHexConfig(){
        let arr =[];
        for(let i =0 ; i<(this.radius*2)-1;i++){
          if(i < this.radius){
            arr.push(this.radius+i);
          }else {
            arr.push(arr[i-1]-1);
          }
        }
        this.hexConfig = arr;
    }

    //returns array [3,4,5,4,3] == [0, 0, 53, 90, 106, 180, 212, 180, 318, 180] => x and y position for hex cells
    getOffSetConfig(){
        let osConfig=[];
        let last=[];
        let a, b;
        for(let i = 0; i<this.hexConfig.length; i++){
          if(i === 0){
            osConfig.push(0, 0);
            last.push(0,0)
          } else {
            //if + then x+53;y+90, else x+106;y+0
            if((this.hexConfig[i] - this.hexConfig[i-1])>0){
              a = last[0]+this.xOffSet;
              b = last[1]+this.yOffSet;
              osConfig.push(a, b);
              last = [];
              last.push(a, b);       
            }else {
              a = last[0]+this.xOffSet*2;
              b = last[1];
              osConfig.push(a, b);
              last = [];
              last.push(a, b);     
            }
          }
        }
        this.offSetConfig = osConfig;
      }

    //Hex array with divs
    getHexArray(){
        let array = [];                            
        let num = 1;        
        let id = 0;
        let rowAmount =this.hexConfig.length;
      
        let dataZ = this.radius-1;
        for(let i = 0; i<rowAmount;i++){
          let dataX = 0;
          let dataY = -this.radius+1;
      
          if(i!==0){
            if(i<(rowAmount+1)/2){
              dataX = i;
            }else {
              dataX = this.radius-1;        
            }
            if(i>=this.radius){
              dataY=-(rowAmount-i-1);        
            }     
          }     
            this.x = this.offSetConfig[num-1];
            this.y = this.offSetConfig[num];
            for(let z = 0; z<this.hexConfig[i]; z++){
              this.x = this.x + this.xOffSet;
              this.y = this.y - this.yOffSet;
              array.push(<div className="hexagon" data-x={dataX} data-y={dataY} data-z={dataZ} data-value={''} id={id} key={id} 
              style={{transform: 'translate('+ this.x + 'px, '+ this.y +'px)', position:'absolute'}}></div>);
              dataX-=1;
              dataY+=1;
              id++;                
            }
            dataZ--;
            num = num + 2;     
          }
        this.hexDivArray = array;
    }

    //returns unique string from hexgame atributes
    getArrayString(arr){
      let str = "";
      for (let key in arr) {
        str = str + arr[key].x + arr[key].y + arr[key].z + arr[key].value;
      }
      return str;
    }
    
    //moves cells, if there is free space
    setAtr(arr2, num, opt, check){
        let lastHex;
        let moved = false;
        if(opt === 'bot'){
          arr2.reverse();
        }
          
        let isGood = true;
        for(let i = 0; i<this.hexConfig[num]; i++){
          let smth = document.getElementById(arr2[this.hexConfig[num]-1-i]);
          let dataValue = smth.getAttribute('data-value');
          if(dataValue == 0 && isGood){
             lastHex = smth;
             isGood = false;
             moved = true;

          } else if(dataValue != 0 && !isGood){
            if(check === true ){
              lastHex.setAttribute('data-value', dataValue);
              smth.setAttribute('data-value', '');
            }
            isGood = true;            
          }
        }
        return moved;        
    }
    
    //combines cells if same
    combine(arr2, num, opt, check){
        let lastHex1;
        let combined = false;
        if(opt === 'bot'){
          arr2.reverse();
        } 
      
        let isGood = true;
          for(let i = 0; i<this.hexConfig[num]; i++){
            let smth = document.getElementById(arr2[this.hexConfig[num]-1-i]);
            let dataValue = smth.getAttribute('data-value');
      
            if(dataValue != 0 && isGood){
              lastHex1 = smth;
              isGood = false;
            } else if(dataValue != 0 && !isGood) {          
              if(dataValue == lastHex1.getAttribute('data-value')){
                if(check === true){
                  lastHex1.setAttribute('data-value', dataValue*2);
                  smth.setAttribute('data-value', '');
                } 
                combined = true;
                isGood = true;
              }
              lastHex1 = smth;
            }
          }
          return combined;
      }

    moveHex(opt, action){
        let arr = document.getElementsByClassName("hexagon");
        let arr2=[];
        let num = 0;
        let rad = -this.radius+1;
      
        for(let c =0; c<this.hexConfig.length; c++){
          for(let i =0; i<arr.length;i++){
            let x = arr[i].getAttribute('data-x');
            let y = arr[i].getAttribute('data-y');
            let z = arr[i].getAttribute('data-z');
            let id = arr[i].getAttribute('id');
            if((opt === "top") && (x == rad)){
              arr2.push(id);       
              if(arr2.length === this.hexConfig[num]){              
                if(action === "combine"){
                  this.combine(arr2, num, "top", true);
                } else {
                  this.setAtr(arr2, num, "top", true);
                }
                num++;
                arr2=[];
              }              
            }
            if((opt === "topR") && (y == -rad)){
              arr2.push(id);       
              if(arr2.length === this.hexConfig[num]){
                if(action === "combine"){
                  this.combine(arr2, num, "top", true);
                } else {
                  this.setAtr(arr2, num, "top", true);
                }
                num++;
                arr2=[];
              }
            }
            if((opt === "topL") && (z == rad)){
              arr2.push(id);       
              if(arr2.length === this.hexConfig[num]){
                if(action === "combine"){
                  this.combine(arr2, num, "top", true);
                } else {
                  this.setAtr(arr2, num, "top", true);
                }
                num++;
                arr2=[];
              }
            }
            if((opt === "bot") && (x == -rad)){
              arr2.push(id);       
              if(arr2.length === this.hexConfig[num]){
                if(action === "combine"){
                  this.combine(arr2, num, "bot", true);
                } else {
                  this.setAtr(arr2, num, "bot", true);
                }
                num++;
                arr2=[];
              }
            }
            if((opt === "botR") && (z == -rad)){
              arr2.push(id);       
              if(arr2.length === this.hexConfig[num]){
                if(action === "combine"){
                  this.combine(arr2, num, "bot", true);
                } else {
                  this.setAtr(arr2, num, "bot", true);
                }
                num++;
                arr2=[];
              }
            }
            if((opt === "botL") && (y == rad)){
              arr2.push(id);       
              if(arr2.length === this.hexConfig[num]){
                if(action === "combine"){
                  this.combine(arr2, num, "bot", true);
                } else {
                  this.setAtr(arr2, num, "bot", true);
                }
                num++;
                arr2=[];
              }
            }   
          }      
          rad++;    
        }
      }
      //get query for server request
    getHexCells(){
      let arr = document.getElementsByClassName('hexagon');
      let cellArray = [];
      let dataValue;      
      for(let i =0; i<arr.length;i++){
        let xs = parseInt(arr[i].getAttribute('data-x'));
        let ys= parseInt(arr[i].getAttribute('data-y'));
        let zs = parseInt(arr[i].getAttribute('data-z'));
        if(arr[i].getAttribute('data-value')){
          dataValue = parseInt(arr[i].getAttribute('data-value'));
        } else {
          dataValue = 0;
        }

        if(dataValue !== 0){
          let cell = { x:xs, y:ys, z:zs, value:dataValue };
          cellArray.push(cell);
        }
        
      }
      return cellArray;
    }
    //shift and combine, request cells from server
    fullMove(direction){
      let array1 = this.getArrayString(this.getHexCells());
      for(let i = 0; i<this.radius; i++){        
        this.moveHex(direction, "shift");
      }
      this.moveHex(direction, "combine");
      this.moveHex(direction, "shift");
      let array2 = this.getArrayString(this.getHexCells());
      if(array1 !== array2){
        this.removeAnimation();
        this.fetchR(this.getHexCells());       
      } else {
        this.checkGameOver();       
      }
      this.addColor();     
    }

    checkGameOver(){
      let arr3 = ["top", "topR", "topL","bot", "botR", "botL"];
      let arr = document.getElementsByClassName("hexagon");
        let arr2=[];
        let canMove = false;
      for(let d = 0; d<arr3.length;d++){
        let opt = arr3[d];
        let rad = -this.radius+1;
        let num = 0;

        for(let c =0; c<this.hexConfig.length; c++){
          for(let i =0; i<arr.length;i++){
            let x = arr[i].getAttribute('data-x');
            let y = arr[i].getAttribute('data-y');
            let z = arr[i].getAttribute('data-z');
            let id = arr[i].getAttribute('id');
            if((opt === "top") && (x == rad) && canMove == false){
              arr2.push(id);       
              if(arr2.length === this.hexConfig[num]){  
                if(this.combine(arr2, num, "top", false)){
                  canMove = true;
                } 
                if(this.setAtr(arr2, num, "top", false)){
                  canMove = true;
                }
                num++;
                arr2=[];
              }              
            }
            if((opt === "topR") && (y == -rad) && canMove == false){
              arr2.push(id);       
              if(arr2.length === this.hexConfig[num]){
                if(this.combine(arr2, num, "top", false)){
                  canMove = true;
                }
                if(this.setAtr(arr2, num, "top", false)){
                  canMove = true;
                }
                num++;
                arr2=[];
              }
            }
            if((opt === "topL") && (z == rad) && canMove == false){
              arr2.push(id);       
              if(arr2.length === this.hexConfig[num]){
                if(this.combine(arr2, num, "top", false)){
                  canMove = true;
                }
                if(this.setAtr(arr2, num, "top", false)){
                  canMove = true;
                }
                num++;
                arr2=[];
              }
            }
            if((opt === "bot") && (x == -rad) && canMove == false){
              arr2.push(id);       
              if(arr2.length === this.hexConfig[num]){
                if(this.combine(arr2, num, "bot", false)){
                  canMove = true;
                } 
                if(this.setAtr(arr2, num, "bot", false)){
                  canMove = true;
                } 
                num++;
                arr2=[];
              }
            }
            if((opt === "botR") && (z == -rad) && canMove == false){
              arr2.push(id);       
              if(arr2.length === this.hexConfig[num]){
                if(this.combine(arr2, num, "bot", false)){
                  canMove = true;
                } 
                if(this.setAtr(arr2, num, "bot", false)){
                  canMove = true;
                } 
                num++;
                arr2=[];
              }
            }
            if((opt === "botL") && (y == rad) && canMove == false){
              arr2.push(id);       
              if(arr2.length === this.hexConfig[num]){
                if(this.combine(arr2, num, "bot", false)){
                  canMove = true;
                } 
                if(this.setAtr(arr2, num, "bot", false)){
                  canMove = true;
                } 
                num++;
                arr2=[];
              }
            }   
          }      
          rad++;    
        }
      }
      if(!canMove){
        document.getElementById('data-status').innerHTML = "Game-over";
        document.getElementById('data-status').setAttribute('data-status', 'game-over');
      }
      return canMove;
    }
    //remove appear animation
    removeAnimation() {
      let divArr = document.getElementsByClassName('hexagon');
      for(let i = 0; i<divArr.length;i++){
        divArr[i].classList.remove('appear');
      }
    }
    //adds color based on data-value
    addColor(){
      let divArr = document.getElementsByClassName('hexagon');
      for(let i = 0; i<divArr.length;i++){
        let dataValue = divArr[i].getAttribute('data-value');
        if(dataValue == 0){
          divArr[i].style.background = 'rgb(0,250,255)';
        }
        if(dataValue === '2'){
          divArr[i].style.background = 'rgb(0,220,255)';
        }
        if(dataValue === '4'){
          divArr[i].style.background = 'rgb(0,184,255)';
        }
        if(dataValue === '8'){
          divArr[i].style.background = 'rgb(0,154,255)';
        }
        if(dataValue === '16'){
          divArr[i].style.background = 'rgb(0,30,255)';
        }
        if(dataValue === '32'){
          divArr[i].style.background = 'rgb(0,5,255)';
        }
        if(dataValue === '64'){
          divArr[i].style.background = 'rgb(189,0,255)';
        }
        if(dataValue === '128'){
          divArr[i].style.background = 'rgb(214,0,255)';
        }
        if(parseInt(dataValue) > 128){
          divArr[i].style.background = 'rgb(170,0,255)';

        }
      }
    }
    //fetch random cells from server
    fetchR(hexCells) {
      let divArr = document.getElementsByClassName('hexagon');
      let url = 'https://'+this.hostname+'/'+this.radius+'';
      const response = fetch(url, {
        method: 'POST',
        body: JSON.stringify(hexCells),
      }).then((response) => response.json())
        .then((hex) => {
          for(let i = 0; i<hex.length;i++){
            let x = hex[i].x;
            let y = hex[i].y;
            let z = hex[i].z;
            let value = hex[i].value;
                
          for(let i = 0; i<divArr.length;i++){
            if(x == divArr[i].getAttribute('data-x') && y == divArr[i].getAttribute('data-y')
            && z == divArr[i].getAttribute('data-z')){
              divArr[i].classList.add('appear');
              divArr[i].setAttribute('data-value', value);
              if(value == 2){
                  divArr[i].style.backgroundColor = "rgb(0,220,255)";
              } else {
                  divArr[i].style.backgroundColor = 'rgb(0,184,255)';
              }
            }
          }
          this.checkGameOver();
        }         
    });        
  }
}