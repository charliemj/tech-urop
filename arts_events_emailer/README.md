# A Guided Tour of the Sheet
 
Right away you’ll note the tabs along the bottom (some of those are new!). These have changed a lot throughout the course of the year, so I’m going to describe each one’s function. Here goes:
 
## Arts Member List
This is an automated page that keeps track of who’s writing for us, how many articles they’ve written, and when they became staff in that semester. I’ve locked the automated sections to prevent anything being accidentally altered, but you can change the “Semester Start Cell” number to start at the relevant start date based on the Published Articles tab.
The status column is not automatically generated, so when someone is made staff properly, replace an automated row’s name column with their name and write “Staff” in the ‘Status’ column (the sheet will try to warn you about editing, ignore it).
## Published Articles
This is a page where, after an article is published, someone needs to input its data in the relevant columns. The Arts Member List depends on this being up to date in order to function.
## Events (New!)
This is a fully automated page that pulls from EventsSheet and ClaimsSheet to make a list of unclaimed events that are still relevant. Essentially, this is the live, raw form of the digest.
The only thing that you’ll ever want to change is the “Days Timely” and “Grace Period (Days)” cells. These are used to filter what is still relevant and technically unclaimed (any claims within the grace period are not counted and won’t remove the event from the list).
## Claimed Events (New!)
This is a fully automated page that pulls from EventsSheet and ClaimsSheet to make a list of relevant claimed events and who’s attempted to claim them. It pulls from “Days Timely” in Events to decide what is timely.
The ‘Claimer’ column pulls from the ChosenClaimer form/sheet to put a single claimer email next to each event.
I HIGHLY RECOMMEND NOT EDITING THIS PAGE! The formulas that do all of the automation can be a bit fragile changed slightly or something is placed below them. Even seemingly empty* tiles might be doing something!
## EventsSheet (New!)
This page contains the outputs of the Add an Event form (I recommend bookmarking that; it can be found by clicking on Form->Go to live form in the menu bar of EventsSheet, if you ever lose it).
PLEASE DO NOT EDIT THIS PAGE MANUALLY! Google Forms may get confused, and other things may break if a mistake is made!
## ClaimsSheet (New!)
This page contains the outputs of the Event Claimer form (another good one to bookmark; can be found by the same process as for ‘Add an Event’ but on ClaimsSheet), the form that writers will use to claim events.
This form is automatically generated from the Events page and updates approximately every hour.
Again, PLEASE DO NOT EDIT THIS PAGE MANUALLY!
## ChosenClaimer (New!)
This is a work in progress page that will allow us to choose who claimed what event, but is currently non-functional.
## Data Analysis (New!)
Ever wanted to see the department leaderboard? How many articles we publish each week? How many each person writes? Now you can!
This page automatically populates from the range in Published Articles specified by “Start Cell” and “End Cell”. Enjoy!

*This is because of some ArrayFormula black magic. Essentially array formulas can populate cells with nothing, but need to put a blank space if skipping a row, even if it skips all rows after it. Like I said, fragile.
# The New Flow
 
So what’s all this to you?  Well, hopefully, all these pages will help smooth out the Arts Department’s workflow. In a nice numbered list, the flow is now:
1. Input events from Arts Spam (email) to the Add an Event form
  a. This will automatically update the Events page, take about an hour to update the Event Claimer form, and will show in the next digest email.
2. From these events, a digest email will be sent out to writers every day with unclaimed/in grace period events
  a. This also email links to the Event Claimer form
3. Writers claim events using the Event Claimer form
  a. These claims appear on the Claimed Events tab of the sheet
4. After the grace period, an editor will RSVP whoever they choose to go to the event from those who claimed
5. The writers write, the editors edit, the publishers publish, etc. From here on out, everything is the same as we have done before
 
Let me know what you think! I’m open to suggestions! If you run into any issues or find any bugs, please tell me!
