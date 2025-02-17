package com.example.chat.model;

import lombok.Data;

@Data
public class ChatMessage {
    private String sender;
    private String content;

    public MessageType type;

    public enum MessageType {
        CHAT,
        JOIN,
        LEAVE

    }

} 