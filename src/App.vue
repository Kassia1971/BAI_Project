<template>
  <div id="app" class="content">
    <div id="nav">
      <router-link to="/about">About</router-link> |
    </div>
    <router-view />
  </div>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

export default {
  name: 'App'
}
</script>
