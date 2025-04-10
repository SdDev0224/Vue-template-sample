<template>
  <div class="approval-card">
    <div class="approval-card__top">
      <div class="approval-card__left">
        <pictogram :name="roleStatus.profile.full_name">
          <span>{{ roleStatus.profile.initials }}</span>
        </pictogram>
      </div>
      <div class="approval-card__right">
        <span class="has-text-weight-semibold">{{ roleStatus.profile.full_name }}<span v-if="isUser">&nbsp;(You)</span></span>
        <span>{{ `${roleStatus.role.charAt(0)}${roleStatus.role.slice(1).toLowerCase()}` }}</span>
      </div>
    </div>
    <div class="approval-card__bottom">
      <div style="margin: .5rem 0 .25rem;">
        <!-- TODO: Format date below if needed -->
        <span>Last modif. : {{ roleStatus.last_edit_dt ? roleStatus.last_edit_dt : 'Never' }}</span>
      </div>
      <div class="columns is-vcentered">
        <div class="status column is-narrow">
          <template v-if="roleStatus.current_approval">
            <span class="status__bullet status__bullet--success"></span>
            <span class="status__text">Approved</span>
          </template>
          <template v-else-if="!roleStatus.current_approval && roleStatus.past_approval">
            <span class="status__bullet status__bullet--neutral"></span>
            <span class="status__text">Outdated</span>
          </template>
          <template v-else-if="!roleStatus.current_approval && !roleStatus.past_approval">
            <span class="status__bullet status__bullet--failure"></span>
            <span class="status__text">Pending</span>
          </template>
        </div>
        <div v-if="isUser" class="column is-narrow">
          <template v-if="roleStatus.current_approval">
            <button @click="handleApprovalRemove" type="button" :class="[
              'button',
              'is-small',
              'is-fullwidth',
              'is-rounded',
              'is-danger',
              { 'is-loading': isFetchingApproval }
            ]">Remove</button>
          </template>
          <template v-else>
            <button @click="handleApproval" type="button" :class="[
              'button',
              'is-small',
              'is-fullwidth',
              'is-rounded',
              'is-success',
              { 'is-loading': isFetchingApproval }
            ]">Approve</button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Pictogram from '@/components/UI/Pictogram'
import {
  postCruiseApproval,
  deleteCruiseApprovalByUser
} from '@/api/cruise'

export default {
  name: 'RoleStatusCard',
  components: {
    Pictogram
  },
  props: {
    roleStatus: {
      type: Object,
      required: true
    },
    isUser: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isFetchingApproval: false
    }
  },
  methods: {
    handleApproval () {
      if (confirm('Do you fully approve this agreement ?')) {
        this.isFetchingApproval = true
        postCruiseApproval(this.$store.state.cruise.cruise.id, {'user_id': this.$store.state.auth.user.id})
          .then(() => {
            this.$emit('approval-change')
          })
          .catch((error) => {
            console.log(`Approval error ${error}`)
          })
          .finally(() => {
            this.isFetchingApproval = false
          })
      }
    },
    handleApprovalRemove () {
      if (confirm('Do you want to revoke your approval ?')) {
        this.isFetchingApproval = true
        deleteCruiseApprovalByUser(this.$store.state.cruise.cruise.id, this.$store.state.auth.user.id)
          .then(() => {
            this.$emit('approval-change')
          })
          .catch((error) => {
            console.log(`Approval removal error ${error}`)
          })
          .finally(() => {
            this.isFetchingApproval = false
          })
      }
    }
  }
}
</script>

<style lang="scss">
  .approval-card {
    display: flex;
    flex-flow: column nowrap;
    flex: 0 0 0;
    position: relative;

  &--centered {
    justify-content: center;
  }

  &__top {
    display: flex;
    flex-flow: row nowrap;
  }

  &__left {
    flex:  0;
    margin-right: 1rem;
  }

  &__right {
    display: flex;
    justify-content: center;
    flex-flow: column nowrap;
  }

  &__bottom {
    font-size: .9rem;
  }
}
</style>
