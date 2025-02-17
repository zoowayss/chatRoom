package com.example.chat.model;

import lombok.Data;

@Data
public class QrCodeInfo {
    private String qrId;      // 二维码唯一标识
    private String content;   // 二维码内容
    private String status;    // 二维码状态：PENDING/SCANNED/CONFIRMED
    private String username;  // 扫码用户信息
} 