
N = 50 //number of states to process
var adjMatrix = [];
//initializing empty array of lists
for(i=0; i < N; i++)
    adjMatrix.push([]);
    
//boring af
adjMatrix[0].push(1, 4);
adjMatrix[1].push(0, 3, 4);
adjMatrix[2].push(1, 3, 6);
adjMatrix[3].push(1, 2, 4, 5, 6);
adjMatrix[4].push(0, 1, 3, 5, 7, 8);
adjMatrix[5].push(3, 4, 6, 8, 9);
adjMatrix[6].push(2, 3, 5, 9, 10);
adjMatrix[7].push(4, 8, 11, 12);
adjMatrix[8].push(4, 5, 7, 9, 12, 13);
adjMatrix[9].push(5, 6, 8, 10, 13, 14, 15);
adjMatrix[10].push(6, 10, 15, 16);
adjMatrix[11].push(7, 12, 17);
adjMatrix[12].push(7, 8, 11, 13,17,18);
adjMatrix[13].push(8,9,12,14,18,19);
adjMatrix[14].push(9,13,15,19);
adjMatrix[15].push(9,10,14,16,19,20);
adjMatrix[16].push(10,15,20,21);
adjMatrix[17].push(11,12,18,22);
adjMatrix[18].push(12,13,17,19,22,23);
adjMatrix[19].push(13,14,15,18,20,23,28,24);
adjMatrix[20].push(15,19,21,24,25);
adjMatrix[21].push(16,20,25);
adjMatrix[22].push(17,18,23);
adjMatrix[23].push(18,19,22,27,28);
adjMatrix[24].push(19,20,25,28,29,32,33,35);
adjMatrix[25].push(20,21,24,29);
adjMatrix[26].push(27,30);
adjMatrix[27].push(23,26,28,30);
adjMatrix[28].push(19,23,24,27,30,31,32);
adjMatrix[29].push(24,25,35,36);
adjMatrix[30].push(26,27,28,31,40);
adjMatrix[31].push(28,30,40,37,32);
adjMatrix[32].push(24,28,31,33,37);
adjMatrix[33].push(24,32,34,35);
adjMatrix[34].push(33,35);
adjMatrix[35].push(24,29,33,34,36);
adjMatrix[36].push(29,35);
adjMatrix[37].push(31,32,38,40);
adjMatrix[38].push(37,39,40);
adjMatrix[39].push(38,40,41);
adjMatrix[40].push(30,31,37,38,39,41);
adjMatrix[41].push(39,40,42,44,47);
adjMatrix[42].push(41,43,44);
adjMatrix[43].push(42,44);
adjMatrix[44].push(41,42,43,46,47);
adjMatrix[45].push(46);
adjMatrix[46].push(44,47,45);
adjMatrix[47].push(41,46,44);
//48 and 49 have no neighbors (Hawaii and Alaska)
//maps name to abbreviation
var abbrMap = {};
abbrMap["Alabama"] = "AL";
abbrMap["Alaska"] = "AK";
abbrMap["Arizona"] = "AZ";
abbrMap["Arkansas"] = "AR";
abbrMap["California"] = "CA";
abbrMap["Colorado"] = "CO";
abbrMap["Connecticut"] = "CT";
abbrMap["Delaware"] = "DE";
abbrMap["Florida"] = "FL";
abbrMap["Georgia"] = "GA";
abbrMap["Hawaii"] = "HI";
abbrMap["Idaho"] = "ID";
abbrMap["Illinois"] = "IL";
abbrMap["Indiana"] = "IN";
abbrMap["Iowa"] = "IA";
abbrMap["Kansas"] = "KS";
abbrMap["Kentucky"] = "KY";
abbrMap["Louisiana"] = "LA";
abbrMap["Maine"] = "ME";
abbrMap["Maryland"] = "MD";
abbrMap["Massachusetts"] = "MA";
abbrMap["Michigan"] = "MI";
abbrMap["Minnesota"] = "MN";
abbrMap["Mississippi"] = "MS";
abbrMap["Missouri"] = "MO";
abbrMap["Montana"] = "MT";
abbrMap["Nebraska"] = "NE";
abbrMap["Nevada"] = "NV";
abbrMap["New Hampshire"] = "NH";
abbrMap["New Jersey"] = "NJ";
abbrMap["New Mexico"] = "NM";
abbrMap["New York"] = "NY";
abbrMap["North Carolina"] = "NC";
abbrMap["North Dakota"] = "ND";
abbrMap["Ohio"] = "OH";
abbrMap["Oklahoma"] = "OK";
abbrMap["Oregon"] = "OR";
abbrMap["Pennsylvania"] = "PA";
abbrMap["Rhode Island"] = "RI";
abbrMap["South Carolina"] = "SC";
abbrMap["South Dakota"] = "SD";
abbrMap["Tennessee"] = "TN";
abbrMap["Texas"] = "TX";
abbrMap["Utah"] = "UT";
abbrMap["Vermont"] = "VT";
abbrMap["Virginia"] = "VA";
abbrMap["Washington"] = "WA";
abbrMap["West Virginia"] = "WV";
abbrMap["Wisconsin"] = "WI";
abbrMap["Wyoming"] = "WY";
//third map keys the abbrv and values to the assigned number
var numDict = {};
numDict["WA"] = 0;
numDict["OR"] = 1;
numDict["CA"] = 2;
numDict["NV"] = 3;
numDict["ID"] = 4;
numDict["UT"] = 5;
numDict["AZ"] = 6;
numDict["MT"] = 7;
numDict["WY"] = 8;
numDict["CO"] = 9;
numDict["NM"] = 10;
numDict["ND"] = 11;
numDict["SD"] = 12;
numDict["NE"] = 13;
numDict["KS"] = 14;
numDict["OK"] = 15;
numDict["TX"] = 16;
numDict["MN"] = 17;
numDict["IA"] = 18;
numDict["MO"] = 19;
numDict["AR"] = 20;
numDict["LA"] = 21;
numDict["WI"] = 22;
numDict["IL"] = 23;
numDict["TN"] = 24;
numDict["MS"] = 25;
numDict["MI"] = 26;
numDict["IN"] = 27;
numDict["KY"] = 28;
numDict["AL"] = 29;
numDict["OH"] = 30;
numDict["WV"] = 31;
numDict["VA"] = 32;
numDict["NC"] = 33;
numDict["SC"] = 34;
numDict["GA"] = 35;
numDict["FL"] = 36;
numDict["MD"] = 37;
numDict["DE"] = 38;
numDict["NJ"] = 39;
numDict["PA"] = 40;
numDict["NY"] = 41;
numDict["CT"] = 42;
numDict["RI"] = 43;
numDict["MA"] = 44;
numDict["ME"] = 45;
numDict["NH"] = 46;
numDict["VT"] = 47;
numDict["HI"] = 48;
numDict["AK"] = 49;
//for processing 
numDict2 = [];
numDict2[0] = "WA";
numDict2[1] = "OR";
numDict2[2] = "CA";
numDict2[3] = "NV";
numDict2[4] = "ID";
numDict2[5] = "UT";
numDict2[6] = "AZ";
numDict2[7] = "MT";
numDict2[8] = "WY";
numDict2[9] = "CO";
numDict2[10] = "NM";
numDict2[11] = "ND";
numDict2[12] = "SD";
numDict2[13] = "NE";
numDict2[14] = "KS";
numDict2[15] = "OK";
numDict2[16] = "TX";
numDict2[17] = "MN";
numDict2[18] = "IA";
numDict2[19] = "MO";
numDict2[20] = "AR";
numDict2[21] = "LA";
numDict2[22] = "WI";
numDict2[23] = "IL";
numDict2[24] = "TN";
numDict2[25] = "MS";
numDict2[26] = "MI";
numDict2[27] = "IN";
numDict2[28] = "KY";
numDict2[29] = "AL";
numDict2[30] = "OH";
numDict2[31] = "WV";
numDict2[32] = "VA";
numDict2[33] = "NC";
numDict2[34] = "SC";
numDict2[35] = "GA";
numDict2[36] = "FL";
numDict2[37] = "MD";
numDict2[38] = "DE";
numDict2[39] = "NJ";
numDict2[40] = "PA";
numDict2[41] = "NY";
numDict2[42] = "CT";
numDict2[43] = "RI";
numDict2[44] = "MA";
numDict2[45] = "ME";
numDict2[46] = "NH";
numDict2[47] = "VT";
numDict2[48] = "HI";
numDict2[49] = "AK";
//tests the created data structures
//console.log("Testing the map structure");
//console.log(adjMatrix[34]);
//tests the getStateBorders function
console.log("Border States of VA");
console.log(getStateBorders("VA"));
function getStateBorders(s1)
{
    if(s1.length > 2)
    {
        var value = abbrMap[s1];
        s1 = value;
    }
    var numberkey = numDict[s1];
    var solList = [];
    for(var i=0; i < adjMatrix[numberkey].length; i++)
    {
        var val = adjMatrix[numberkey][i];
        //console.log(val);
        var nState = numDict2[val];
        solList.push(nState);
    }
    return solList;
}
//tests the doStatesBorder function
console.log("Does MD border VA");
console.log(doStatesBorder("VA","MD"));
console.log("-------------");
console.log("Does CA border VA");
console.log(doStatesBorder("California", "VA"));
function doStatesBorder(s1, s2)
{
    if(s1.length > 2)
    {
        var val = abbrMap[s1];
        s1 = val;
    }
    if(s2.length > 2)
    {
        var val = abbrMap[s2];
        s2 = val;
    }
    var checklist = getStateBorders(s1);
    for(var i=0; i < checklist.length; i++)
    {
        var tmp = checklist[i];
        if(tmp == s2) //both abbrv 
            return true;
    }
    return false;
}

/*
console.log('-------------');
// ************************
// ARRAY MAP - create a new array by calling function on each element
//  map is a fast way to change data. Use this method instead of forEach 
//  when you want to produce output.

// create some array
var someJSArray = [101, 102, 103, 104, 105];

// this mapping function will multiply each element by 3
var map1 = someJSArray.map( function(elem) {
  return elem*3;
});

console.log(map1)
console.log('-------------')

// REFERENCE:
//  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
//  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach


// ************************
// ARRAY REDUCE - iterate over an array, but with the selective ability
//  to add it to the output array (or object).
//  Use this method when you want to do a reduce with greater output control.

// create some array
var someJSArray = [101, 102, 103, 104, 105];

// this mapping function will:
//  - multiply each element by 3, and 
//  - add it to output array  
var red = someJSArray.reduce( function(out_val, curr) {

  console.log('current output state: '+out_val);
  										// log the value of the output
  thisVal = curr * 3;					// multiply the current element by 3;

  if (curr !==103 ) {					// if the current value is not 103
  	out_val.push(thisVal);				//   append our value to the output
  }
  
  return out_val;						// IMPORTANT!!! YOU *MUST* 
  										//  RETURN THE CURRENT OUTPUT STATE
  										//  IN EACH STEP OF reduce

}, [] );								// Initialize the output.

console.log(red)
console.log('-------------')

// REFERENCE:
//  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
*/