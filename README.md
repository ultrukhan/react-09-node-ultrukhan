# sprint-10-node

## Task

Implement an http server (use ExpressJS) that initiates asynchronous operations when a GET request is made:
- Continuous output to the server console of the current UTC date and time at certain intervals.
- Stopping the console time output after a while and completing the server response with the return to the user a current UTC date and time.
Look at example screenshot for the exact formatting.

### Acceptance criteria:
- When you connect to the server, the output to the console of the current time begins at regular intervals
- Stop output to the console after the specified time and return the current date and time to the user.
- The interval and time interval must be specified when starting the server using command line arguments:
  > `$ node server.js -i [console output recurrence interval] -t [time after which the web client message will be displayed]`
- If parameter is not passed, the default value should be used: 100 ms for *i* and 700 ms for *t*
- When the application starts, parameters *i* and *t* should be logged to the console:  
*interval: [value] timeout: [value]*
- Export *app* object and running *server* object form server.js (use those exact names)


### Example:
![Example](.github/images/example.png)
