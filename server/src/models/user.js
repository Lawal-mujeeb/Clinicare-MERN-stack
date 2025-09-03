import mongoose, { Schema, model } from "mongoose";

//note we define the user first then pass it to the model
// initialize our schema
const userSchema = new Schema(
  {
    fullname: {
      type: String,
      required: [true, "Full name is required"],
      trim: true, // even if there is spaces it would clean it for us
      maxlength: [50, "Full name cannot be more than 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email name is required"],
      trim: true,
      lowercase: true,
      unique: true, // so you cant use it to register multiple user
    },
    password: {
      type: String,
      required: [true, "Password  is required"],
      select: false, //prevent password field from being sent to client
    },
    dateOfBirth: {
      type: Date,
    },
    phone: {
      type: String,
      //when we set unique mongodb will be expecting a value, so we set default to empty string
    },
    avatar: {
      type: String,
      default: "", // it is an empty because we dont have the avatar here
    },
    avatarId: {
      // use to track the image from claudineri through the id
      type: String, //filed is to track the id attached to our avatar url from cloudinary
    },
    role: {
      type: String,
      enum: ["patient", "doctor", "nurse", "staff", "admin"], //predefined options that must be selected
      default: "patient",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      select: false, //select is to prevent it from being send to client side
    },
    verificationTokenExpiry: {
      type: Date,
      select: false, //select is to prevent it from being send to client side
    },
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetTokenExpiry: {
      type: Date,
      select: false,
    },
    isCompletedOnboard: {
      type: Boolean,
      default: false,
      select: function () {
        return this.role === "patient";
      }, //show field only if the user role is patient
    },
  },
  {
    //we want mango db to attach when a file was created
    timestamps: true, //include a createAt and updateAt when a doc is created
  }
);

const User = mongoose.models.User || model("User", userSchema); //this checks if amodel named User already exists to prevent subsequent checks. if it does not exist then it creates it. it is useful when compiling your schema as you make changes
export default User;
//model simply means what holds our user

// A model is a Mongoose object that gives you access to the database collection with methods like:
// User.create() — add a new user
// User.find() — get users
// User.findOne() — get one user
// User.updateOne() — update a user
// User.deleteOne() — delete a user

//  What makes mongoose.models.User already exist?
// It's because the User model has already been created earlier — likely from another file or a previous run (especially during development when the app reloads often).
//  Why is that a problem?
// Mongoose does not allow creating the same model twice.If you try to, it gives an error.

// ✅ So what does this line do?
// const User = mongoose.models.User || model("User", userSchema);
// It says:
// “If the User model already exists, use it.
// If not, create a new one.”

//  Why is this useful?
// It prevents Mongoose errors during development when your code reloads or runs more than once.

// Typical Workflow
// A user uploads a profile image.
// You send the image to Cloudinary.
// Cloudinary responds with:
// A secure_url (avatar) — this is what you display.
// A public_id (avatarId) — this is what you save to track/delete/update the image.
// You save both in the userSchema.
