import mongoose, { Schema, Document, Types } from "mongoose";

export enum ChatType {
  ONE_TO_ONE = "one-to-one",
  GROUP = "group",
}

export interface IMessage extends Document {
  sender: Types.ObjectId;
  content: string;
  createdAt: Date;
  isDeleted?: boolean;
}

export interface IChat extends Document {
  type: ChatType;
  participants: Types.ObjectId[];
  messages: IMessage[];
  lastMessage?: IMessage;
  groupName?: string;
  groupAdmins?: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const ChatSchema = new Schema<IChat>(
  {
    type: {
      type: String,
      enum: Object.values(ChatType),
      required: true,
    },
    participants: [{ type: Schema.Types.ObjectId, ref: "User", required: true, index: true }],
    messages: [MessageSchema],
    lastMessage: MessageSchema,
    groupName: {
      type: String,
      required: function () {
        return this.type === ChatType.GROUP;
      },
    },
    groupAdmins: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

ChatSchema.index({ participants: 1, updatedAt: -1 });

const Chat = mongoose.models.Chat || mongoose.model<IChat>("Chat", ChatSchema);

export default Chat;
