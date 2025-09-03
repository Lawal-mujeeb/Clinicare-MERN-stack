import axiosInstance from "@/utils/axiosInstance";
import { headers } from "@/utils/constants";



export const getAllDoctors = async (searchParams, accessToken) => {
 const page = Number(searchParams.get("page")) || 1;
 const limit = Number(searchParams.get("limit")) || 10;
 const query = searchParams.get("query") || "";
 const params = new URLSearchParams();
 const specialization = searchParams.get("specialization" )  ||  "";
 const availability = searchParams.get("availability" )  ||  "";
   params.append("page", page);
 params.append("limit", limit);
  if (query) params.append("query", query);
  if (specialization) params.append("specialization",specialization);
  if (availability) params.append("availability", availability);

  return await axiosInstance.get(
    `/doctors/all?${params.toString()}`,
     headers(accessToken)
  )
}

export const updateDoctors= async ({ doctorId, formData, accessToken }) => {
  return await axiosInstance.patch(
    `/doctors/${doctorId}/update`,
    formData,
    headers(accessToken)
  );
};





// export const updatePatient = async ({ patientId, formData, accessToken }) => {
//   return await axiosInstance.patch(
//     `/patients/${patientId}/update`,
//     formData,
//     headers(accessToken)
//   );
// };

// router.patch(
//   "/:id/update",  //:id is a route parameter → goes into req.params.id.
//   verifyAuth,    //likely checks JWT or session to confirm the user is logged in. If not, it stops the request.
//   authorizedRoles("admin", "patient"), //ensures only users with role "admin" or "patient" can hit this route.
//   validateFormData(validatePatientSchema), //validates the req.body against your schema (so invalid fields are caught before update).
//   clearCache("patient"), //probably clears any cached patient data so the update is reflected immediately in the cache layer (like Redis).
//   updatePatient   //The controller updatePatient Finally, after all those guards, the request hits your controller: req.params.id → comes from the :id in your URL.
// );



// router.patch(
//   "/:id/update",
//   verifyAuth,
//   authorizedRoles("admin"),
//   validateFormData(validateDoctorAvailabilitySchema),
//   clearCache("doctors"),
//   updateDoctor
// );

// export default router;