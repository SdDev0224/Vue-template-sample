<template>
<section class="section">
<div class="container">
  <nav class="level">
          <div class="level-left"></div>
          <div class="level-right">
            <div class="level-item" v-if="!isDetail">
              <CTAButton @click.native="createYacht" style="height: 38px;" text="Add Yacht"/>
            </div>
            <div class="level-item" v-if="isDetail">
              <BackButton @click.native="onClickBack" text="Back"/>
            </div>
          </div>
  </nav>
  <div class="container">
      <div class="section-box">
        <div class="section-box__header">
        </div>
        <template>
          <yacht-card @isDetail="onClickDetailBtn" v-bind:isDetail="isDetail"></yacht-card>
        </template>
        <template slot="empty">
          <table-placeholder :is-fetching="isFetching" emptyMessage="No yachts yet."></table-placeholder>
        </template>
      </div>
  </div>
</div>
</section>
</template>

<script>
import TablePlaceholder from '@/components/UI/TablePlaceholder'
import YachtCard from '@/views/YachtDetail/YachtCard'
import CTAButton from '@/components/UI/CTAButton'
import BackButton from '@/components/UI/BackButton'
import SearchButton from '@/components/UI/SearchButton'
export default {
  name: 'YachtList',
  components: {
    YachtCard,
    CTAButton,
    BackButton,
    SearchButton,
    TablePlaceholder
  },
  data () {
    return {
      isFetching: false,
      isDetail: false
    }
  },
  created () {
    this.isFetching = true
    this.$store.dispatch('getUserYachts')
      .finally(() => {
        this.isFetching = false
      })
  },
  computed: {
    yachts () {
      return this.$store.state.yacht.yachts
    }
  },
  methods: {
    onClickDetailBtn (value) {
      this.isDetail = value
    },
    onClickBack () {
      this.isDetail = !this.isDetail
    },
    createYacht () {
      this.$router.push({name: 'YachtCreate'})
    }
  }
}
</script>
