function subsequence(array,sequence){
  let foundCounter = 0;
  for (var i = 0; i < array.length; i++) {
    if(array[i] === sequence[foundCounter]){
      foundCounter++;
    }
  }
  return foundCounter === sequence.length;
}


let res = subsequence([5,1,22,25,6,-1,8,10],[1,6,-1,10]);
console.log("res",res)
