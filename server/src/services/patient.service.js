import Patient from "../models/patient.js";
import User from "../models/user.js";
import responseHandler from "../utils/responseHandler.js";
const { errorResponse, notFoundResponse } = responseHandler;

const patientService = {
  register: async (userId, patientData, next) => {
   
    const patientExists = await Patient.findOne({ email: patientData.email });
    if (patientExists) {
      return next(errorResponse("Patient already exists", 400));
    }
    const patientPhone = await Patient.findOne({ phone: patientData.phone });
if (patientPhone) {
  return next(errorResponse("Phone number already exists", 400));
}
    //we are putting you in a new database called patient and also updating u
    const patient = await Patient.create({
      userId,
      ...patientData,
    });
    //update and save user patient profile putting our user in our new patient folder
    const user = await User.findById(userId);
    user.isCompletedOnboard = true;
    user.phone = patientData.phone;
    user.dateOfBirth = patientData.dateOfBirth;
    await user.save();
    return patient;
  },
// Getting patient data from our Patient collection in MongoDB
  getPatient: async (userId, next) => {
     // Find patient with matching userId  userId.toString() ensures the ID is treated as a string (in case userId comes as an ObjectId or number).
    const patient = await Patient.findOne({ userId: userId.toString() });
    if (!patient) {
      return next(notFoundResponse("No patient found"));
    }
    return patient;
  },
  updatePatient: async (patientId, patientData, next) => {
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return next(notFoundResponse("No patient found"));
    }
    for (const [key, value] of Object.entries(patientData)) {
      if (value) {
        patient[key] = value;
      }
    }
    const updatedPatient = await patient.save();
    return updatedPatient;
  },
  getAllPatients: async (
    page = 1,
    limit = 10,
    query = "",
    gender = "",
    bloodGroup = "",
    next
  ) => {
    const bloodGroupQuery = bloodGroup.replace(/[^\w+-]/gi, "");
    const sanitizeQuery = query
      ? query.toLowerCase().replace(/[^\w\s]/gi, "")
      : "";
    const [patients, total] =
      sanitizeQuery || gender || bloodGroup
        ? await Promise.all([
            Patient.find({
              $or: [{ fullname: { $regex: sanitizeQuery, $options: "i" } }],
              ...(gender && { gender: gender.toLowerCase() }),
              ...(bloodGroupQuery && { bloodGroup: bloodGroupQuery }),
            })
              .sort({ createdAt: -1 })
              .skip((page - 1) * limit)
              .limit(limit),
            Patient.countDocuments({
              $or: [{ fullname: { $regex: sanitizeQuery, $options: "i" } }],
              ...(gender && { gender: gender.toLowerCase() }),
              ...(bloodGroupQuery && { bloodGroup: bloodGroupQuery }),
            }),
          ])
        : await Promise.all([
            Patient.find()
              .sort({ createdAt: -1 })
              .skip((page - 1) * limit)
              .limit(limit),
            Patient.countDocuments(),
          ]);
    if (!patients) {
      return next(notFoundResponse("No patients found"));
    }
    return {
      meta: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        total,
        hasMore: (page - 1) * limit + patients.length < total,
        limit,
      },
      patients,
    };
  },
};

export default patientService;
//the patientData is an object containing the patient's information such as fullname, email, dateOfBirth, phone, address, gender, bloodGroup, emergencyContact, emergencyContactPhone, and emergencyContactRelationship.
//we check to see if our patient already exists in the database by searching for a patient with the same email address.
//the userId is the unique identifier for the user associated with the patient record. - it is used to link the patient information to the specific user in the database. - we use it when creating the patient record to ensure it is associated with the correct user.
//userId will also be used to update the user information after the patient record is created. and populate the user fields with the patient information.
