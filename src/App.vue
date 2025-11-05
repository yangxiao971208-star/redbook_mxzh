<template>
  <div class="app-container">
    <router-view />
  </div>
</template>

<script setup>
// 路由入口
// 路由配置已在main.js中处理
</script>

<style>
/* 应用容器样式 */
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--background-color);
}

/* 确保内容区域有合适的内边距 */
.app-container > * {
  width: 100%;
}

/* 滚动条样式优化 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--secondary-color);
}

::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--primary-color);
}

/* 禁用文本选择，提升移动端体验 */
.no-select {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* 提升移动端点击体验 */
.mobile-touch {
  -webkit-tap-highlight-color: transparent;
}
</style>