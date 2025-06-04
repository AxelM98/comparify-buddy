import mongoose from "mongoose";

const AnalysisSchema = new mongoose.Schema(
  {
    products: [
      {
        id: String,
        name: String,
        price: Number,
        similarProducts: Array,
      },
    ],
    timestamp: String,
  },
  {
    _id: true,
    timestamps: true,
  }
);

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  googleId: { type: String },
  displayName: { type: String },
  name: {
    givenName: String,
    familyName: String,
  },
  photos: [
    {
      value: String,
    },
  ],
  savedAnalyses: [AnalysisSchema],
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
