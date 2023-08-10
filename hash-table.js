const sha256 = require('js-sha256');

//convert a binary number to base 10 
function binToBase10(binaryNum) {
  let exp = 0;
  vals = [];
  for (let i = binaryNum.length - 1; i >= 0; i--) {
    vals.push(binaryNum[i] * Math.pow(2, exp));
    exp++;
  }
  return sumArr(vals);
}

//sum all values of an array 
//helper function for binToBase10
function sumArr(arr) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  return sum;
}

//convert hex to  binary 
function hexToBinary(hex) {
  let hexToBinDict = {
    '0': '0000',
    '1': '0001',
    '2': '0010',
    '3': '0011',
    '4': '0100',
    '5': '0101',
    '6': '0110',
    '7': '0111',
    '8': '1000',
    '9': '1001',
    'A': '1010',
    'B': '1011',
    'C': '1100',
    'D': '1101',
    'E': '1110',
    'F': '1111',
    'a': '1010',
    'b': '1011',
    'c': '1100',
    'd': '1101',
    'e': '1110',
    'f': '1111'
  };
  let binary = '';
  for (let i = hex.length - 1; i >= 0; i--) {
    let bits = hexToBinDict[hex[i]];
    binary = hexToBinDict[hex[i]] + binary;
  }
  return binary;
}

//Class for KeyValuePair to be used with HashTable Class
class KeyValuePair {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.next = null;
  }
}

class HashTable {
  //initialize:
  //data: an array of length numBuckets with null values
  //count: number of values stored in data 
  //capacity: length of data array 
  constructor(numBuckets = 4) {
    this.data = new Array(numBuckets);
    for(let i = 0; i < numBuckets; i++){
      this.data[i] = null;
    }
    this.count = 0; 
    this.capacity = numBuckets;
  }

  //Convert a key using sha256 hash function
  //Use the first 8 digits of sha256 hash 
  //Convert from hex to base10 integer
  //Return integer 
  hash(key) {
    let sha8 = sha256(key).slice(0,8);
    let bin = hexToBinary(sha8);
    return binToBase10(bin);

  }

  //Hash the key then mod by the number of buckets to find the
  //appropriate index of the array to store the key value pair
  hashMod(key) {
    let num = this.hash(key);
    return num % this.capacity;
  }

  //Insert a new key value pair where if there is a collision, throw an error
  insertNoCollisions(key, value) {
    let hashed = this.hashMod(key);

    //if data already exists at the hashed index, throw an error
    if(this.data[hashed]){
      throw new Error('hash collision or same key/value pair already exists!');
    }

    //bucket is available, insert key value pair 
    this.data[hashed] = new KeyValuePair(key, value);

    //increment the count 
    this.count++;
  }

  //Insert a new key value pair where if there is a collision, handle with a linked list
  insertWithHashCollisions(key, value) {
    //hash key to find index
    let hashed = this.hashMod(key);

    //create key value pair to insert 
    let kv = new KeyValuePair(key, value);
    
    //if there is already data in the bucket, handle collision
    if(this.data[hashed]){
      kv.next = this.data[hashed];
      this.data[hashed] = kv;
      this.count++;

      //else no collision, insert data
      }else{
       this.insertNoCollisions(key, value);
      }
  }

  //returns true if key is found and updates value, returns false if key not found
  updateKey(key, value){
    let hashed = this.hashMod(key);
    let data = this.data[hashed];

    //if key is first entry 
    if(data.key === key){
      data.value = value;
      return true;
    
    //search linked list for key 
    }else{
      let curr = data.next;

      //while not at the end of the linked list 
      while (curr !== null){

        //if key is found, update value 
        if(curr.key === key){
          curr.value = value;
          return true;
        }

        //check next item in linked list 
        curr = curr.next;
      }

      //key not found, return false
      return false;
    }
  }

  insert(key, value) {
    let hashed = this.hashMod(key);

    //if the bucket is empty, inset key value pair
    if(!this.data[hashed]){
      this.insertNoCollisions(key, value);
    
    }else{
      //try to update value of key 
      let updated = this.updateKey(key, value);
      //if key not found, insert key value pair with collision
      if(!updated){
        this.insertWithHashCollisions(key, value);
      }
    }
  }
}


module.exports = HashTable;