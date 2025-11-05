// AI接口服务 - 使用阿里云百炼平台的OpenAI兼容模式

// 导入必要的依赖
import OpenAI from "openai";

// 初始化OpenAI客户端 - 阿里云百炼兼容模式
// 注意：在浏览器环境中使用API密钥存在安全风险
const openai = new OpenAI({
  apiKey: "sk-e9f3a7f242a94e9aac47ed2db6aa06d3", // 用户提供的百炼API密钥
  baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
  dangerouslyAllowBrowser: true // 允许在浏览器环境中运行
});

/**
 * 调用阿里云百炼API获取毛选智慧匹配结果
 * @param {string} question - 用户问题
 * @returns {Promise<string>} AI返回的匹配结果
 */
export const callMaoSelectionAPI = async (question) => {
  try {
    // 构建AI提示词模板
    const prompt = `请严格从《毛泽东选集》1-4卷原文中，找1句最匹配用户问题的段落，按以下格式返回：
原文：[完整原文，不修改]
出处：[如《实践论》人民出版社1991年版Pxx]
解读：[30-50字通俗解释，关联用户问题]
若无匹配，返回"暂未找到对应的智慧，试试换个问题吧～"
用户问题：${question}`;
    
    console.log('AI提示词:', prompt);
    
    // 使用百炼平台的OpenAI兼容接口调用
    const completion = await openai.chat.completions.create({
      model: "qwen-plus", // 使用qwen-plus模型
      messages: [
        {
          role: "system",
          content: "你是一个毛泽东思想研究专家，精通《毛泽东选集》内容，能够准确引用原文并给出通俗解释。"
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });
    
    // 提取AI回复内容
    const aiResponse = completion.choices[0].message.content.trim();
    console.log('AI原始响应:', aiResponse);
    return aiResponse;
  } catch (error) {
    console.error('调用AI API失败:', error);
    // 如果API调用失败，返回默认提示
    return '暂未找到对应的智慧，试试换个问题吧～';
  }
};

/**
 * 解析AI响应内容
 * @param {string} response - AI返回的原始响应
 * @returns {Object} 解析后的对象，包含原文、出处和解读
 */
export const parseAIResponse = (response) => {
  // 检查是否为默认提示
  if (response.includes('暂未找到对应的智慧')) {
    return {
      quote: '',
      source: '',
      explanation: response,
      error: response
    }
  }
  
  // 解析格式规范的响应
  const originalTextMatch = response.match(/原文：([\s\S]*?)(?=出处：)/);
  const sourceMatch = response.match(/出处：([\s\S]*?)(?=解读：)/);
  const interpretationMatch = response.match(/解读：([\s\S]*)/);
  
  return {
    quote: originalTextMatch ? originalTextMatch[1].trim() : '',
    source: sourceMatch ? sourceMatch[1].trim() : '',
    explanation: interpretationMatch ? interpretationMatch[1].trim() : response,
    error: ''
  }
};

/**
 * 获取更多匹配结果（换一句功能）
 * @param {string} question - 用户问题
 * @returns {Promise<string>} AI返回的新匹配结果
 */
export const getAlternativeQuote = async (question) => {
  try {
    // 构建专门的提示词，要求提供不同的毛选原文
    const prompt = `请从《毛泽东选集》1-4卷中找1句与用户问题相关但不同于上一次回答的段落，按以下格式返回：
原文：[完整原文，不修改]
出处：[如《实践论》人民出版社1991年版Pxx]
解读：[30-50字通俗解释，关联用户问题]
用户问题：${question}`;
    
    // 使用百炼平台的OpenAI兼容接口调用
    const completion = await openai.chat.completions.create({
      model: "qwen-plus",
      messages: [
        {
          role: "system",
          content: "你是一个毛泽东思想研究专家，精通《毛泽东选集》内容，请提供与用户问题相关但不同于之前回答的内容。"
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8, // 稍微提高随机性，更容易获得不同结果
      max_tokens: 500
    });
    
    return completion.choices[0].message.content.trim();
  } catch (error) {
    console.error('获取备选结果失败:', error);
    return '暂未找到其他对应的智慧，试试换个问题吧～';
  }
};