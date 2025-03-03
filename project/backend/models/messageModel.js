import mongoose from "mongoose";

const messageSchema = mongoose.Schema(
  {
    content: { type: String, required: true },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    offer: { type: mongoose.Schema.Types.ObjectId, ref: "Offer" }, // null for general chats
    attachments: [
      {
        url: String,
        type: { type: String, enum: ["image", "doc"] },
      },
    ],
    encrypted: { type: Boolean, default: false },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
