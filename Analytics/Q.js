let arr = [1, 3, 5, 4, 2, 9, 8, 7, 6, 0, 10]

let pairs = []

// console.log(arr.sort( (a,b) => a-b));

const twoSum2 = (a) => {
  for(let i=0; i< a.length; i++){
    for(let j=i+1; j< a.length; j++){
      if(arr[i]+arr[j] === 8){
        pairs.push( {"first": arr[i], "second": arr[j]});
      }
    }
  }
}


const twoSum = (a) => {
  a = a.sort((a,b) => a-b);
  console.log(a)
  let leftItr = 0; 
  let rightItr = a.length;

  while( rightItr > leftItr && a[leftItr] < 8){
    console.log(rightItr, " ", leftItr);
    if (a[leftItr] + a[rightItr-1] > 8) {
      rightItr--;
      console.log("rightItr is: ", rightItr-1);
    }
    else if(a[leftItr] + a[rightItr-1] < 8){
      leftItr++;
    }
    else if(a[leftItr] + a[rightItr-1] === 8){
      pairs.push( {"first": a[leftItr], "second": a[rightItr-1]}  )
      console.log("leftItr is: ", leftItr);
    }
    leftItr++;
  }
}

// twoSum(arr);
twoSum2(arr);
// twoSum(arr);

console.log(pairs);