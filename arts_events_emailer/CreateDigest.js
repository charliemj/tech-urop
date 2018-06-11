//Begin based off of this tutorial: https://developers.google.com/apps-script/articles/sending_emails
 var spreadsheet = SpreadsheetApp.openByUrl("@@events_sheet_url");

function isNA(str){
  str = str.toString();
  var thing = (str == "") || (str == "N/A") || (str == "NA") || (str == "n/a") || (str == "na") || (str == "@@"); 
  return thing;
}

function sendDigest() {
  var sheet = spreadsheet.getSheetByName("Events");
  var rangeSpace = "A2:F";
  var dataRange = sheet.getRange(rangeSpace);
  // Fetch values for each row in the Range.
  var data = dataRange.getValues();
  var message = "";
  
  //Colnum Names
  var dueDate = 0,
      date = 1,
      type = 2,
      name = 3,
      venue = 4,
      claimerEmail = 5;
  
  data.sort(
    function(row1,row2){
      if(row1[type]>row2[type]) return 1;
      if(row1[type]<row2[type]) return -1;
      return 0;
    }
  );
  
  for (i in data) {
    var row = data[i];
    var bool = isNA(row[claimerEmail]) && row[name] != "";
    
    if(bool){ //Is it claimed? If yes, skip
      
      Logger.log("THING!!! " + row[dueDate] + " " + row[date] + " " + row[type] + " " + row[name] + " " + row[venue] + " " + row[claimerEmail]);
      
      message += "\n" + row[type] + ": " + row[name]; //Type: Event
      
      message += "\n- "; // new line
      
      var startDay = Utilities.formatDate(new Date(row[date]), "GMT-04", "E M/d hh:mm a");
      
      message += "On " + startDay; //On date
      
      message += " at " + row[venue]; // at venue

      message += "\n";
      message += row[claimerEmail];
    }
  }
  var body = (message == "") ? "Nothing this week!" : message;
  var subject = "Arts Department Digest";
  var email = "torridon@live.com";
  Logger.log(body);
  MailApp.sendEmail(email, subject, body);
}
