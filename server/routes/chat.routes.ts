import express from "express";
import { createChat, getChatById, getRecentChats, getUserChats } from "../contoller/chat.controller";

const router = express.Router();

router.get("/recent/:userId", getRecentChats); 
router.post("/create", createChat); // Create a new chat
router.get("/user/:userId", getUserChats); // Get all chats for a user
router.get("/:chatId", getChatById); // Get a single chat by ID

export default router;
