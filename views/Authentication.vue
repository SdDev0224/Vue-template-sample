<template>
    <section class="section columns is-vcentered waves-bg">
      <div class="column is-flex">
        <img style="margin: auto auto;" src="../assets/img/logo_white@1x.svg" alt="">
      </div>
      <div class="column">
        <div class="form-holder column is-8-widescreen is-12-desktop">
          <p class="title is-3 serif has-text-weight-bold has-text-centered">Start managing your<br> contracts the easy way</p>
          <router-view></router-view>
        </div>
      </div>
    </section>
</template>

<script>
export default {
  name: 'Authentication'
}
</script>

<style lang="scss">
  .form-holder {
    border-radius: 2px;
    background-color: white;
    padding: 2.5rem 1.5rem !important;

    .form {
      padding: 0 .5rem 1.5rem;
      max-width: 320px;
      margin: 0 auto;
    }
  }
</style>
