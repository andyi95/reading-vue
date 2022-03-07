<template>
  <div id="app">

    <nav class="navbar navbar-expand-lg navbar-dark bg-custom">
      <div class="container-fluid">
        <div class="navbar-header">
          <a href="https://github.com/andyi95" class="nav-link" target="_blank">Тестовое тесто</a></div>
        <ul class="nav">
          <li v-for="link in navlinks" :key="link.name">
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
          name: 'about',
          title: 'О сайте'
        },
        {
          name: 'login',
          title: 'Вход через Facebook'
        }
    ]
    }
  }
}
</script>
<style scoped>
/*nav {*/
/*  padding: 30px;*/
/*  background-color: #8891a6;*/
/*}*/
.navbar-header {
  color: #e9ecef;
}

.router-link-active {
  color: #f8f9fa!important;
}

.nav-link{
  color: #adb5bd;
  /*display: block;*/
  /*padding: 0.5rem 1rem;*/
  /*text-decoration: none;*/
  /*transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out;*/
}
.nav-link:hover, .nav-link:focus {
  color: #dee5eb;
}

.bg-custom {
  background-color: #212529;
}
</style>