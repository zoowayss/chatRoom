import request from '../utils/request'

// QR Code 相关接口
export const qrCodeApi = {
  // 获取二维码
  getQrCode: () => request('/api/qrcode/generate', {
    method: 'GET'
  }),
  
  // 检查二维码状态
  checkQrCodeStatus: (qrCodeId) => request(`/api/qrcode/check/${qrCodeId}`, {
    method: 'GET'
  })
}

// 聊天相关接口
export const chatApi = {
  // 这里可以添加其他 HTTP 请求的接口
  // WebSocket 连接不需要在这里处理
}

// 可以继续添加其他模块的 API 