<template>
  <div class="collection-container container">
    <!-- 删除确认弹窗 -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="cancelDelete">
      <div class="modal-content" @click.stop>
        <h3 class="modal-title">确认删除</h3>
        <p class="modal-message">确定要删除这条{{ deleteType === 'collection' ? '收藏' : '历史记录' }}吗？</p>
        <div class="modal-actions">
          <button @click="confirmDelete" class="btn-primary delete-confirm">确定删除</button>
          <button @click="cancelDelete" class="btn-secondary delete-cancel">取消</button>
        </div>
      </div>
    </div>
    <header class="header">
      <button @click="goBack" class="back-button mobile-touch" title="返回首页">
        <span class="back-icon">←</span>
        <span class="back-text">返回</span>
      </button>
      <h1 class="title">我的收藏</h1>
    </header>

    <!-- 标签切换 -->
    <div class="tabs">
      <button
        :class="['tab-button mobile-touch', { active: activeTab === 'collections' }]"
        @click="activeTab = 'collections'"
        title="查看收藏内容"
      >
        📚 收藏
      </button>
      <button
        :class="['tab-button mobile-touch', { active: activeTab === 'history' }]"
        @click="activeTab = 'history'"
        title="查看历史记录"
      >
        🕒 历史
      </button>
    </div>

    <main class="main-content">
      <!-- 收藏内容 -->
      <div v-if="activeTab === 'collections'" class="content-list">
        <div v-if="collections.length === 0" class="empty-state">
          <div class="empty-icon">📖</div>
          <p>暂无收藏内容</p>
          <router-link to="/" class="btn-primary">去提问</router-link>
        </div>
        
        <transition-group name="list" tag="div">
          <div
            v-for="item in collections"
            :key="item.id"
            class="content-item card"
          >
            <div class="item-header">
              <div class="item-question">
                <span class="question-label">💡 问题：</span>
                <span>{{ item.question }}</span>
              </div>
              <button
                @click="deleteCollection(item.id)"
                class="btn-secondary delete-button"
                title="删除收藏"
              >
                ❌
              </button>
            </div>
            
            <div class="mao-text" :title="item.quote">
              {{ item.quote }}
            </div>
            
            <div class="item-source">
              <span class="source-label">📖 出处：</span>
              <span class="source-text">{{ item.source }}</span>
            </div>
            
            <div class="item-explanation">
              <span class="explanation-label">💬 解读：</span>
              <span>{{ item.explanation }}</span>
            </div>
            
            <div class="item-info">
              <span class="item-time" :title="item.time">收藏于 {{ item.time }}</span>
            </div>
          </div>
        </transition-group>
      </div>

      <!-- 历史记录内容 -->
      <div v-else-if="activeTab === 'history'" class="content-list">
        <div v-if="history.length === 0" class="empty-state">
          <div class="empty-icon">🕒</div>
          <p>暂无历史记录</p>
          <router-link to="/" class="btn-primary">去提问</router-link>
        </div>
        
        <transition-group name="list" tag="div">
          <div
            v-for="item in history"
            :key="item.id"
            class="content-item card"
          >
            <div class="item-header">
              <div class="item-question">
                <span class="question-label">💡 问题：</span>
                <span>{{ item.question }}</span>
              </div>
              <button
                @click="deleteHistory(item.id)"
                class="btn-secondary delete-button"
                title="删除历史记录"
              >
                ❌
              </button>
            </div>
            
            <div class="mao-text" :title="item.quote">
              {{ item.quote }}
            </div>
            
            <div class="item-source">
              <span class="source-label">📖 出处：</span>
              <span class="source-text">{{ item.source }}</span>
            </div>
            
            <div class="item-explanation">
              <span class="explanation-label">💬 解读：</span>
              <span>{{ item.explanation }}</span>
            </div>
            
            <div class="item-info">
              <span class="item-time" :title="item.time">{{ formatTime(item.time) }}</span>
            </div>
          </div>
        </transition-group>
      </div>
    </main>

    <!-- 免责声明 -->
    <footer class="footer">
      <p class="disclaimer">免责声明：本产品内容基于《毛泽东选集》公版文本，仅供学习交流使用，不代表任何官方立场。</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const activeTab = ref('collections')
const collections = ref([])
const history = ref([])
const showDeleteModal = ref(false)
const deleteItemId = ref(null)
const deleteType = ref('') // 'collection' 或 'history'

// 返回首页
const goBack = () => {
  router.push('/')
}

// 加载数据
const loadData = () => {
  // 加载收藏数据
  const collectionsData = localStorage.getItem('collections')
  if (collectionsData) {
    collections.value = JSON.parse(collectionsData)
  }
  
  // 加载历史数据
  const historyData = localStorage.getItem('history')
  if (historyData) {
    history.value = JSON.parse(historyData)
  }
}

// 删除收藏
const deleteCollection = (id) => {
  deleteItemId.value = id
  deleteType.value = 'collection'
  showDeleteModal.value = true
}

// 删除历史记录
const deleteHistory = (id) => {
  deleteItemId.value = id
  deleteType.value = 'history'
  showDeleteModal.value = true
}

// 确认删除
const confirmDelete = () => {
  if (deleteType.value === 'collection') {
    collections.value = collections.value.filter(item => item.id !== deleteItemId.value)
    localStorage.setItem('collections', JSON.stringify(collections.value))
  } else if (deleteType.value === 'history') {
    history.value = history.value.filter(item => item.id !== deleteItemId.value)
    localStorage.setItem('history', JSON.stringify(history.value))
  }
  
  // 关闭弹窗
  showDeleteModal.value = false
  deleteItemId.value = null
  deleteType.value = ''
}

// 取消删除
const cancelDelete = () => {
  showDeleteModal.value = false
  deleteItemId.value = null
  deleteType.value = ''
}

// 格式化时间
const formatTime = (timeStr) => {
  const date = new Date(timeStr)
  const now = new Date()
  const diff = now - date
  
  // 小于1分钟
  if (diff < 60 * 1000) {
    return '刚刚'
  }
  
  // 小于1小时
  if (diff < 60 * 60 * 1000) {
    return Math.floor(diff / (60 * 1000)) + '分钟前'
  }
  
  // 小于24小时
  if (diff < 24 * 60 * 60 * 1000) {
    return Math.floor(diff / (60 * 60 * 1000)) + '小时前'
  }
  
  // 大于24小时
  return date.toLocaleDateString('zh-CN')
}

// 监听URL参数
watch(
  () => route.query.tab,
  (newTab) => {
    if (newTab === 'history') {
      activeTab.value = 'history'
    } else {
      activeTab.value = 'collections'
    }
  },
  { immediate: true }
)

// 监听数据变化，自动保存
watch(
  collections,
  (newVal) => {
    localStorage.setItem('collections', JSON.stringify(newVal))
  },
  { deep: true }
)

watch(
  history,
  (newVal) => {
    localStorage.setItem('history', JSON.stringify(newVal))
  },
  { deep: true }
)

// 组件挂载时加载数据
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.collection-container {
  max-width: 800px;
  margin: 0 auto;
  padding: var(--spacing-md);
  min-height: 100vh;
  background-color: var(--background-color);
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-md);
  margin-top: var(--spacing-md);
}

.back-button {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  background: none;
  border: none;
  color: var(--primary-color);
  font-size: var(--font-size-medium);
  margin-right: var(--spacing-md);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  transition: all 0.3s ease;
  cursor: pointer;
}

.back-button:hover {
  background-color: rgba(168, 7, 26, 0.1);
  transform: translateX(-2px);
}

.title {
  color: var(--primary-color);
  font-size: var(--font-size-xlarge);
}

.tabs {
  display: flex;
  background-color: white;
  border-radius: var(--border-radius-md);
  margin-bottom: var(--spacing-md);
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.tab-button {
  flex: 1;
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: transparent;
  color: var(--text-color);
  font-size: var(--font-size-medium);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.tab-button:hover:not(.active) {
  background-color: var(--secondary-color);
}

.tab-button.active {
  background-color: var(--primary-color);
  color: white;
  font-weight: 500;
}

.content-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.content-item {
  padding: var(--spacing-md);
  transition: all 0.3s ease;
  overflow: hidden;
}

.content-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-sm);
}

.item-question {
  font-weight: 500;
  margin-bottom: var(--spacing-sm);
  color: var(--text-color);
  flex: 1;
  margin-right: var(--spacing-sm);
  word-break: break-word;
  padding-right: 24px;
}

.question-label {
  color: var(--primary-color);
  font-weight: 600;
}

.mao-text {
  background-color: var(--secondary-color);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
  font-family: 'SimSun', serif;
  line-height: 1.8;
  margin-bottom: var(--spacing-sm);
  box-shadow: inset 0 0 10px rgba(168, 7, 26, 0.1);
  position: relative;
  word-break: break-word;
  transition: all 0.3s ease;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.mao-text:hover {
  box-shadow: inset 0 0 15px rgba(168, 7, 26, 0.15);
  transform: scale(1.01);
}

.item-source {
  font-size: var(--font-size-small);
  color: var(--light-text);
  text-align: right;
  margin-bottom: var(--spacing-sm);
  font-style: italic;
}

.item-explanation {
  margin-bottom: var(--spacing-sm);
  line-height: 1.6;
  padding: var(--spacing-sm);
  background-color: rgba(168, 7, 26, 0.05);
  border-radius: var(--border-radius-sm);
  border-left: 3px solid var(--primary-color);
  word-break: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.explanation-label {
  font-weight: 600;
  color: var(--primary-color);
}

.item-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--font-size-small);
  color: var(--light-text);
}

.delete-button {
  color: #d9534f;
  border-color: #d9534f;
  background-color: transparent;
  padding: 4px 8px;
  border-radius: var(--border-radius-sm);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.delete-button:hover {
  background-color: #f9f2f4;
  transform: scale(1.05);
}

.empty-state {
  text-align: center;
  padding: var(--spacing-xl);
  background-color: white;
  border-radius: var(--border-radius-lg);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
}

.empty-icon {
  font-size: 64px;
  opacity: 0.5;
  margin-bottom: var(--spacing-sm);
}

.empty-state p {
  margin-bottom: var(--spacing-md);
  color: var(--light-text);
  font-size: var(--font-size-medium);
}

/* 移动端响应式设计 */
.mobile-touch {
  -webkit-tap-highlight-color: transparent;
}

@media (max-width: 768px) {
  .collection-container {
    padding: var(--spacing-sm);
    margin: 0;
    max-width: 100%;
  }
  
  .header {
    margin-top: var(--spacing-sm);
    margin-bottom: var(--spacing-sm);
  }
  
  .back-button {
    padding: var(--spacing-xs);
    margin-right: var(--spacing-sm);
  }
  
  .back-text {
    display: none;
  }
  
  .title {
    font-size: var(--font-size-large);
  }
  
  .tabs {
    margin-bottom: var(--spacing-sm);
  }
  
  .tab-button {
    padding: var(--spacing-xs) var(--spacing-sm);
    font-size: var(--font-size-small);
  }
  
  .content-list {
    gap: var(--spacing-sm);
  }
  
  .content-item {
    padding: var(--spacing-sm);
  }
  
  .item-question, .item-explanation, .mao-text {
    -webkit-line-clamp: 3;
  }
  
  .empty-state {
    padding: var(--spacing-lg) var(--spacing-sm);
  }
  
  .empty-icon {
    font-size: 48px;
  }
}

@media (max-width: 480px) {
  .tab-button {
    font-size: var(--font-size-xs);
    gap: 2px;
  }
  
  .item-info {
    font-size: var(--font-size-xs);
  }
}

/* 列表动画 */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.list-move {
  transition: transform 0.5s ease;
}

.list-leave-active {
  position: absolute;
  width: calc(100% - var(--spacing-md) * 2);
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
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.modal-title {
  text-align: center;
  color: var(--primary-color);
  margin-bottom: var(--spacing-xs);
  font-size: var(--font-size-large);
}

.modal-message {
  text-align: center;
  color: var(--text-color);
  line-height: 1.6;
  margin: 0;
}

.modal-actions {
  display: flex;
  gap: var(--spacing-sm);
}

.delete-confirm {
  flex: 1;
  background-color: #dc3545;
  color: white;
}

.delete-confirm:hover {
  background-color: #c82333;
}

.delete-cancel {
  flex: 1;
  background-color: #6c757d;
  color: white;
}

.delete-cancel:hover {
  background-color: #5a6268;
}
</style>