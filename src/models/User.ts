import { Schema, model, models, type InferSchemaType } from "mongoose";

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }
);

export type User = InferSchemaType<typeof UserSchema>;

export default models.User || model("User", UserSchema);
