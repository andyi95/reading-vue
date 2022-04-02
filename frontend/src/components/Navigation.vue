<template>
  <div id="app">

    <nav class="navbar navbar-nav navbar-expand-lg navbar-dark nav-bg-custom">
      <div class="container-fluid">
        <div class="navbar-header">
          <a href="https://github.com/andyi95" class="nav-link" target="_blank">Тестовое тесто</a></div>
        <ul class="nav">
          <li class="nav-link nav-element" v-for="link in navlinks" :key="link.name">
            <router-link :to="{path:link.name}" class="nav-link">{{ link.title }}</router-link>
          </li>
        </ul>
      </div>
    </nav>
    <router-view/>
  </div>
</template>

<script>
export default {
  data() {
    return {
      navlinks: [
        {
          name: 'text',
          title: 'Текстовые инструменты'
        },
        {
          name: 'helloworld', title: 'Hello, World!'
        },
        {
          name: 'about',
          title: 'О сайте'
        }
    ]
    }
  }
}
</script>
<style scoped>
.a .nav-link{
  color: #1FAB89!important;
  padding-left: 7px!important;
  display: block!important;
}
</style>