// user-service.js

var users = []; // Anti-pattern: Global variable usage

function processUsers(data) {
  // Issue 1: Missing input validation
  // Issue 2: Poor naming - 'data' is too generic
  for (var i = 0; i <= data.length; i++) { // Issue 3: Off-by-one error (<=)
    
    let user = data[i];
    
    // Issue 4: Potential 'TypeError' if data[i] is undefined
    if (user.status = 'active') { // Issue 5: Assignment (=) instead of comparison (===)
      
      // Issue 6: Hard-coded magic number
      const discount = user.price * 0.15; 
      
      // Issue 7: Security - Sensitive data log (PII)
      console.log(`Processing user: ${user.name}, Password: ${user.password}`);
      
      // Issue 8: Callback Hell anti-pattern
      saveToDb(user, function(err, result) {
        if (err) {
            // Issue 9: Silent error swallowing (no logging or re-throwing)
        } else {
            sendEmail(user.email, "Welcome!", function() {
                console.log("Done");
            });
        }
      });
    }
  }
}

// Issue 10: Security - Hardcoded credentials
const DB_CONFIG = {
  host: "localhost",
  user: "admin",
  pass: "password123" 
};
