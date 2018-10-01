module.exports = function solveSudoku(matrix) {

  let container;

    const initContainer = ()=>{
      for(i =0; i < 9; i++){
        container.rows[i] = [];
        container.colls[i] = [];
        container.blocks[i] = [];
      }
    };

    const getSingleValue = (cell) => {
      //let cell = container.rows[row][col];
      if(cell.possibleValues.length === 1){
        return cell.possibleValues.pop();
      }
      return null;
    };

    const setSingleValue = (value,cell) => {
      let setValues = cell.possibleValues;
      if(value !== null){
        cell.value = value;
        cell.possibleValues= setValues.splice(setValues.indexOf(value),1);
        matrix[cell.i][cell.j] = value;
        let currentBlock = cell.i - cell.i % 3  + (cell.j - cell.j % 3) / 3;
        removeDependencies(value,container.rows[cell.i]);
        removeDependencies(value,container.colls[cell.j]);
        removeDependencies(value,container.blocks[currentBlock]);
      }else{
        console.log("Error: value = null");
      }
    };

    const initPossibleValues = (row,col) => {
      let currCell = container.rows[row][col];

      const isInRowOrCol = (row, col, _number) =>{
        let res = false;
        for(i = 0; i < 9; i++){
          if(matrix[row][i] == _number || matrix[i][col] == _number){
            res = true; break;
           }
        }
         return res;
      };
  
      const isInBlock = (row,col, _number) => {
       let res = false;
        currentBlock = row - row % 3  + (col - col % 3) / 3;
        let cells= container.blocks[currentBlock];
        cells.forEach(cell => {
          
          if(cell.value === _number){
            res = true;
          }
        });

        return res;
      };

      for(let i=1; i < 10; i++){
        if(!isInRowOrCol(row,col,i) && !isInBlock(row,col,i)){
          if(row ==0){
           // console.log(`i=${i}\n`);
          }
          
          currCell.possibleValues.push(i);
        }
      }
      //console.log(`=========\n`);
    };

    const removeDependencies =(value,arr) => {
      let index;
      arr.forEach(_cell => {
        index  = _cell.possibleValues.indexOf(value);
        while(index !== -1){
          _cell.possibleValues.splice(index,1);
          index = _cell.possibleValues.indexOf(value);
        }
      });
    };

    const updateUniqValues = () => {
     let res;
      const findUniqValues = (array) => {
        res = false;
        let possibleValuesStr = getPossibleVales(array);
       // console.log(`possibleValuesStr=${possibleValuesStr}'\n====================\n'`);
        array.forEach(cell => {
          cell.possibleValues.forEach(val => {
            if(possibleValuesStr.split(val.toString()).length === 2){
              setSingleValue(val,cell);
              res =true;
            }
          });
        });
        return res;
      };

      const getPossibleVales = array => {
        let strr = array.reduce((str, cell)=>{
          //console.log(cell.possibleValues);
            return str += cell.possibleValues.join('')+'-';
        },''); 
        //console.log(strr);
        return strr;
      };
      let count =0;
      for(i=0; i< 9; i++){
        while(findUniqValues(container.rows[i])){
         count ++;
        }
      }
      for(i=0; i< 9; i++){
        while(findUniqValues(container.colls[i])){
         // i--;
        }
      }
      for(i=0; i< 9; i++){
        while(findUniqValues(container.blocks[i])){
         // i--;
        }
      }
      return res;
    };

    const initCells = () =>{
      container = {"rows":[],"colls":[],"blocks":[]};
      initContainer();
      let currentBlock = 0;
      matrix.forEach((row,i) => {
        row.forEach((value,j) => {
          let _cell = {possibleValues : []};
          _cell.value = value;
          _cell.i = i;
          _cell.j = j;
          currentBlock = i - i % 3  + (j - j % 3) / 3;
          container["rows"][i].push(_cell);
          container["colls"][j].push(_cell);
          container["blocks"][currentBlock].push(_cell);
        });
      });
    };

    const isFull = () =>{
      let result = true;
      outer: for(let len = matrix.length,j,i =0; i<len; i++){
        for(j=0; j < 9; j++){
          if(matrix[i][j] === 0){
            result = false;
            break outer;
          }
        }
      }
      return result;
    };

    const getSolution =()=>{
      let value,count = 0;
      for(let i=0, j; i < 9; i++){
        for(j = 0; j<9; j++){
          //console.log(matrix[i][j]);
          if(matrix[i][j] === 0){
            initPossibleValues(i,j);
            value = getSingleValue(container.rows[i][j]);
            if(value != null){
              setSingleValue(value,container.rows[i][j]);
              //update possible values

            }
            
          }
        }
      }
      if(updateUniqValues()){ 
        init(); 
        console.log(++count);
      }else{
        //найти ячейку с минимальным количеством значений в контейнере возможных значений
       initAssumptions();
       console.log("not found");
      }
    };
    const initAssumptions = () =>{
      
    }
    const init = () =>{
      if(!isFull()){
        getSolution();
      }
    };
    console.log(matrix);
    initCells();
    init();
    console.log(matrix);
  
    return matrix;
}
