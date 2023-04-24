const express = require("express");
const Mentor = require("../Models/Mentor");
const Student = require("../Models/Student");
const mongoose = require("mongoose");
const router = express.Router();
// ----------------------------------

//? 1) Write API to create Mentor.

router.post("/create-mentor", async (req, res) => {
  try {
    // --------------
    //? mentor document from the request body
    const Mentors = new Mentor({
      Name: req.body.Name,
      Experience: req.body.Experience,
      Expertise: req.body.Expertise,
    });
    // --------------
    //? Save the mentor document to the database
    const savedMentor = await Mentors.save();
    const response = {
      Mentor_Name: savedMentor.Name,
      Mentor_Experience: savedMentor.Experience,
      Mentor_Expertise: savedMentor.Expertise,
    };
    // --------------
    //? Send the saved mentor document as a JSON response
    res.status(201).json(response);
    // --------------
  } catch (err) {
    //? If any errors, occur during mentor creation
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------

//? 3) Write API to Assign a student to Mentor
//? (i) Select one mentor and Add multiple Student.

router.post("/assign-students/:id", async (req, res) => {
  try {
    // --------------
    const mentorId = req.params.id;
    const { studentIds } = req.body;
    // --------------
    //? Convert mentorId to MongoDB ObjectID
    const mentorObjectId = new mongoose.Types.ObjectId(mentorId);
    // --------------
    //? Convert studentIds to MongoDB ObjectIDs
    const studentObjectIds = studentIds.map(
      (id) => new mongoose.Types.ObjectId(id)
    );
    // --------------
    //? Find the mentor by ID
    const mentor = await Mentor.findOne({ _id: mentorObjectId });
    // --------------
    //? If mentor not found, return error
    if (!mentor) {
      return res.status(404).json({ error: "Mentor not found" });
    }
    // --------------
    //? Add students to mentor's students array
    const Students_Name = await Student.find({
      _id: { $in: studentObjectIds },
    });
    // console.log(Students_Name);
    // --------------
    //? Mapping Students Name
    const Assigned_Students = Students_Name.map((Find_Student) => {
      return `${Find_Student.FirstName} ${Find_Student.LastName}`;
    });
    // console.log(Assigned_Students);
    // --------------
    //? Pushing Assigned Students
    mentor.Students.push(...Assigned_Students);
    // --------------
    //? Update mentor document in the database
    await mentor.save();
    // --------------
    //? Update the mentor field in each student
    await Student.updateMany(
      { _id: { $in: studentObjectIds } },
      { $set: { AssignedMentor: mentor.Name } }
    );
    // --------------
    //? Return Response
    const response = {
      Mentor_Name: mentor.Name,
      Expertise: mentor.Expertise,
      Experience: mentor.Experience,
      Assigned_Students: mentor.Students,
    };
    res
      .status(200)
      .json({ message: "Students assigned to mentor successfully", response });
    // --------------
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ----------------------------------

//? 5) Write API to show all students for a particular mentor.

router.get("/mentor-students/:id", async function (req, res) {
  try {
    // --------------
    //? Get MentorId from Url Params
    const MentorId = req.params.id;
    // --------------
    //? Find the mentor by ID
    const Mentor_and_Students = await Mentor.findById(MentorId);
    // --------------
    //? Response Mentor and their Students
    res.status(201).json(Mentor_and_Students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ----------------------------------
const MentorRouter = router;
module.exports = MentorRouter;
// ----------------------------------
