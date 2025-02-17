// 创建请求工具
const baseURL = import.meta.env.VITE_API_BASE_URL

const request = async (url, options = {}) => {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
  }

  const finalOptions = {
    ...defaultOptions,
    ...options,
  }

  try {
    const response = await fetch(`${baseURL}${url}`, finalOptions)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error('Request failed:', error)
    throw error
  }
}

export default request 