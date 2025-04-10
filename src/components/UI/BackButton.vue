<template>
  <a class="cta-button">
    <div class="cta-button__icon-wrapper">
      <b-icon :icon="icon" />
    </div>
    <span>{{ text }}</span>
  </a>
</template>

<script>
export default {
  name: 'BackButton',
  props: {
    text: {
      type: String,
      required: true
    },
    icon: {
      default: 'arrow-left',
      type: String
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
    height: 2.5rem;
    padding: 0 1rem;
    transition: all .2s ease;
    user-select: none;

    background-color: #01AEFF;
    color: white;
    font-weight: 600;
    box-shadow: 0px 6px 12px 0px rgba(67,169,227,0.42), inset 0px 0px 0px transparent;

    &:hover {
      background-color: #069FE7
    }

    &:active {
      box-shadow: 0px 0px 0px transparent, inset 0px 6px 12px 0px rgba(0, 0, 0, 0.25);
    }

    &__icon-wrapper {
      background-color: #0003;
      display: inline-flex;
      padding: 2px;
      border-radius: 4px;
      margin-right: .75rem;
      }
  }
</style>
