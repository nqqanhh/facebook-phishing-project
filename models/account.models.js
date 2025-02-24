import mongoose from "mongoose";

const accountSchema = new mongoose.Schema(
  {
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      require: true,
    },
    phone: {
      type: String,
    },
  },
  { timestamps: true }
);
const AccountModel = mongoose.model("Account", accountSchema);

export default AccountModel;
