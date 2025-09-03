import { useCallback } from "react"
import { formatDate, patientsTableColumns } from "@/utils/constants";
import TableBody from "@/components/TableBody";
import { RiMailFill, RiPhoneLine } from "@remixicon/react";


export default function Table({patients}) {
const renderCell = useCallback((patient, columnKey) => {
//This function decides what each table cell should look like, depending on the column.
//It receives: patient → one row of data (an object).columnKey → which column we’re rendering (e.g., "fullname", "gender", "action").Then it uses a switch to match the column.

    const cellValue = patient[columnKey]    //so the item and header uid coming from render cell components  represents patient (item) = one patient object (the whole row). and column key
    switch (columnKey) { //the switch statement matches it based on column key
      case "fullname":
        return (
          <>
            <h1 className="font-bold">{patient?.fullname}</h1>
            {patient?.email}
          </>
        );
      case "gender":
        return <div className="capitalize">{patient?.gender}</div>;
      case "dateOfBirth":
        return (
          <div className="capitalize">{formatDate(patient?.dateOfBirth)}</div>
        );
      case "action":
        return (
          <div className="flex gap-4 items-center">
            <button
              onClick={() => window.open(`mailto:${patient.email}`, "_blank")}
              title="send a mail"
              className="cursor-pointer"
            >
              <RiMailFill className="text-blue-500" />
            </button>
            <button
              onClick={() =>
                window.open(`tel:${patient.phoneNumber}`, "_blank")
              }
              title={`call ${patient?.fullname}`}
              className="cursor-pointer"
            >
              <RiPhoneLine className="text-blue-500" />
            </button>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

 

  return (
    <>
    
    
    <TableBody tableColumns={patientsTableColumns} tableData={patients} renderCell={renderCell}/>
    </>
  )
}
