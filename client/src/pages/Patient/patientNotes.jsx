// The flow looks like this

// Parent provides data

// <Table patients={patientsArray} />


// Table receives it as props

// function Table({ patients }) { ... }


// Table forwards it to TableBody

// <TableBody tableData={patients} ... />


// TableBody maps over it → renders each row.

// So:
// 👉 patients doesn’t come from magic — it’s a prop passed into the Table component by whichever parent is using it.