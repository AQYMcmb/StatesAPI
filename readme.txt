https://github.com/CivilServiceUSA/us-states/blob/master/data/states.json

>>> AND test and remember to submit (not just test!) your REST API at this automated testing link: https://dazzling-snickerdoodle-777101.netlify.app/

AND 4) Automated Tests for your REST API => You will see very detailed tests on the automated testing page. 90pts (90% of your grade)

You should become familiar with Postman as it is a standard industry tool for testing REST APIs. 
The ThunderClient extension for VS Code is also good. 
You can also check GET requests by entering the URL in a browser. Firefox does a far better job of formatting the returned JSON. I recommend the developer edition.
CORS will not block Postman, but it may block the automated testing web app. 
Do you remember seeing how to check CORS in the browser console from one of the assigned videos?
Your REST API project should be available to all so consider adjusting your allowed origins to reflect this. 
CORS NPM package documentation
We are using a states.json file from a Civil Services Github repository. 
Here is a link to the states.json file.
Once you are on the Github page, click the "raw" button and copy (Ctrl+A to select, Ctrl+C to copy) everything on the page. 
Create a new file in your project (preferably in the models directory) named states.json and paste (Ctrl+V) the contents inside. 
Save the file (Ctrl+S), and you should be good to go.
Do you remember how to import data from a JSON file in Node.js?
dotenv Environment Variable - Step-by-Step
1) You have to install the dotenv npm package. On a command line, type:
npm i dotenv

That should install the dotenv package. Now the dependencies in your package.json file should list dotenv similar to this:
"dotenv": "^16.0.0",

2) At the top of your server.js file, you need to require the package and call config() like this:
require('dotenv').config();

3) Create a .env file in your root directory (the same place you have your server.js file). Inside the .env file, create your environment variable like this:
DATABASE_URI=mongodb+srv://YOUR_MONGO_USERNAME:YOUR_MONGO_PASSWORD@cluster0.9elkk.mongodb.net/states?retryWrites=true&w=majority

Note: your MongoDB cluster details in the string could easily be different. Get this string from your MongoDB collection like the videos show how to do. No quotes around this value.
4) In your connectDB function, refer to the environment variable like this:
await mongoose.connect(process.env.DATABASE_URI);

You could name your function differently but I'm giving examples directly from the assigned videos and the source code provided with them.
Item
Final Project Discussion / SuggestionsFinal Project Discussion / Suggestions
Automated Tests
https://dazzling-snickerdoodle-777101.netlify.app/
Example API
It will help to verify the output of your project matches that of the example project.
Deploying your Github Repo to Glitch.com
You will need to set up a free Glitch.com account. You can link it to your Github.
You can simply use this URL in your browser to deploy your Github repo to Glitch: 
https://glitch.com/edit/#!/import/github/YOUR_GITHUB_USERNAME/YOUR_GITHUB_REPO_NAME
That said, every time you use the link, you will create a new Glitch project - not update the same one.
Glitch does support environment variables and makes them easy to update. Just look for the .env file in the file tree when you edit your project on Glitch.
I recommend testing your API thoroughly in your local dev environment before deploying. 
I will also allow other hosts if you prefer to set up a deployment pipeline with Heroku or similar.
NOTE: If using Glitch to host your API, you should add the following property to your package.json file:
"engines": {
    "node": "14.x"
  },
The Example Code from the Tutorial Videos
All of the example code is available from the Node.js / Express / MongoDB tutorials. 
It is important to understand it, but also, you can use it! 
You will need to understand it to know what to modify for this project. 
Creating a MongoDB collection
This is well-documented in the assigned videos for class. Nothing new here. 

Middleware
You will need to verify the URL parameter :state for most endpoints. 
It is best to just write the code for this once and include the middleware where needed. 
Permit lowercase, uppercase, and mixed versions of the state abbreviations to be accepted for the :state parameter. 
To create an array that only contains the 50 state abbreviation codes from the state.json data, you may find the array map method useful. 
You may also discover the array find method is useful afterwards.
Respond appropriately to an invalid state abbreviation code (see example project)
If the state code is valid, attach the value to the request object before calling next() because you will need to refer to it in the controller functions, too.
Strategies for each GET method API endpoint

The /states/ endpoint:
Start by just returning the data from the states.json file. This will help you pass some of the automated tests quickly. 
The remainder of the requirements for this endpoint actually make it one of the most difficult, so you may want to come back to it AFTER finishing the other GET endpoints. 
To determine the list of states you are going to respond with, it will either be 1) all 2) contiguous or 3) non-contiguous. 
Contiguous means the lower 48 and not HI and AK. Non-contiguous is the opposite.
This endpoint should acknowledge a query parameter named contig if it is sent. Otherwise, all states data will be sent in the response.
The array methods find, filter, and forEach may be useful as you build the controller function to handle this endpoint.
To deliver ALL of the required data, you will need to query your MongoDB model and attach the "funfacts" to the response for each state that has fun facts saved for it in the MongoDB collection.

The /states/:state endpoint:
You will need to find the requested state in the states.json data and also attach the "funfacts" from MongoDB if they exist before sending the response.

The /states/:state/funfact endpoint:
You are once again finding the specified state, but now you must respond with one random fun fact if it exists or the appropriate message (see example app) if no fun facts exist.
Do you know how to select a random element from an array? You will need to.

The capital, nickname, population, and admission endpoints:
These are all nearly identical and the easiest endpoints to complete. 
You are finding the specified state from the states.json data and creating a response with the state name and capital, nickname, population, or admission date. 
There is no interaction with the MongoDB model in these endpoints.

The /states/:state/funfact POST request
The request body should have a "funfacts" property with a value that is an array containing one or more fun facts about the state. 
You will want to verify you have received this "funfacts" data. 
You should also verify this data is provided as an array.
You will need to find the requested state in your MongoDB collection. 
If the state already has some fun facts, you should add the new fun facts to them without deleting the pre-existing fun facts. 
If the state has no pre-existing fun facts, then create a new record in your MongoDB collection with the stateCode and funfacts array.

The /states/:state/funfact PATCH request
We are not replacing the entire record. Therefore, we use PATCH instead of PUT.
The request body should have a "funfact" property with a value that is a fun fact about the state and there should also be an "index" property (starting at 1, not zero) that indicates the element of the funfacts array to be updated in the funfacts array stored in the MongoDB collection. 
After checking to see if the index value exists, you will want to subtract 1 from the value to match up with the zero index of the array in MongoDB. Why? Zero is equal to false. My suggestion may be easier or you may do it a different way.
Respond appropriately (see example project) if the index or funfact values are not received.
You will need to find the specified state in your MongoDB collection. 
If no fun facts are found or no fun fact is found at the specified element position, send an appropriate response (see example project). 
Otherwise, set the element at the specified position of the funfacts array to the new value. 
Save the record and respond with the result received from the model.

The /states/:state/funfact DELETE request
This request body should have an "index" property. Handle it as described above in the PATCH request suggestions. 
Again, appropriate responses as noted in the PATCH request, too. 
You may find filtering an element from an existing array to be the best approach here. You do not want to simply delete an element and leave an undefined value in the array. 
Afterwards, save the record and respond with the result received from the model.
Express JS ParametersExpress JS Parameters
In the requirements document, I highlight the differences in URL and Query parameters (see Notes #5 under GET requests in that doc).
There are 3 types of parameters that you can look for:
1) body - sent in the body of a request (GET requests do not do this - this is usually how POST, PUT, PATCH, and DELETE send params)
2) URL - defined in the request URL like this - url.com/:param - (Any type of request can use these. It is a dynamic URL)
3) query - added at the end of the URL like this - url.com?param=Socks (Usually GET requests)
Express retrieves each of these types differently from the request object (shown as req below):
1) Any parameter sent in the body of a request: req.body.param_name
2) url.com/:state - req.params.state
3) url.com/?whatever - req.query.whatever
You can also retrieve these with object destructing: const { param_name } = req.query (or req.params or req.body) if you wish.
Express Request docs: https://expressjs.com/en/5x/api.html#req
verifyStates Middleware
If you are going to need the same function to verify data for more than one route, you should create that function as middleware. This will allow you to create it only once and place it in any route that needs it.
There was an assigned video tutorial on middleware. The middleware I suggest you need for your final project is verifyStates. You need to verify the URL parameter :state matches one of the 50 possible state abbreviations. 
Start by breaking down any problem like this into smaller steps:
1) You will need to pull in the state codes from the statesData.json file.
2) Instead of all of the states data, just make a states code array - I recommend using the array map() method to do this.
3) Search your newly created states code array to see if the state parameter received is in there.
4) If it isn't, return the appropriate response
5) If it is, attach the verified code to the request object: req.code = stateCode and call next() to move on.
You should see examples of the request object as referenced above and calling next() in middleware from the assigned middleware tutorial video.
P.S. - Notice all of the state codes in the statesData.json file are capitalized. You want to be able to receive lowercase and mixed-case parameters. I suggest using the .toUpperCase() string method when receiving the parameter value.