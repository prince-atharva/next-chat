import { Request, Response } from "express";
import mongoose from "mongoose";
import Chat, { ChatType, IChat } from "../model/chat.model";

export const getRecentChats = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ message: "Invalid user ID" });
      return;
    }

    const chats = await Chat.find({ participants: userId })
      .populate({
        path: "participants",
        select: "name image",
      })
      .populate({
        path: "lastMessage",
        populate: {
          path: "sender",
          select: "name",
        },
      })
      .sort({ updatedAt: -1 });

    const formattedChats = chats.map((chat) => {
      let otherParticipants = chat.participants?.filter(
        (p: any) => p._id.toString() !== userId
      );

      return {
        _id: chat._id,
        type: chat.type,
        name: chat.type === ChatType.GROUP ? chat.groupName : otherParticipants[0]?.name,
        profilePicture:
          chat.type === ChatType.GROUP
            ? "https://ui-avatars.com/api/?name=g+p"
            : otherParticipants.find((e: any) => e._id !== userId).image,
        lastMessage: chat.lastMessage
          ? {
            content: chat.lastMessage.content,
            sender: chat.type === ChatType.GROUP ? chat.lastMessage.sender.name : null,
            time: chat.lastMessage.createdAt,
          }
          : null,
      };
    });

    res.status(200).json(formattedChats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Create a new chat (One-to-One or Group)
export const createChat = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type, participants, groupName, groupAdmins } = req.body;

    if (!participants || !Array.isArray(participants) || participants.length < 2) {
      res.status(400).json({ message: "At least two participants are required." });
      return;
    }

    if (type === ChatType.GROUP && !groupName) {
      res.status(400).json({ message: "Group name is required for group chat." });
      return;
    }

    const newChat: IChat = new Chat({
      type,
      participants,
      groupName: type === ChatType.GROUP ? groupName : undefined,
      groupAdmins: type === ChatType.GROUP ? groupAdmins : undefined,
      messages: [],
    });

    await newChat.save();
    res.status(201).json(newChat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Get all chats for a specific user
export const getUserChats = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ message: "Invalid user ID" });
      return;
    }

    const chats = await Chat.find({ participants: userId })
      .populate("participants", "name email") // Populate participant details
      .populate("lastMessage") // Populate last message
      .sort({ updatedAt: -1 });

    res.status(200).json(chats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Get a single chat by ID
export const getChatById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { chatId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      res.status(400).json({ message: "Invalid chat ID" });
      return;
    }

    const chat = await Chat.findById(chatId)
      .populate("participants", "name email")
      .populate("messages.sender", "name email");

    if (!chat) {
      res.status(404).json({ message: "Chat not found" });
      return;
    }

    res.status(200).json(chat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};