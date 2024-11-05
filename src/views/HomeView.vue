<template>
  <div id="content" class="main-content">
    <div class="layout-px-spacing">
      <div class="middle-content container-xxl p-0">
        <div class="text-center">
          <h2>Welcome 請選擇左邊功能選單</h2>
        </div>
      </div>
    </div>
    <FooterComponent />
  </div>
</template>

<script lang="ts">
import FooterComponent from '@/components/layout/Footer.vue';
export default {
  name: 'MainContentComponent',
  methods: {
    submitData() {
      // Handle form submission
    }
  },
  components: {
    FooterComponent
  }
};
</script>

<style scoped>
.text-center {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Adjust the height as needed */
}
</style>
