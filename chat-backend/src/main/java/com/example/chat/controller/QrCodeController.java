package com.example.chat.controller;

import com.example.chat.model.QrCodeInfo;
import com.example.chat.model.ChatMessage;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/qrcode")
public class QrCodeController {
    private static final Map<String, QrCodeInfo> qrCodeMap = new ConcurrentHashMap<>();
    private final SimpMessagingTemplate messagingTemplate;

    public QrCodeController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @GetMapping("/generate")
    public QrCodeInfo generateQrCode() {
        QrCodeInfo qrCode = new QrCodeInfo();
        qrCode.setQrId(UUID.randomUUID().toString());
        qrCode.setContent("http://172.31.39.193:5174/scan?qrId=" + qrCode.getQrId());
        qrCode.setStatus("PENDING");
        qrCodeMap.put(qrCode.getQrId(), qrCode);
        return qrCode;
    }

    @GetMapping("/status/{qrId}")  // 添加状态查询接口
    public QrCodeInfo getQrCodeStatus(@PathVariable String qrId) {
        return qrCodeMap.get(qrId);
    }

    @PostMapping("/scan/{qrId}")
    public void scanQrCode(@PathVariable String qrId, @RequestBody Map<String, String> body) {
        QrCodeInfo qrCode = qrCodeMap.get(qrId);
        if (qrCode != null) {
            qrCode.setStatus("CONFIRMED");
            String username = body.get("username");
            qrCode.setUsername(username);
            // 通过WebSocket通知前端二维码已扫描
            messagingTemplate.convertAndSend("/topic/qrcode/" + qrId, qrCode);
            
            // 发送用户加入聊天室的消息
            ChatMessage joinMessage = new ChatMessage();
            joinMessage.setSender(username);
            joinMessage.setType(ChatMessage.MessageType.JOIN);
            joinMessage.setContent(username + " 加入了聊天室");
            messagingTemplate.convertAndSend("/topic/public", joinMessage);
        }
    }

    @PostMapping("/confirm/{qrId}")
    public QrCodeInfo confirmLogin(@PathVariable String qrId) {
        QrCodeInfo qrCode = qrCodeMap.get(qrId);
        if (qrCode != null) {
            qrCode.setStatus("CONFIRMED");
            // 通过WebSocket通知前端登录确认
        }
        return qrCode;
    }
} 