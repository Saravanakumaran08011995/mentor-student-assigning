const mongoose = require("mongoose");
//? Custom collection
const STUDENTS_COLLECTION = "STUDENTS_COLLECTION";
// ----------------------------------
//? Student schema
const studentSchema = new mongoose.Schema(
  {
    FirstName: {
      type: String,
      required: true,
    },
    LastName: {
      type: String,
      required: true,
    },
    Email: {
      type: String,
      required: true,
    },
    Course: {
      type: String,
      required: true,
    },
    AssignedMentor: {
      type: String,
    },
    Newly_Assigned_Mentor: {
      type: String,
    },
  },
  { timestamps: true }
);
// ----------------------------------
//? export the Student model, used Custom collection
const Student = mongoose.model("Student", studentSchema, STUDENTS_COLLECTION);
module.exports = Student;
// ----------------------------------
