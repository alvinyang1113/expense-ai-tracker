import type { HydratedDocument } from "mongoose";
import type { User } from "@/models/User";

export function toSafeUser(user: HydratedDocument<User>) {
  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
    role: user.role,
  };
}
