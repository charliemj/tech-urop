var claimerForm = FormApp.openById("@@FormID");
var theSheet    = SpreadsheetApp.openById("@@SheetID");

function isNA(str){
  str = str.toString();
  var thing = (str == "") || (str == "N/A") || (str == "NA") || (str == "n/a") || (str == "na") || (str == "@@") || (str == "#N/A"); 
  return thing;
}

var dueDate  = 0,
    date     = 1,
    type     = 2,
    name     = 3,
    venue    = 4,
    claimers = 5;

function onSubmit(){
  var prevData = getFromSheet("ChosenClaimer","A2:B");
  
  var listoflists = claimerForm.getResponses().map(function(thing){//get list of itemresponses from formresponses
    return thing.getItemResponses();
  }).filter(function(thing){//get rid of empty responses
    return thing != [];
  });
  Logger.log(listoflists);
  var unpackedLoL = listoflists.reduce(function(acc, list){//unpack the list of lists into list of itemresponses
    return acc.concat(list);
  });
  Logger.log(unpackedLoL);
  var raw = unpackedLoL.map(function(response){//process into important data
    var title = response.getItem().getTitle();
    var claimer = response.getResponse() 
    return [title,claimer];
  });
  var responses = raw.reduce(function(acc, thing){//remove duplicates
    var isThingInAcc = acc.reduce(function(ac2, th2){
      return ac2 || (th2[0] == thing[0]);
    });
    if(isThingInAcc){
      return acc;
    } else {
      return acc.push(thing);
    }
  });
  
  var data = responses.filter(function(thing){//remove anything that already has a response
    var isThingInPrev = prevData.reduce(function(acc, the){
      return acc || (the[0] == thing[0]);
    }, false);
    return !isThingInPrev;
  });
  
  claimerForm.deleteAllResponses(); //purge to prevent future errors
  
  placeDataCorrectly(data);
  updateOptions();
}

function updateOptions(){
  purgeOptions();
  var data = getFromSheet("ClaimsSheet","G2:L");
  setOptions(data);
  Logger.log("DONE");
}

function purgeOptions(){
  var len = claimerForm.getItems().length;
  if(len >= 1){
    Logger.log("Purging Claimers");
    for(var i=0; i<len; i++){
      claimerForm.deleteItem(i);
    }
  }
}

function getFromSheet(sheetName,rangeA1) {
  Logger.log("Getting Claimers");
  
  var claims = theSheet.getSheetByName(sheetName);
  var range  = claims.getRange(rangeA1);
  var data   = range.getValues();
  
  // Filter out empty lines
  data = data.filter(
    function (row){
      if(row.reduce(function (acc, thing){return acc || (!isNA(thing))})){
        return true;
      }
      return false;
    }
  );
  
  return data;
}

function setOptions(data){
  Logger.log("Setting Options");
  
  data.forEach(function(row){
    if(!isNA(row[claimers])){
      var item = claimerForm.addMultipleChoiceItem()
      //item.setTitle(row[name] + "(" + row[date] + ")");
      item.setTitle(row[name]);
      
      var claims = row[claimers].split('|');
      item.setChoiceValues(claims);
    }
  });
}

function placeDataCorrectly(data){
  Logger.log(data);
  var sheet = theSheet.getSheetByName("ChosenClaimer");
  //data.forEach(function(thing){
    sheet.appendRow(data); // puts data on the sheet i.e. title->A5,response->B5 
  //});
  Logger.log("Added to sheet");
}
