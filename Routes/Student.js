const express = require("express");
const Student = require("../Models/Student");
const Mentor = require("../Models/Mentor");
const router = express.Router();

// ----------------------------------
//? 2) Write API to create Student

router.post("/create-student", async (req, res) => {
  try {
    // --------------
    //? new student document from the request body
    const student = new Student({
      FirstName: req.body.FirstName,
      LastName: req.body.LastName,
      Email: req.body.Email,
      Course: req.body.Course,
    });
    // --------------
    //? Save the student document to the database
    const savedStudent = await student.save();
    const response = {
      Student_Name: savedStudent.FirstName + " " + savedStudent.LastName,
      Student_Email: savedStudent.Email,
      Student_Course: savedStudent.Course,
    };
    // --------------
    //? Send the saved student document as a JSON response
    res.status(201).json(response);
    // --------------
  } catch (err) {
    //? If any errors that occur during student creation
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------

//? 3) (ii) A student who has a mentor should not be shown in List.

router.get("/all-students/no-mentor", async (req, res) => {
  try {
    // --------------
    //? Find all students who do not have a mentor
    const students = await Student.find({ AssignedMentor: null });
    // --------------
    //? Mapping of students to responses
    const List_of_Students = students.map((Find_Student) => {
      return {
        Student_Name: Find_Student.FirstName + " " + Find_Student.LastName,
        Student_Email: Find_Student.Email,
        Student_Course: Find_Student.Course,
      };
    });
    res.json(List_of_Students);
    // --------------
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ----------------------------------

//? 4) Write API to Assign or Change Mentor for particular Student
///?   Select One Student and Assign one Mentor.

router.put("/assign-mentor/:id", async (req, res) => {
  try {
    // --------------
    //? Extract the student ID from the URL parameter
    const studentId = req.params.id;
    // --------------
    //? Extract the mentor ID from the request body
    const mentorId = req.body.Mentor_Id;
    // --------------
    //? Check if the student and mentor IDs are provided
    if (!studentId || !mentorId) {
      return res
        .status(400)
        .json({ message: "Student and Mentor IDs are required" });
    }
    // --------------
    //? Find the student by ID
    const student = await Student.findOneAndUpdate(studentId);
    // --------------
    //? Check if the student exists
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    // --------------
    const mentor = await Mentor.findOne({ _id: mentorId });
    //? Update the student's AssignedMentor field with the new mentor Name
    student.Newly_Assigned_Mentor = mentor.Name;
    // --------------
    //? Save the updated student document
    await student.save();
    // --------------
    //? Return the updated student document as a JSON response
    res.json(student);
    // --------------
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ----------------------------------

//? 6)Write an API to show the previously assigned mentor for a particular student.

router.get("/previous-mentor/:id", async (req, res) => {
  try {
    // --------------
    //? Extract the student ID from the URL parameter
    const studentId = req.params.id;
    // --------------
    //? Check if the student ID is provided
    if (!studentId) {
      return res.status(400).json({ message: "Student ID is required" });
    }
    // --------------
    //? Find the student by ID
    const student = await Student.findById(studentId);
    // --------------
    //? Check if the student exists
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    // --------------
    //? Retrieve the previously assigned mentor for the student
    const Mentor_Name = student.AssignedMentor;
    // --------------
    //? Find the previously assigned Mentor
    const previousMentor = await Mentor.find({
      Name: Mentor_Name,
    });
    // --------------
    //? Check if the previously assigned mentor exists
    if (!previousMentor) {
      return res
        .status(404)
        .json({ message: "Previously assigned mentor not found" });
    }
    // --------------
    //? Response Student and the previous Mentor
    const response = {
      Student_Name: `${student.FirstName} ${student.LastName}`,
      Previous_Assigned_Mentor: previousMentor[0].Name,
    };
    // --------------
    //? Return the previously assigned mentor as a JSON response
    res.json(response);
    // --------------
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ----------------------------------
const StudentRouter = router;
module.exports = StudentRouter;
// ----------------------------------
