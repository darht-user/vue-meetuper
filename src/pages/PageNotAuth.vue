<template>
  <div class="container">
      <ErrorView 
        :title="'Ooooops, page you are not authenticated to visit this page, please login'" 
        :status="'401'" 
        :navigateToPage="'PageLogin'" 
        :navigateToText="'Navigate to Login Page'" />
  </div>
</template>

<script>
import ErrorView from '@/components/ErrorView'
  export default {
      components: {ErrorView}

  }
</script>

<style scoped>
  .title {
    font-size: 40px;
  }
  .subtitle {
    font-size: 140px;
    text-align: center;
  }
  .notFoundContainer {
    margin-top: 80px;
  }
</style>