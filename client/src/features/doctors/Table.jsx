import {  useCallback } from "react"
import {  doctorsStatusColors, doctorsTableColumns } from "@/utils/constants";
import TableBody from "@/components/TableBody";


import EditDoctors from "./EditDoctors";

// {doctors}
export default function Table({doctors}) {
   
//only admin has access to edit rooms

  
const renderCell = useCallback((doctor, columnKey) => {


    const cellValue = doctor[columnKey]   
    switch (columnKey) { 
      case "fullname":
        return (
         
            <div className=" items-center gap-1 ">

            <h1 className="font-bold">{doctor?.userId?.fullname}</h1>

            <h1 className="text-gray-500 sm "  >  {doctor?.userId?.email}   </h1>
             
         </div>
        
        );
      case "phone":
        return <div className="capitalize"> {doctor?.phone ? doctor.phone : "N/A" }   </div>;
      case "specialization":
        return (
          <div className="capitalize">{doctor?.specialization}</div>
        );
        case "availability":
            return (
              <div    className={`capitalize badge badge-sm font-bold ${doctorsStatusColors[doctor?.availability]}`}  >{doctor?.availability}</div>
            );
            
    
      case "action":
        return (
          <div className="">
            
             <EditDoctors   doctor={doctor}  />
           
          </div>
        );
      default:
        return cellValue;
    }
  }, [ ]);

 

  return (
    <>
    
    
    <TableBody tableColumns={doctorsTableColumns} tableData={doctors} renderCell={renderCell}/>
    </>
  )
}
