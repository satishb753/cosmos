// let Person = {

//   name: '',

//   age: '',

//   setName: (name) => {
//     this.name = name;
//   },

//   setAge: function (age) {
//     this.age = age;
//   },

// };

// Person.setName('John');

// Person.setAge(12);
// console.log('Name ', Person.name); //John

// console.log('Age ', Person.age); // 20

const arr = [4, 5, "t", "y", "r", "6", 9, "g", "5"];

let intArr = arr.filter((el) => {
  if (typeof el === "number") {
    console.log(el);
    return el;
  }
});

let stringArr = arr.filter((el) => {
  if (typeof el === "string") {
    return el;
  }
});

intArr = intArr.sort((a, b) => a - b);
stringArr = stringArr.sort((a, b) => a.charCodeAt() - b.charCodeAt());

let resultArr = intArr.concat(stringArr)

console.log(resultArr);
