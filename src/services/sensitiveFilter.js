// 敏感词过滤服务

/**
 * 简单的敏感词库
 * 注意：这是一个基础版本，实际应用中需要更完善的敏感词库
 */
const SENSITIVE_WORDS = [
  // 政治敏感词
  '反动', '颠覆', '推翻', '政变',
  // 违法违规词
  '赌博', '毒品', '贩毒', '吸毒',
  // 不文明用语
  '脏话', '粗口',
  // 其他不当内容
  '邪教', '恐怖', '暴力',
];

/**
 * 检查文本是否包含敏感词
 * @param {string} text - 要检查的文本
 * @returns {Object} - { hasSensitive: boolean, sensitiveWords: string[] }
 */
export function checkSensitiveWords(text) {
  if (!text || typeof text !== 'string') {
    return { hasSensitive: false, sensitiveWords: [] };
  }
  
  const foundWords = [];
  
  for (const word of SENSITIVE_WORDS) {
    if (text.includes(word)) {
      foundWords.push(word);
    }
  }
  
  return {
    hasSensitive: foundWords.length > 0,
    sensitiveWords: foundWords
  };
}

/**
 * 过滤敏感词（用星号替换）
 * @param {string} text - 要过滤的文本
 * @returns {string} - 过滤后的文本
 */
export function filterSensitiveWords(text) {
  if (!text || typeof text !== 'string') {
    return text;
  }
  
  let filteredText = text;
  
  for (const word of SENSITIVE_WORDS) {
    const replacement = '*'.repeat(word.length);
    const regex = new RegExp(word, 'gi');
    filteredText = filteredText.replace(regex, replacement);
  }
  
  return filteredText;
}

/**
 * 获取敏感词提示信息
 * @returns {string} - 敏感词提示
 */
export function getSensitiveWordMessage() {
  return '请输入合规问题，避免使用敏感词汇。';
}