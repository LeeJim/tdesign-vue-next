<template>
  <div class="tdesign-demo-item--input__input-box">
    <h5>文本域输入框已抽离为单独组件，更多示例请参考 Textarea 组件</h5>
    <t-textarea v-model="value" placeholder="请输入内容" />
  </div>
</template>
<script>
import { defineComponent, ref } from 'vue';

export default defineComponent({
  setup() {
    const value = ref('');
    return {
      value,
    };
  },
});
</script>
<style lang="less" scoped>
.t-textarea {
  margin-top: 16px;
}
</style>
