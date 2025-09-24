README
---

## Library Loan Tracker

http://a3-kayliequach.vercel.app

The following application is a library loan tracker that allows users to input an item they have borrowed from the library, the details about the item (author, section), the borrowed date, and the due date of the item. Upon entering the application, the user will be prompted to log in with Github. After a successful login, the user will be redirected to the applications homepage where they can access the library loan data associated with their account. They have the ability to add items to their tracker using the form to the left, or modify and delete existing data using buttons to the right of the tracker table. All loan data is stored in a persistent database storage MongoDB.

The biggest challenge I faced while making this application was implementing Github OAuth. This is also the authentication strategy I chose to use for my application. Although it was hard, I chose to use this because I wanted to learn and go through the process of implementing a complex authorization strategy. I also felt like that experience would better translate to future projects I would work on (because a Github login is much more intuitive in applications nowadays compared to a dummy login). The CSS framework I used is TailwindCSS and I chose this because I was previously familiar with this framework through my Software Engineering project.

Express Middleware Packages:
- express.static – serves static files from a directory
- express.json – parses incoming JSON request bodies
- express-session – manages user sessions on the server via cookie, keeps users logged in
- passport.initialize() – initializes passport.js, handles authentication
- passport.session() – integrates passport.js with express-session to maintain login sessions
- passport-github – provides Github OAuth strategy for passport.js, allows users to log in with Github 


## Technical Achievements
- **Tech Achievement 1**: I used OAuth authentication via the GitHub strategy through passport.js. Users upon accessing the application are prompted to login via Github.
- **Tech Achievement 2**: I hosted my web application through Vercel instead of Render. I found that Vercel was a little bit easier to use than Render because their UI was clearer with what we needed to do to deploy the application (espescially to a user who may be unfamiliar with deployment services like me!) and also clearly pointed out issues and suggested fixes if the deployment failed.

## Design/Evaluation Achievements
- **Design Achievement 1**: I followed 12 following tips from the W3C Web Accessibility Initiative:
  - Writing:
    - (1) Provide informative, unique page titles: My login page title is called 'Login | Library Loan Tracker' and my homepage is titled 'Homepage | Library Loan Tracker'. This lets user know what page they are on, followed by what application they are on.
    - (2) Use headings to convey meaning and structure: I have included headings for my input form ('Create New Loan') and my tracker table ('Existing Loans').
    - (3) Provide clear instructions: I have added a short instruction of how to use the input form, and how to use the modify and delete buttons on the tracker table.
  - Design:
    - (4) Provide sufficient contrast between foreground and background: My primary background color is white and the text on it is black - which provides clear contrast. My header is red following the theme of the webpage, so I have made the text white instead of black for clearer contrast there.
    - (5) Don’t use color alone to convey information: For required fields in the input form, I've marked it with both an asterisk and red color.
    - (6) Ensure that interactive elements are easy to identify: Buttons such as submit, modify, delete, and sign in buttons have a clear contrast on hover to indicate that they are interactive (they have at least 200 contrast, ie. blue-600 and hover:blue-800).
    - (7) Ensure that form elements include clearly associated labels: Each form field has an easy and intuitive associated label above the field. 
    - (8) Provide easily identifiable feedback: If a user tries to submit without filling out a required field, a popup will appear pointing to the missing field with clear instructions.
    - (9) Use headings and spacing to group related content: The header, input form, and tracker table are clearly separated using appropriate header and spacing that is larger than the spacing that separates their related content.
  - Development:
    - (10) Associate a label with every form control: Each of the input form label (in the code) as a for= field that is associated with the input's id (ie. <label for="item" ... > <input id="item" ... >)
    - (11) Identify page language and language changes: <html lang="en"> is marked on the top of all html pages to indicate the language of the page is English.
    - (12) Reflect the reading order in the code order: The reading and code order is marked by a labeled/ID'd div tag that indicated the section of the page it's in - for example, <div id="form-box" ... > separates the input form from the <div id="results-box" ... > tracker table, even if they live in the same flexbox div.
