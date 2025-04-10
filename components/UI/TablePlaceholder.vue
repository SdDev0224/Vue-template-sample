<template>
  <div class="level table-placeholder">
    <div v-if="isFetching" class="level-item">
      <b-icon
        icon="circle-notch"
        type="is-grey"
        size="is-large"
        custom-class="fa-spin"
      />
    </div>
    <div v-else class="level-item">
      <span class="has-text-grey has-text-weight-semibold">{{ emptyMessage }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TablePlaceholder',
  props: {
    isFetching: {
      type: Boolean
    },
    emptyMessage: {
      type: String
    }
  }
}
</script>
