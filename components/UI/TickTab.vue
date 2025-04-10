<template>
  <div class="tick-tab">
    <b-icon icon="check-circle" :type="isValid ? 'is-success' : 'is-grey-lighter'"/>
    <span class="tick-tab__text" :class="['has-text-weight-semibold']">{{ text }}</span>
  </div>
</template>

<script>
export default {
  name: 'TickTab',
  props: {
    isValid: {
      type: Boolean
    },
    isActive: {
      type: Boolean
    },
    text: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.tick-tab {
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  text-align: center;
  .icon {
    margin: 0 0 .5rem 0 !important;
  }

  &__text {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
  }
}
</style>
