<template>
  <div class="home-container container">
    <header class="header">
      <h1 class="title">毛选智慧问答</h1>
      <p class="subtitle">从经典中寻找解决现实问题的智慧</p>
    </header>

    <main class="main-content">
      <!-- 问题输入模块 -->
      <section class="input-section card">
        <div class="input-wrapper">
          <input
            v-model="question"
            type="text"
            placeholder="请输入你的问题（如：如何团结团队？）"
            maxlength="200"
            class="question-input"
            @keyup.enter="submitQuestion"
          />
          <button
            @click="submitQuestion"
            class="btn-primary mobile-touch"
            :disabled="!question.trim()"
          >
            {{ loading ? '正在查找经典智慧...' : '查找毛选智慧' }}
          </button>
        </div>
        
        <!-- 热门问题标签 -->
        <div class="tags-section">
          <span class="tags-label">热门问题：</span>
          <span
            v-for="tag in hotTags"
            :key="tag.id"
            class="tag mobile-touch"
            @click="selectTag(tag)"
          >
            {{ tag.name }}
          </span>
        </div>
      </section>

      <!-- 结果展示区域 -->
      <section v-if="showResult" class="result-section card" :class="{ 'fade-in': !loading }">
        <div v-if="loading" class="loading">
    <div class="loading-text">正在查找经典智慧...</div>
    <div class="loading-dots">
      <span></span><span></span><span></span>
    </div>
  </div>
        
        <div v-else-if="result.error" class="error-message">
          <div class="error-icon">📚</div>
          <p class="error-text">{{ result.error }}</p>
          <div class="tags-section">
            <span class="tags-label">试试这些问题：</span>
            <span
              v-for="tag in hotTags"
              :key="tag.id"
              class="tag mobile-touch"
              @click="selectTag(tag)"
            >
              {{ tag.name }}
            </span>
          </div>
        </div>
        
        <div v-else-if="result.quote" class="result-content">
          <!-- 原文展示 -->
          <div class="quote-section">
            <div class="quote-decoration-top"></div>
            <div class="mao-text vertical-text">
              {{ result.quote }}
            </div>
            <div class="quote-decoration-bottom"></div>
          </div>
          
          <!-- 通俗解读 -->
          <div class="explanation-section">
            <h3 class="section-title">💡 解读</h3>
            <p class="explanation-text">{{ result.explanation }}</p>
          </div>

          <!-- 出处标注 -->
          <div class="source-section">
            <span class="source-label">📖 出处：</span>
            <span class="source-text">{{ result.source }}</span>
          </div>
          

          
          <!-- 互动按钮 -->
          <div class="action-buttons">
            <button 
              @click="collectResult" 
              class="btn-secondary mobile-touch" 
              :class="{ 'active': isCollected }"
              :title="isCollected ? '已收藏' : '收藏此智慧'"
            >
              {{ isCollected ? '❤️ 已收藏' : '🤍 收藏' }}
            </button>
            <button 
              @click="changeQuote" 
              class="btn-secondary mobile-touch"
              title="获取其他匹配内容"
            >
              🔄 换一句匹配
            </button>
            <button 
              @click="shareResult" 
              class="btn-secondary mobile-touch"
              title="分享给朋友"
            >
              📤 分享
            </button>
          </div>
          
          <!-- 用于生成分享卡片的隐藏容器 -->
          <div ref="shareCardContainer" class="share-card-container" style="display: none;">
            <div class="share-card">
              <!-- 红色背景装饰 -->
              <div class="share-card-red-bg"></div>
              <div class="share-card-content-wrapper">
                <!-- 标题 -->
                <div class="share-card-title">
                  有问题问毛选
                </div>
                
                <!-- 分隔线 -->
                <div class="share-card-divider"></div>
                
                <!-- 问题 -->
                <div class="share-card-question">
                  {{ question }}
                </div>
                
                <!-- 分隔线 -->
                <div class="share-card-divider"></div>
                
                <!-- 毛选原文 -->
                <div class="share-card-quote">
                  {{ result.quote }}
                </div>
                
                <!-- 出处 -->
                <div class="share-card-source">
                  <span>信息出处</span>
                  <br>
                  {{ result.source }}
                </div>
                
                <!-- 分隔线 -->
                <div class="share-card-divider"></div>
                
                <!-- 解读 -->
                <div class="share-card-explanation">
                  {{ result.explanation }}
                </div>
                
                <!-- 系统分享标记 -->
                <div class="share-card-system-tag">系统分享</div>
                
                <!-- 底部装饰角 -->
                <div class="corner-bottom-left"></div>
                <div class="corner-bottom-right"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- 历史记录和收藏入口 -->
    <nav class="nav-bottom">
      <router-link to="/collection" class="nav-item mobile-touch">
        <span>收藏</span>
      </router-link>
      <router-link to="/collection?tab=history" class="nav-item mobile-touch">
        <span>历史</span>
      </router-link>
    </nav>

    <!-- 分享弹窗 -->
    <div v-if="showShareModal" class="modal-overlay" @click="closeShareModal">
      <div class="modal-content share-modal" @click.stop>
        <h3 class="modal-title">分享内容</h3>
        <div class="share-image-container">
          <img v-if="shareImageUrl" :src="shareImageUrl" alt="分享卡片" class="share-image" />
          <div v-else class="loading">
            <div class="loading-text">正在生成分享卡片...</div>
            <div class="loading-dots">
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>
        <button 
          v-if="shareImageUrl" 
          @click="downloadImage" 
          class="btn-primary download-button"
          title="下载分享卡片"
        >
          💾 下载分享卡片
        </button>
        <button @click="closeShareModal" class="btn-primary full-width">关闭</button>
      </div>
    </div>

    <!-- 免责声明 -->
    <footer class="footer">
      <p class="disclaimer">免责声明：本产品内容基于《毛泽东选集》公版文本，仅供学习交流使用，不代表任何官方立场。</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { callMaoSelectionAPI, parseAIResponse, getAlternativeQuote } from '@/services/api'
import { checkSensitiveWords, getSensitiveWordMessage } from '@/services/sensitiveFilter'

// 响应式数据
const question = ref('')
const loading = ref(false)
const showResult = ref(false)
const result = reactive({
  quote: '',
  source: '',
  explanation: '',
  error: ''
})
const showShareModal = ref(false)
const shareImageUrl = ref('')
const shareCardContainer = ref(null)

// 热门标签
const hotTags = [
  { id: 1, name: '团队管理', question: '如何做好团队管理？' },
  { id: 2, name: '逆境突破', question: '如何在逆境中突破？' },
  { id: 3, name: '决策方法', question: '如何做出正确的决策？' }
]

// 计算属性
const isCollected = computed(() => {
  const collections = JSON.parse(localStorage.getItem('collections') || '[]')
  return collections.some(item => item.quote === result.quote)
})

// 方法
const selectTag = (tag) => {
  question.value = tag.question
}

const submitQuestion = async () => {
  if (!question.value.trim()) return
  
  // 敏感词过滤
  const { hasSensitive } = checkSensitiveWords(question.value);
  if (hasSensitive) {
    result.error = getSensitiveWordMessage();
    showResult.value = true;
    return;
  }
  
  loading.value = true
  showResult.value = true
  
  try {
    // 调用AI接口获取结果
    const response = await callMaoSelectionAPI(question.value)
    
    // 使用API服务中的解析函数解析响应
    const parsedResult = parseAIResponse(response)
    
    // 更新结果数据
    Object.assign(result, parsedResult)
    
    // 如果有有效结果，保存到历史记录
    if (result.quote) {
      saveToHistory()
    }
  } catch (error) {
    result.error = '获取智慧时出错，请稍后重试'
    console.error('API调用错误:', error)
  } finally {
    loading.value = false
  }
}

// AI接口调用已移至api.js服务文件中

const changeQuote = async () => {
  if (!question.value.trim()) return
  
  loading.value = true
  
  try {
    // 调用获取备选结果的API
    const response = await getAlternativeQuote(question.value)
    
    // 解析响应
    const parsedResult = parseAIResponse(response)
    
    // 更新结果数据
    Object.assign(result, parsedResult)
  } catch (error) {
    result.error = '获取备选结果时出错，请稍后重试'
    console.error('获取备选结果错误:', error)
  } finally {
    loading.value = false
  }
}

const collectResult = () => {
  if (!result.quote) return
  
  const collections = JSON.parse(localStorage.getItem('collections') || '[]')
  
  // 检查是否已收藏
  if (isCollected.value) {
    alert('已收藏此内容')
    return
  }
  
  // 检查收藏数量限制
  if (collections.length >= 10) {
    alert('最多只能收藏10条内容')
    return
  }
  
  // 添加到收藏
  const item = {
    id: Date.now().toString(),
    question: question.value,
    quote: result.quote,
    source: result.source,
    explanation: result.explanation,
    time: new Date().toISOString().split('T')[0]
  }
  
  collections.push(item)
  localStorage.setItem('collections', JSON.stringify(collections))
  alert('收藏成功')
}

const saveToHistory = () => {
  if (!result.quote) return
  
  const history = JSON.parse(localStorage.getItem('history') || '[]')
  
  // 添加到历史记录开头
  const item = {
    id: Date.now().toString(),
    question: question.value,
    quote: result.quote,
    source: result.source,
    explanation: result.explanation,
    time: new Date().toISOString()
  }
  
  history.unshift(item)
  
  // 只保留最近5条记录
  if (history.length > 5) {
    history.splice(5)
  }
  
  localStorage.setItem('history', JSON.stringify(history))
}

const shareResult = async () => {
  if (!result.quote) return
  
  showShareModal.value = true
  shareImageUrl.value = '' // 重置图片URL
  
  try {
    // 等待DOM更新
    await nextTick()
    // 生成分享卡片
    await generateShareCard()
  } catch (error) {
    console.error('生成分享卡片失败:', error)
    alert('生成分享卡片失败，请稍后重试')
  }
}

const generateShareCard = async () => {
  // 导入html2canvas（动态导入以避免不必要的加载）
  const html2canvas = (await import('html2canvas')).default
  
  // 确保容器可见以进行渲染
  const container = shareCardContainer.value
  container.style.display = 'block'
  
  // 使用html2canvas生成图片
  const canvas = await html2canvas(container.querySelector('.share-card'), {
    scale: 2, // 提高清晰度
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff'
  })
  
  // 将canvas转换为图片URL
  shareImageUrl.value = canvas.toDataURL('image/png')
  
  // 再次隐藏容器
  container.style.display = 'none'
}

const downloadImage = () => {
  if (!shareImageUrl.value) return
  
  // 创建下载链接
  const link = document.createElement('a')
  link.href = shareImageUrl.value
  link.download = `毛选智慧_${Date.now()}.png`
  
  // 触发下载
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  // 显示下载成功提示
  alert('分享卡片已下载')
}

const closeShareModal = () => {
  showShareModal.value = false
  shareImageUrl.value = '' // 清空图片URL
}

const containsSensitiveWords = (text) => {
  // 简单的敏感词过滤
  const sensitiveWords = ['违法', '暴力', '反动']
  return sensitiveWords.some(word => text.includes(word))
}

// 组件挂载时检查URL参数
onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search)
  const q = urlParams.get('q')
  if (q) {
    question.value = decodeURIComponent(q)
    submitQuestion()
  }
})
</script>

<style scoped>
.home-container {
  max-width: 800px;
  margin: 0 auto;
  padding: var(--spacing-md);
}

.header {
  text-align: center;
  margin-bottom: var(--spacing-lg);
  margin-top: var(--spacing-md);
}

.title {
  color: var(--primary-color);
  font-size: var(--font-size-xlarge);
  margin-bottom: var(--spacing-xs);
}

.subtitle {
  color: var(--light-text);
  font-size: var(--font-size-medium);
}

.input-section {
  margin-bottom: var(--spacing-md);
}

.input-wrapper {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
}

.question-input {
  flex: 1;
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-medium);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
}

.tags-section {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.tags-label {
  font-size: var(--font-size-small);
  color: var(--light-text);
}

.result-section {
  margin-bottom: var(--spacing-xl);
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.5s ease;
}

.result-section.fade-in {
  opacity: 1;
  transform: translateY(0);
}

.result-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.quote-section {
  margin: var(--spacing-md) 0;
  position: relative;
}

.quote-decoration-top,
.quote-decoration-bottom {
  height: 1px;
  background: linear-gradient(to right, transparent, var(--primary-color), transparent);
  margin: var(--spacing-sm) 0;
  opacity: 0.3;
}

/* 毛选原文样式 */
.mao-text {
  background-color: var(--secondary-color);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
  font-family: 'SimSun', serif;
  line-height: 1.8;
  position: relative;
  box-shadow: inset 0 0 10px rgba(168, 7, 26, 0.1);
  transition: all 0.3s ease;
}

.mao-text:hover {
  box-shadow: inset 0 0 15px rgba(168, 7, 26, 0.15);
}

.vertical-text {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  padding: var(--spacing-lg) var(--spacing-sm);
  font-size: var(--font-size-large);
  letter-spacing: 2px;
  margin: 0 auto;
  max-height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  background: linear-gradient(135deg, var(--secondary-color), #fff9e6);
  border: 1px solid #e0d8c0;
}

.source-section {
  font-size: var(--font-size-small);
  color: var(--light-text);
  text-align: right;
  margin: var(--spacing-sm) 0 var(--spacing-md);
  font-style: italic;
  padding-right: var(--spacing-md);
}

.source-label {
  font-weight: 500;
}

.section-title {
  font-size: var(--font-size-medium);
  color: var(--primary-color);
  margin-bottom: var(--spacing-xs);
  padding-bottom: var(--spacing-xs);
  border-bottom: 1px solid var(--primary-color);
  border-bottom-width: 2px;
  border-bottom-left-radius: 4px;
  display: inline-block;
}

.explanation-text {
  line-height: 1.8;
  font-size: var(--font-size-medium);
  padding: var(--spacing-sm);
  background-color: rgba(168, 7, 26, 0.05);
  border-radius: var(--border-radius-sm);
  border-left: 3px solid var(--primary-color);
}

.action-buttons {
  display: flex;
  gap: var(--spacing-sm);
  justify-content: center;
  margin-top: var(--spacing-md);
  flex-wrap: wrap;
}

.action-buttons button {
  min-width: 100px;
  transition: all 0.3s ease;
}

.action-buttons button.active {
  background-color: var(--primary-color);
  color: white;
}

.error-message {
  text-align: center;
  color: var(--light-text);
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
}

.error-icon {
  font-size: 48px;
  opacity: 0.5;
}

.error-text {
  font-size: var(--font-size-medium);
  margin: 0;
}

/* Loading styles */
.loading {
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--primary-color);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
}

.loading-text {
  font-size: var(--font-size-medium);
  font-weight: 500;
}

.loading-dots {
  display: flex;
  gap: 8px;
}

.loading-dots span {
  width: 8px;
  height: 8px;
  background-color: var(--primary-color);
  border-radius: 50%;
  animation: loading 1.4s infinite ease-in-out both;
}

.loading-dots span:nth-child(1) { animation-delay: -0.32s; }
.loading-dots span:nth-child(2) { animation-delay: -0.16s; }

@keyframes loading {
  0%, 80%, 100% { 
    transform: scale(0);
    opacity: 0.3;
  }
  40% { 
    transform: scale(1);
    opacity: 1;
  }
}

.nav-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: var(--spacing-xs) 0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  background-color: white;
  display: flex;
  justify-content: space-around;
}

.nav-item {
  flex: 1;
  text-align: center;
  padding: var(--spacing-sm) 0;
  text-decoration: none;
  color: #333;
  font-weight: 500;
}

.nav-item:active {
  background-color: #f5f5f5;
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  overflow-y: auto;
}

.modal-content {
  background-color: white;
  padding: var(--spacing-md);
  border-radius: var(--border-radius-lg);
  width: 90%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin: 20px;
}

.modal-title {
  text-align: center;
  color: var(--primary-color);
  margin-bottom: var(--spacing-xs);
}

/* 分享弹窗样式 */
.share-modal {
  max-width: 500px;
}

.share-image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  background-color: #f8f8f8;
  border-radius: var(--border-radius-md);
  overflow: hidden;
}

.share-image {
  max-width: 100%;
  max-height: 600px;
  border-radius: var(--border-radius-sm);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.download-button {
  background-color: #28a745;
  color: white;
  margin-top: var(--spacing-sm);
}

.download-button:hover {
  background-color: #218838;
}

/* 分享卡片样式（用于生成图片） */
.share-card-container {
  position: absolute;
  left: -9999px;
  top: -9999px;
  width: 500px;
}

.share-card {
  width: 500px;
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

/* 红色背景 */
.share-card-red-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #a8071a;
  z-index: 1;
}

/* 内容包装器 */
.share-card-content-wrapper {
  position: relative;
  background-color: #ffffff;
  border-radius: 12px;
  margin: 15px;
  padding: 25px;
  z-index: 2;
  min-height: 600px;
}

/* 装饰角 */
.share-card-content-wrapper::before,
.share-card-content-wrapper::after,
.share-card-content-wrapper .corner-bottom-left,
.share-card-content-wrapper .corner-bottom-right {
  position: absolute;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #a8071a;
  z-index: -1;
}

.share-card-content-wrapper::before {
  content: '';
  top: -10px;
  left: -10px;
}

.share-card-content-wrapper::after {
  content: '';
  top: -10px;
  right: -10px;
}

.share-card-content-wrapper .corner-bottom-left {
  bottom: -10px;
  left: -10px;
}

.share-card-content-wrapper .corner-bottom-right {
  bottom: -10px;
  right: -10px;
}

/* 标题样式 */
.share-card-title {
  text-align: center;
  font-size: 32px;
  font-weight: bold;
  color: #a8071a;
  margin-bottom: 15px;
  letter-spacing: 1px;
}

/* 分隔线 */
.share-card-divider {
  height: 1px;
  background: linear-gradient(to right, transparent, #a8071a, transparent);
  margin: 15px 0;
  opacity: 0.3;
}

/* 问题样式 */
.share-card-question {
  font-size: 28px;
  font-weight: bold;
  color: #a8071a;
  text-align: center;
  margin: 20px 0;
  line-height: 1.4;
}

/* 毛选原文样式 */
.share-card-quote {
  font-family: 'SimSun', serif;
  font-size: 18px;
  line-height: 1.8;
  color: #000000;
  padding: 20px;
  text-align: justify;
  margin: 20px 0;
}

/* 出处样式 */
.share-card-source {
  text-align: right;
  font-size: 16px;
  color: #666666;
  margin: 15px 0;
  padding-right: 10px;
}

/* 解读样式 */
.share-card-explanation {
  font-size: 16px;
  line-height: 1.6;
  color: #333333;
  margin: 20px 0;
  text-align: justify;
}

/* 系统分享标记 */
.share-card-system-tag {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #a8071a;
  color: white;
  padding: 5px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

/* 移动端响应式调整 */
@media (max-width: 768px) {
  .share-card-container {
    width: 100%;
    max-width: 400px;
  }
  
  .share-card {
    width: 100%;
  }
  
  .share-card-content-wrapper {
    margin: 10px;
    padding: 20px;
    min-height: 500px;
  }
  
  .share-card-title {
    font-size: 24px;
  }
  
  .share-card-question {
    font-size: 22px;
  }
  
  .share-card-quote {
    font-size: 16px;
    padding: 15px;
  }
  
  .share-card-explanation {
    font-size: 15px;
  }
  
  .share-modal {
    width: 95%;
    margin: 10px;
  }
}

.full-width {
  width: 100%;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .home-container {
    padding: var(--spacing-sm);
  }
  
  .input-wrapper {
    flex-direction: column;
  }
  
  .question-input {
    padding: var(--spacing-sm);
    font-size: var(--font-size-medium);
  }
  
  .action-buttons {
    flex-wrap: wrap;
    gap: var(--spacing-sm);
  }
  
  .action-buttons button {
    flex: 1;
    min-width: auto;
    padding: var(--spacing-sm);
  }
  
  .tags-section {
    flex-direction: row;
    align-items: center;
    gap: var(--spacing-xs);
    overflow-x: auto;
    white-space: nowrap;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    -ms-overflow-style: none;
    padding-bottom: 5px;
  }
  
  .tags-section::-webkit-scrollbar {
    display: none;
  }
  
  .tag {
    display: inline-block;
    flex-shrink: 0;
    margin-right: 8px;
    padding: 6px 12px;
    font-size: 14px;
    background-color: #f5f5f5;
    border-radius: 16px;
    border: 1px solid #e0e0e0;
    color: #333;
    transition: all 0.3s ease;
  }
  
  .tag:hover, .tag:active {
    background-color: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
  }
  
  .vertical-text {
    writing-mode: horizontal-tb;
    padding: var(--spacing-md);
    min-height: auto;
    max-height: 300px;
    font-size: var(--font-size-medium);
    overflow-wrap: break-word;
  }
  
  .quote-section {
    margin: var(--spacing-sm) 0;
  }
  
  .modal-content {
    width: 95%;
    padding: var(--spacing-sm);
  }
  
  .qrcode-placeholder {
    width: 150px;
    height: 150px;
  }
  
  .nav-bottom {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100;
    padding: var(--spacing-xs) 0;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
    background-color: white;
    display: flex;
    justify-content: space-around;
  }
  
  .nav-item {
    flex: 1;
    text-align: center;
    padding: var(--spacing-sm) 0;
    text-decoration: none;
    color: #333;
    font-weight: 500;
  }
  
  .nav-item:active {
    background-color: #f5f5f5;
  }
  
  .footer {
    margin-bottom: 60px; /* 为底部导航留出空间 */
  }
}

/* 小屏幕适配 */
@media (max-width: 480px) {
  .title {
    font-size: var(--font-size-large);
  }
  
  .subtitle {
    font-size: var(--font-size-small);
  }
  
  .input-section,
  .result-section {
    padding: var(--spacing-sm);
  }
  
  .source-section {
    font-size: var(--font-size-small);
    padding-right: 0;
  }
  
  .explanation-text {
    padding: var(--spacing-xs);
    font-size: var(--font-size-small);
  }
  
  /* 小屏幕标签样式优化 */
  .tags-section {
    gap: 6px;
  }
  
  .tag {
    padding: 5px 10px;
    font-size: 12px;
    margin-right: 6px;
  }
}
</style>