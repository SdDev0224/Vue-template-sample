<template>
  <a :class="['cta-button', `cta-button--${color}`]">
    <span>{{ text }}</span>
    <div class="cta-button__icon-wrapper">
      <b-icon :icon="icon" />
    </div>
  </a>
</template>

<script>
export default {
  name: 'CTAButton',
  props: {
    text: {
      type: String,
      required: true
    },
    color: {
      type: String,
      default: 'blue'
    },
    icon: {
      type: String,
      default: 'arrow-right'
    }
  }
}
</script>

<style lang="scss" scoped>
  .cta-button {
    display: inline-flex;
    align-items: center;
    border: 0;
    border-radius: 4px;
    height: 3rem;
    padding: 0 1rem;
    transition: all .2s ease;
    user-select: none;
    color: white;
    font-weight: 600;

    .cta-button__icon-wrapper {
      display: inline-flex;
      padding: 2px;
      border-radius: 4px;
      margin-left: .75rem;
    }

    &--blue {
      background-color: #01AEFF;
      box-shadow: 0px 6px 12px 0px rgba(67,169,227,0.42), inset 0px 0px 0px transparent;

      &:hover {
        background-color: #069FE7;
        color: white !important;
      }

      &:active {
        box-shadow: 0px 0px 0px transparent, inset 0px 6px 12px 0px rgba(0, 0, 0, 0.25);
      }

      .cta-button__icon-wrapper {
        background-color: #0003;
      }
    }

    $orange: #F57C00;
    &--orange {
      background-color: $orange;
      box-shadow: 0px 6px 12px 0px rgba($orange, .35), inset 0px 0px 0px transparent;

      &:hover {
        background-color: darken($orange, 1%)
      }

      &:active {
        box-shadow: 0px 0px 0px transparent, inset 0px 6px 12px 0px rgba(0, 0, 0, 0.25);
      }

      .cta-button__icon-wrapper {
        background-color: #0003;
      }
    }
  }
</style>
