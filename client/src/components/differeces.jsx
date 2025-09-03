// 1. req.params → Path parameters

// Defined in the route itself with a colon (:).

// // Route definition
// app.get("/patients/:id", (req, res) => {
//   console.log(req.params);
// });


// Request:

// GET /patients/123


// req.params =

// { id: "123" }


// Use case: identifying a specific resource (e.g. patient with id 123).


// 2. req.query → Query string parameters

// Come after the ? in the URL.

// // Route definition
// app.get("/patients", (req, res) => {
//   console.log(req.query);
// });


// Request:

// GET /patients?age=25&gender=female


// req.query =

// { age: "25", gender: "female" }


// Use case: filtering, searching, pagination (e.g. ?page=2&limit=10).



// 3 req.body → Request body

// Data sent in the body of the request, usually with POST, PUT, or PATCH.
// Needs middleware like express.json() to parse.

// // Route definition
// app.post("/patients", (req, res) => {
//   console.log(req.body);
// });


// Request:

// POST /patients
// Content-Type: application/json

// {
//   "fullname": "Jane Doe",
//   "age": 30,
//   "gender": "female"
// }


// req.body =

// { fullname: "Jane Doe", age: 30, gender: "female" }


// Use case: creating or updating resources with structured data.

// Quick summary

// req.params → values in the URL path (e.g. /patients/:id).

// req.query → values in the query string (e.g. ?page=2).

// req.body → values in the body payload (e.g. JSON { name: "Jane" }).