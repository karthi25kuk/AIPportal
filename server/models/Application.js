const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  studentId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  },
  jobId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Job"
  },
  collegeName:String,
  status:{
    type:String,
    enum:["pending","approved","rejected"],
    default:"pending"
  }
});

module.exports = mongoose.model("Application",applicationSchema);
