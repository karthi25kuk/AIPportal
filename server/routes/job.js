const express = require("express");
const router = express.Router();
const Job = require("../models/Job");


// POST JOB (Industry)
router.post("/post", async (req,res)=>{
  const job = new Job(req.body);
  await job.save();
  res.json({msg:"Job posted"});
});


// GET ALL JOBS (Students)
router.get("/", async (req,res)=>{
  const jobs = await Job.find();
  res.json(jobs);
});

module.exports = router;
