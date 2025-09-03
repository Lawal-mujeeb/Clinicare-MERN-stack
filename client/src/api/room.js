import axiosInstance from "@/utils/axiosInstance";
import { headers } from "@/utils/constants";

export const createRoom = async ({ formData, accessToken }) => {
  return await axiosInstance.post(
    "/rooms/create",
    formData,
    headers(accessToken)
  );
};

export const getRoomMeta = async (accessToken) => {
  return await axiosInstance.get("/rooms/meta", headers(accessToken));
};




export const getAllRooms = async (searchParams, accessToken) => {
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const query = searchParams.get("query") || "";
  const params = new URLSearchParams();
  const roomType = searchParams.get("roomType") || "";
  const roomStatus = searchParams.get("roomStatus") || "";
   params.append("page", page);
  params.append("limit", limit);
  if (query) params.append("query", query);
  if (roomType) params.append("roomType", roomType);
  if (roomStatus) params.append("roomStatus", roomStatus);

  return await axiosInstance.get(
    `/rooms/all?${params.toString()}`,
    headers(accessToken)
  );


}
 
export const updateRoom = async ({ roomId, formData, accessToken }) => {
  return await axiosInstance.patch(
    `/rooms/${roomId}/update`,
    formData,
    headers(accessToken)
  );
};




// router.patch(
//   "/:id/update",
//   verifyAuth,
//   authorizedRoles("admin"),
//   validateFormData(validateRoomSchema),
//   clearCache("rooms"),
//   updateRoom
// );



// export const updatePatient = async ({ patientId, formData, accessToken }) => {
//   return await axiosInstance.patch(
//     `/patients/${patientId}/update`,
//     formData,
//     headers(accessToken)
//   );
// };