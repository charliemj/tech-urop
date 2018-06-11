var spreadsheet = SpreadsheetApp.openById("@@events_sheet");
var sheets = [spreadsheet.getSheetByName("AutoEvents"), spreadsheet.getSheetByName("Events"), spreadsheet.getSheetByName("UncliamedAutoEvents")];

function removeAllOutdated(){
  removeOutdated(sheets[0].getRange("B2:H"),4);
  removeOutdated(sheets[1].getRange("A2:F"),3);
  removeOutdated(sheets[2].getRange("B2:F"),2);
}

function removeOutdated(sheet,namePos) {
  var data = sheet.getValues();
  var today = new Date();
  data = data.filter(function(list){
    return list[0] != "";
  });
  var killed = [];
  var twoWeeks = (new Date("1/15/18")).getTime() - (new Date("1/1/18")).getTime();
  for (row in data) {
    var due = new Date(data[row][0]);
    //Logger.log(due.getTime() < (today.getTime() - twoWeeks));
    if ( today.getTime() > (due.getTime() + twoWeeks) ) {
      var place = 2 + Number(row);
      killed = killed + ["\n" + row[namePos]];
      Logger.log("BOOP: " + place);
      sheet.deleteRow(place);
    }
  }
  var lateEvents = killed.join();
  if(killed != ""){
    MailApp.sendEmail("arts@tt.mit.edu", "Events Removed: " + today , lateEvents);
  }
  Logger.log("DONE");
}
