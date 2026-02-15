const express = require("express");
const router = express.Router();
const Application = require("../models/Application");


// APPLY JOB
router.post("/apply", async (req,res)=>{
  const app = new Application(req.body);
  await app.save();
  res.json({msg:"Applied, waiting college approval"});
});


// COLLEGE VIEW PENDING
router.get("/college/:college", async (req,res)=>{
  const apps = await Application.find({
    collegeName:req.params.college,
    status:"pending"
  }).populate("studentId","name email");

  res.json(apps);
});


// APPROVE
router.put("/approve/:id", async (req,res)=>{
  await Application.findByIdAndUpdate(req.params.id,{
    status:"approved"
  });
  res.json({msg:"Approved"});
});


// REJECT
router.put("/reject/:id", async (req,res)=>{
  await Application.findByIdAndUpdate(req.params.id,{
    status:"rejected"
  });
  res.json({msg:"Rejected"});
});


// INDUSTRY VIEW APPROVED
router.get("/approved", async (req,res)=>{
  const apps = await Application.find({status:"approved"})
    .populate("studentId","name email")
    .populate("jobId","title companyName");

  res.json(apps);
});

module.exports = router;
