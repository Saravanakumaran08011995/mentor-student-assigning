const mongoose = require("mongoose");
//? Custom collection
const MENTORS_COLLECTION = "MENTORS_COLLECTION";
// ----------------------------------
//? Mentor schema
const mentorSchema = new mongoose.Schema(
  {
    Name: { type: String, required: true },
    Experience: { type: Number, required: true },
    Expertise: { type: String, required: true },
    Students: { type: Array },
  },
  { timestamps: true }
);

// ----------------------------------
//?  export the Mentor model, used Custom collection
const Mentor = mongoose.model("Mentor", mentorSchema, MENTORS_COLLECTION);
module.exports = Mentor;
// ----------------------------------
