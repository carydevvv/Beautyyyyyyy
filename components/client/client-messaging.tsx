"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, MessageSquare, Crown } from "lucide-react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  Timestamp,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useNotifications } from "@/hooks/use-notifications";

interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  senderType: "admin" | "customer";
  timestamp: Timestamp;
  conversationId: string;
}

interface ClientMessagingProps {
  clientId: string;
  clientName: string;
}

export function ClientMessaging({
  clientId,
  clientName,
}: ClientMessagingProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [conversationId, setConversationId] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { createNotification } = useNotifications(clientId);

  useEffect(() => {
    // Create or get conversation ID
    const initConversation = async () => {
      const convId = `${clientId}_admin`;
      setConversationId(convId);

      // Check if conversation exists, if not create it
      const conversationRef = doc(db, "conversations", convId);
      const conversationDoc = await getDoc(conversationRef);

      if (!conversationDoc.exists()) {
        await setDoc(conversationRef, {
          id: convId,
          customerName: clientName,
          customerEmail: "", // You might want to pass this as prop
          customerId: clientId,
          lastMessage: "Conversation started",
          lastMessageTime: Timestamp.now(),
          unreadCount: 0,
        });
      }
    };

    initConversation();
  }, [clientId, clientName]);

  useEffect(() => {
    if (conversationId) {
      // Load messages for conversation
      const messagesQuery = query(
        collection(db, "messages"),
        where("conversationId", "==", conversationId),
        orderBy("timestamp", "asc"),
      );

      const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
        const messagesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Message[];
        setMessages(messagesData);
      });

      return unsubscribe;
    }
  }, [conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !conversationId) return;

    try {
      await addDoc(collection(db, "messages"), {
        text: newMessage,
        senderId: clientId,
        senderName: clientName,
        senderType: "customer",
        conversationId: conversationId,
        timestamp: Timestamp.now(),
      });

      // Update conversation last message
      await setDoc(
        doc(db, "conversations", conversationId),
        {
          lastMessage: newMessage,
          lastMessageTime: Timestamp.now(),
          unreadCount: 1, // Admin hasn't read it yet
        },
        { merge: true },
      );

      // Create notification for admin (using the admin UID from the auth hook)
      await createNotification(
        "VJdxemjpYTfR3TAfAQDmZ9ucjxB2", // Admin UID from useAdminAuth
        "New Message",
        `${clientName}: ${newMessage.substring(0, 50)}${newMessage.length > 50 ? "..." : ""}`,
        "message",
        { conversationId, clientId, clientName },
      );

      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Card className="max-w-4xl mx-auto h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MessageSquare className="h-5 w-5" />
          <span>Chat with NailTech</span>
        </CardTitle>
        <CardDescription>
          Get help with your appointments and ask questions
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        {/* Messages */}
        <ScrollArea className="flex-1 pr-4 mb-4">
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Start a conversation with our team!</p>
                <p className="text-sm">
                  We're here to help with any questions about your appointments.
                </p>
              </div>
            )}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.senderType === "customer" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${
                    message.senderType === "customer"
                      ? "flex-row-reverse space-x-reverse"
                      : ""
                  }`}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={
                        message.senderType === "admin"
                          ? "/placeholder-user.jpg"
                          : "/placeholder-user.jpg"
                      }
                    />
                    <AvatarFallback>
                      {message.senderType === "admin" ? (
                        <Crown className="h-4 w-4" />
                      ) : (
                        clientName.charAt(0)
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`px-4 py-2 rounded-lg ${
                      message.senderType === "customer"
                        ? "bg-purple-500 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.senderType === "customer"
                          ? "text-purple-100"
                          : "text-gray-500"
                      }`}
                    >
                      {message.timestamp?.toDate().toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button onClick={sendMessage} disabled={!newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
