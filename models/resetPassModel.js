const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const resetPassSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    code: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ResetUser", resetPassSchema);
