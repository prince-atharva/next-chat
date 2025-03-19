import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  username: string;
  email: string;
  password?: string;
  image: string;
  isEmailVerified: boolean;
  provider: "google" | "credentials";
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    username: { type: String, default: null },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    image: { type: String },
    isEmailVerified: { type: Boolean, default: false },
    provider: { type: String, enum: ["google", "credentials"], required: true },
  },
  { timestamps: true }
);

UserSchema.pre("save", function (next) {
  if (!this.image) {
    const nameParts = this.name.split(" ");
    const initials = nameParts
      .map((part) => part.charAt(0))
      .join("+");
    this.image = `https://ui-avatars.com/api/?name=${initials}`;
  }
  next();
});

const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export default User;
