<template>
  <button
    :class="[
      'button',
      'is-info',
      'is-fullwidth',
      { 'is-loading': isLoading },
      { 'has-background-grey-light': isDisabled },
      { 'has-text-light': isDisabled }
    ]" :disabled="isDisabled">{{ buttonText }}</button>
</template>

<script>
export default {
  name: 'SubmitButton',
  props: {
    isLoading: {
      type: Boolean,
      required: true
    },
    isDisabled: {
      type: Boolean,
      required: true
    },
    buttonText: {
      type: String,
      required: true
    }
  }
}
</script>
