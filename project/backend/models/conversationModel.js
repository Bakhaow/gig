import mongoose from "mongoose";

const conversationSchema = mongoose.Schema({
  participants: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      blocked: { type: Boolean, default: false },
    },
  ],
  lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
  archived: { type: Boolean, default: false },
});

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
