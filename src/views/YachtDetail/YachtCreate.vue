<template>
<section class="section">
<div class="container">
  <nav class="level">
          <div class="level-left"></div>
          <div class="level-right">
            <div class="level-item">
              <BackButton @click.native="onClickBack" text="Back"/>
            </div>
          </div>
  </nav>
  <div class="container">
      <div class="section-box">
            <div class="section-box__header">
            </div>
            <template>
              <yacht-create-form></yacht-create-form>
            </template>
      </div>
  </div>
</div>
</section>
</template>

<script>
import BackButton from '@/components/UI/BackButton'
import YachtCreateForm from '@/components/forms/yacht/YachtCreateForm'

export default {
  name: 'YachtCreate',
  components: {
    BackButton,
    YachtCreateForm
  },
  methods: {
    onClickBack () {
      this.$router.push({name: 'YachtList'})
    }
  }
}
</script>
<style>
</style>