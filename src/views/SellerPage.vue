<!-- 该组件针对于/sellerpage这条路径显示出来的，用于测试
在这个组件中，通过子组件注册的方式，要显示出Seller.vue -->
<template>
  <Seller></Seller>
</template>

<script>
import Seller from '@/components/Seller.vue'
export default {
  components: {
    Seller
  }
}
</script>

<style lang="less" scoped>
</style>
