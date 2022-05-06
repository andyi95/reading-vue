<template>
  <div id="app">

    <nav class="navbar navbar-nav navbar-expand-lg navbar-dark nav-bg-custom">
      <div class="container-fluid">
        <div class="navbar-header">
          <a href="https://github.com/andyi95" class="brand-logo" target="_blank">Тестовое тесто</a></div>
        <ul class="navbar-nav">
          <li class="nav-item" v-for="link in navlinks" :key="link.name">
            <router-link class="nav-link" :to="{path:link.name}">{{ link.title }}</router-link>
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
          name: 'about', title: 'Что-то будет'
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
.nav-link a{
  color: #1FAB89!important;
  padding-left: 7px!important;
  display: block!important;
}
.brand-logo {
  color: #1266f1;
}

.nav-item{
    color: #6098a1!important;
    padding-left: 7px!important;
    display: block;
}
.nav-item:hover {
  background-color: #393E46;
}

.nav-bg-custom {
    background-color: #222831;
}

</style>
