package com.example.chat.model;

import lombok.Data;

@Data
public class ApiResponse<T> {
    private int code;           // 状态码
    private String message;     // 消息
    private T data;            // 数据

    public static <T> ApiResponse<T> success(T data) {
        ApiResponse<T> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage("success");
        response.setData(data);
        return response;
    }

    public static <T> ApiResponse<T> error(int code, String message) {
        ApiResponse<T> response = new ApiResponse<>();
        response.setCode(code);
        response.setMessage(message);
        return response;
    }
} 