// What renderCell really is 🧩
// const renderCell = useCallback((patient, columnKey) => {
//   const cellValue = patient[columnKey]
//   switch (columnKey) {
//     ...
//   }
// }, []);


// It’s a function you created and passed down to TableBody.

// For each cell, TableBody calls this function like:

// renderCell(item, header.uid)


// where:

// item = one patient object (row).

// header.uid = the current column key ("fullname", "gender", "dateOfBirth", etc.).

// So renderCell gets exactly two things every time:

// The row’s data → e.g.

// {
//   fullname: "Jane Doe",
//   email: "jane@example.com",
//   gender: "female",
//   dateOfBirth: "1990-05-12",
//   phoneNumber: "08012345678"
// }


// The column identifier (like "fullname", "action").

// What happens inside

// First, you grab the "raw" value for that column:

// const cellValue = patient[columnKey]


// Example:

// If columnKey = "gender", then cellValue = patient["gender"] → "female".

// If columnKey = "address", then cellValue = patient["address"] → "123 Main St".

// Then you decide how to render it, using the switch statement.

// Why use a switch?

// Because not all columns should look the same:

// Simple ones (like address, bloodGroup) → just show the plain text cellValue.

// Special ones (like fullname, dateOfBirth, action) → need custom formatting.

// That’s why your code looks like this:

// fullname → show the name in bold, and also display the email.

// gender → capitalize the first letter.

// dateOfBirth → format it into a nice human-readable date.

// action → render buttons (icons to mail or call).

// default → just return cellValue (covers the plain text fields).

// Example in action ⚡

// Take this patient:

// const patient = {
//   fullname: "Jane Doe",
//   email: "jane@example.com",
//   gender: "female",
//   dateOfBirth: "1990-05-12",
//   address: "123 Main St",
//   bloodGroup: "O+",
//   phoneNumber: "08012345678"
// };


// And let’s say columnKey = "action":

// cellValue = patient["action"] → (undefined, because action isn’t in patient object).

// But switch("action") goes to the action case, so instead it renders the two buttons (mail + phone).

// Now if columnKey = "gender":

// cellValue = patient["gender"] → "female".

// Switch goes to "gender" case, so it wraps it with <div className="capitalize">female</div> → displayed as “Female”.

// ✅ In short:
// renderCell = the custom painter 🎨 for each cell.
// It decides: Should this cell show plain text, formatted text, or special buttons?



