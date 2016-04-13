#Notes:


!!! NOTE "tl;dr"
    - Firebase has libraries for a great variety of platforms
        > We will be working with web.
    - Maintain flat structure
    - Consider carefully your priorities in accessing data
    - OAuth can be used to manage users



Firebase documentation:
    - https://www.firebase.com/docs
**Setting/Getting Data**
    - Firebase can be described as huge, performant JSON file.
        > Firebase is composed of keys and values, and can be nested up to 32 levels.
            - Atchung! Although Firebase "objects" *can* be nested up to 32 levels, this is NOT recommended. You'll see why in the *Database Structure* section.
        > This is in contrast to traditional databases, which resemble 2 dimensional tables.
    - We must first set a reference to the Firebase database we created [1]
    - Using our reference, we can call:
```js
        ref = ref.child("/users/amelia");
```
    This sets the 'ref' variable to a child of 'ref' with path "/users/amelia". Assuming that 'ref' was originally the root, this is the equivalent of saying:
```js
        var ref = new Firebase("https://[projectname].firebaseio.com/users/amelia");
```
    To set the data at a reference, we can say:
```js
        ref.set({
            "first": "amelia",
            "last": "bedilia"
        })
```
    This results in a JSON object stored in Firebase that resembles this:
```js
        {
            "users": {
                "amelia": {
                    "first": "amelia",
                    "last": "bedilia"
                }
            }
        }
```
    Atchung! 'set' will overwrite what's currently stored at that path. It's setting the data to something else. If we only want to update some parts of the data without accidentally removing the rest, we can use the 'update' function:
```js
        ref.update({
            "last": "earhart"
        })
```
    This results in the JSON object looking like this:
```js
        {
            "users": {
                "amelia": {
                    "first": "amelia",
                    "last": "earhart"
                }
            }
        }
```
    Getting data is interesting. Since Firebase can update in realtime, generally you would use 'on' to get data whenever data updates.
```js
        ref.on('value', (data) => {
            console.log(data.val());
        });
```
    This runs the callback code whenever the value stored in the 'ref' changes. This would log:
```js
        {
            "first": "amelia",
            "last": "earhart"
        }
```
    If we were to change the value of 'last' back to "bedelia", the code would run again. If we only want to run the code once, we can use the 'once' function:
```js
        ref.once('value', (data) => {
            console.log(data.val());
        })
```
    In this case, the callback code would only execute once.

!!! ATTENTION "[1]"
    To use Firebase, we MUST first set a reference to our database. Once the Firebase library is loaded, we can accomplish this by saying:
    ```js
        var ref = new Firebase("https://[projectname].firebaseio.com");
    ```
    This creates a reference to the root of the database.
    If we want to create a reference to the users section of the database (assuming we have one defined), we would say:
    ```js
        var ref = new Firebase("https://[projectname].firebaseio.com/users");
    ```
    Keep in mind, of course, that the variable names are arbitrary; they can be anything you want them to be.

**Database Structure**
    - The structure of the database is the most important aspect. There are entire careers for "Database Architects"!
    - Arrays don't actually exist; "arrays" are faked by mapping values to zero-indexed integer values
        > Firebase does this conversion automatically.
    - Best practices
        > Flat structure
        > Minimize nesting!
            - when retrieving a node, you are retrieving all children, also!
    - Unique keys allow data to be identified uniquely [1]
    - Considerations:
        > Quick access to user information
            - Groups user belongs to
            - Name
    - With this in mind, this is how we set up our chat app:
```js
    {
        "groups": {
            "-JhLeOlGIEjaIOFHR0xd": {
                "name": "my room"
            },
            "-GhFeOlGEejbOasf0xd": { ... },
            "-GhFSaGoPbOasf0xd": { ... }
        },

        "members": {
            "-JhLeOlGIEjaIOFHR0xd": {
                "google:1204912432319128415238": true,
                "facebook:1150295729502137521292": true
            },
            "-GhFeOlGEejbOasf0xd": { ... },
            "-GhFSaGoPbOasf0xd": { ... }
        },
          
        "messages": {
            "-JhLeOlGIEjaIOFHR0xd": {
                "-JhLeOlGIEjaIOFHR0xd": { 
                    "sender": "facebook:1150295729502137521292", 
                    "message": "Vlad is rad"
                },
                "-JhQ76OEK_848CkIFhAq": { ... },
                "-JhQ7APk0UtyRTFO9": { ... }
            },
            "-GhFeOlGEejbOasf0xd": { ... },
            "-GhFSaGoPbOasf0xd": { ... }
        },
          
        "users": {
            "google:1204912432319128415238": {
                "name": "Naitian Zhou",
                "groups": {
                    "one": true,
                    "two": true
                }
            },
            "facebook:1150295729502137521292": { ... }
        }
    }
```

!!! TIP
    Firebase can generate its own keys which are unique. These keys are 120 bits, composed of 48 bits for the timestamp and 72 bits of randomness (in case 2 users submit information at the exact same time). This means entries with this key can also be sorted by time.

!!! NOTE "More exercises"
    What would be a good "flat" structure for a leaderboard? What about a to-do list? 


**User Authentication and Security**
    - [Security Documentation](https://www.firebase.com/docs/web/guide/understanding-security.html)
    - [User Auth Documentation](https://www.firebase.com/docs/web/guide/user-auth.html)
    - Firebase allows you to easily integrate with popular services such as Google, Facebook, and Github that offer OAuth.
        > OAuth is a user authentication technology based on series of exchanges between your servers, the other company's (Facebook, Google, Github) servers, and the client.
    - Firebase Login stuff is handled in "Login & Auth" in the Firebase Dashboard.
    - ![Dashboard Image](http://imgur.com/cFjrqur)
    - You also need to get a token from the other company's site. Just Google "developer [company] oauth token".
        > Follow the instructions on Firebase documentation as well as on any company developer pages. It should be a relatively straightforward process [1]
    - You can also use email to authenticate, as well as integrate another application. See the docs for more information on that.

*User Authentication*
    
    To launch an Facebook OAuth dialog in a separate window [2]:
```js
        ref.authWithOAuthPopup("facebook", (error, authData) => {
            if(error)
                console.log("Login Failed");
            else {
                console.log(authData);
            }
        });
```
    This would notify of a failure or log the data returned by Facebook. The data returned 

*Security*

    You're probably wondering how Firebase ensures random people don't completely screw up your database. After all, the requests and queries are formed on the client side. Someone could easily screw around with that. This is where security rules come into play.
    
    The Firebase Dashboard has a "Security & Rules" section. It allows you to define read and write permissions for the various paths of your database.


!!! CAUTION "[1] Some exceptions to 'relatively straightforward'"
    - Most notably, Facebook requires your app to be taken out of "developer mode" before other people can use it to log in.
    - Additionally, Firebase does not allow local static files to authenticate. This means you must serve your files somehow. The easiest way to do this in development is to run: `$ python -m SimpleHTTPServer 8000` to serve your current directory on port 8000. 
        >Atchung! The method mentioned above only works for Python 2. If you're using Python 3 instead, run `$ python -m http.server 8000` to serve your current directory on port 8000. If you don't have Python installed, you should probably do that.


!!! WARNING "[2] Remember that you have to have set up Facebook authentication in the dashboard, first."

