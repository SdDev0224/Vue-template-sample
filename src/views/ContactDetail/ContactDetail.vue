<template>
    <section class="section">
        <div class="container">
          <div class="level-left">
            <div></div>
          </div>
          <div class="level-right">
            <div class="level-item">
              <BackButton @click.native="onClickBack" text="Back"/>
            </div>
          </div>
            <div class="section-box">
                <div class="section-box__header">
                    <template>
                      <contactdetail-form :profile-id='id'/>
                    </template>
               </div>
            </div>
        </div>
    </section>
</template>

<script>
import ContactdetailForm from '@/components/forms/contact/ContactdetailForm'
import BackButton from '@/components/UI/BackButton'
export default {
  name: 'ContactDetail',
  components: {
    BackButton,
    'contactdetail-form': ContactdetailForm
  },
  props: ['id'],
  data () {
    return {
    }
  },
  methods: {
    onClickBack () {
      this.$router.push({name: 'ContactsList'})
    }
  }
}
</script>
<style lang="scss" scoped>
  .contact-name{
    font-size: 30px;
    margin-top: 42px;
}
  .level-right{
    margin-bottom: 20px;
  }
</style>