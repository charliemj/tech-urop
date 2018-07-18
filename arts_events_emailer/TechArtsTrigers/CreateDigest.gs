var spreadsheet = SpreadsheetApp.openById("@@SheetID");
var form        = FormApp.openById("@@FormID");
var eventForm   = FormApp.openById("@@EventFormID");

//Colnum Names
var indeces = {
  "Issue (Article Due Date)": 0,
  "Date of Event": 1,
  "Time of Event": 2,
  "Type": 3,
  "Event Name": 4,
  "Venue": 5,
}
var dueDate = indeces["Issue (Article Due Date)"],
    date = indeces["Date of Event"],
    time = indeces["Time of Event"],
    type = indeces["Type"],
    name = indeces["Event Name"],
    venue = indeces["Venue"];

function isNA(str){
  str = str.toString();
  var thing = (str == "") || (str == "N/A") || (str == "NA") || (str == "n/a") || (str == "na") || (str == "@@") || (str == "#N/A"); 
  return thing;
}

function processForm(){
  var sheet = spreadsheet.getSheetByName("Events");
  var rangeSpace = "A2:F";
  var dataRange = sheet.getRange(rangeSpace);
  var eventItems = eventForm.getItems();
  
  var required = getRequired(eventItems);
  var data = processDataRange(dataRange, required);
  
  Logger.log(data);
  updateForm(data);
  
  return data;
}

function updateFormAndSendDigest(){
  var data = processForm();
  sendDigest(data);
}

function getRequired(items){
  var required = items.filter(function(item){
    var unbox;
    switch(item.getType()){
      case FormApp.ItemType.DATE :
        unbox = item.asDateItem();
        break;
      case FormApp.ItemType.TIME :
        unbox = item.asTimeItem();
        break;
      case FormApp.ItemType.TEXT :
        unbox = item.asTextItem();
        break;
      case FormApp.ItemType.MULTIPLE_CHOICE :
        unbox = item.asMultipleChoiceItem();
        break;
      default :
        return false;
    }
    return unbox.isRequired();
  });
  var index = required.map(function(item){
    return indeces[item.getTitle()];
  });
  return index;
}

function processDataRange(dataRange,required){
  // Fetch values for each row in the Range.
  var data = dataRange.getValues();
  
  // Filter out empty lines
  data = data.filter(
    function (row){
      var anyNA = required.reduce(function(acc,ind){
        return acc || isNA(row[ind]);
      }, false);
      if(!anyNA){
        var read = required.reduce(function(acc,ind){
          return acc + " " + row[ind];
        }, "");
        Logger.log("THING!!! " + read);
        return true;
      }
      return false;
    }
  );
  
  return data;
}

//updateForm
function updateForm(data) {
  Logger.log("Starting Form Update");
  
  if(data.length == 0){//In the event of no events...
    //Get multichoice items from form
    var multichoices = form.getItems(FormApp.ItemType.MULTIPLE_CHOICE);
    var multichoice  = multichoices[0];
  
    multichoice = multichoice.asMultipleChoiceItem();
    
    //Set choices to null message
    multichoice = multichoice.setChoices(["Nothing for now, check back soon!"]);
    
    Logger.log("Nothing to put in Form! Outputting empty form.");
    
    return "Nothing to put in!";
  }
  
  //Get event names
  var events = data.map(
    function (row){
      return row[name];
    }
  );
  
  //Get multichoice items from form
  var multichoices = form.getItems(FormApp.ItemType.MULTIPLE_CHOICE);
  var multichoice  = multichoices[0];
  
  multichoice = multichoice.asMultipleChoiceItem();
  
  multichoice = multichoice.setChoices(//Set choices to...
    events.map(
      function (event){
        return multichoice.createChoice(event);//the names of events.
      }
    )
  );
  
  Logger.log("Finished Form Update");
}

//Generate and Send digest
function sendDigest(data) {
  
  var message = makeMessage(data);
  
  var body = "Hello, Artsy Technicians!\n\n The unclaimed events as of today are: \n\n"; 
  body += (message == "") ? "Nothing! But be sure to check back next time!" : message;
  body += "\n \n Claim Events @@ClaimFormLink (updates hourly) \n Events have a 24 hour grace period after being posted, after which it becomes first come first serve. \n";
  
  var today = new Date();
  var todayS = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()
  var subject = "Arts Department Digest " + todayS;
  var to = "@@PrimaryEmail";
  var bcc = "@@AdditionalEmails";
  
  Logger.log(body);
  
  MailApp.sendEmail({
    to: to,
    bcc: bcc,
    subject: subject,
    body: body
  });
  
  //MailApp.sendEmail(email, subject, body);
}

function makeMessage(data){
  
  if(data.length == 0){//In the event of no events, do nothing.
    return "";
  }
  
  // Sort by type
  data.sort(
    function(row1,row2){
      if(row1[type]>row2[type]) return 1;
      if(row1[type]<row2[type]) return -1;
      return 0;
    }
  );
  
  Logger.log("Starting Message\n");
  
  var message = "";
  for (i in data) {
    var row = data[i];
    
    message += "\n"; 
    message += (isNA(row[type])) ? "" : row[type] + ": ";
    message += (isNA(row[name])) ? "" : row[name]; //Type: Event
    message += "\n- "; // new line
     
    var startDay = Utilities.formatDate(new Date(row[date]), "GMT-05", "E M/d");
    var startTime = Utilities.formatDate(new Date(row[time]), "GMT-05", "hh:mm a");  
    
    message += (isNA(row[date])) ? "" : "On " + startDay; //On date
    message += (isNA(row[time])) ? "" : ", " + startTime; //, time
    message += (isNA(row[venue])) ? "" : " at " + row[venue]; // at venue
    message += "\n";
  }
  
  Logger.log("Done Message!");
  
  return message;
}
