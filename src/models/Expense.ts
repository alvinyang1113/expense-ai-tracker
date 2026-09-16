import { Schema, model, models, type InferSchemaType } from "mongoose";

const ExpenseSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rawText: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "TWD" },
    category: { type: String, required: true },
    description: { type: String, default: "" },
    type: { type: String, enum: ["expense", "income"], default: "expense" },
    occurredAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export type Expense = InferSchemaType<typeof ExpenseSchema>;

export default models.Expense || model("Expense", ExpenseSchema);
