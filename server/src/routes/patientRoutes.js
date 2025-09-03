import express from "express";
import { verifyAuth, authorizedRoles } from "../middlewares/authenticate.js";
import { validateFormData } from "../middlewares/validateForm.js";
import { validatePatientSchema } from "../utils/dataSchema.js";
import { clearCache, cacheMiddleware } from "../middlewares/cache.js";
import { register, getPatient, updatePatient, getAllPatients } from "../controllers/patientController.js";


const router = express.Router();

router.post(
  "/register",
  verifyAuth,
  authorizedRoles("admin", "patient"),
  validateFormData(validatePatientSchema),
  clearCache("auth_user"),
  register
);


router.get("/me", verifyAuth, cacheMiddleware("patient", 3600), getPatient);

//here it going to be a patch request because we want to update an existing patient
router.patch(
  "/:id/update",  //:id is a route parameter → goes into req.params.id.
  verifyAuth,    //likely checks JWT or session to confirm the user is logged in. If not, it stops the request.
  authorizedRoles("admin", "patient"), //ensures only users with role "admin" or "patient" can hit this route.
  validateFormData(validatePatientSchema), //validates the req.body against your schema (so invalid fields are caught before update).
  clearCache("patient"), //probably clears any cached patient data so the update is reflected immediately in the cache layer (like Redis).
  updatePatient   //The controller updatePatient Finally, after all those guards, the request hits your controller: req.params.id → comes from the :id in your URL.


);

router.get(
  "/all",
  verifyAuth,
  authorizedRoles("admin", "doctor", "nurse", "staff"),
  cacheMiddleware("patients", 3600),
  getAllPatients
);

export default router;