<template>
  <div class="pictogram" :style="styles">
    <slot></slot>
  </div>
</template>

<script>
import toMaterialStyle from 'material-color-hash'

export default {
  name: 'Pictogram',
  props: {
    backgroundColor: {
      type: String,
      default: '#F4F6FA'
    },
    color: {
      type: String,
      default: '#01AEFF'
    },
    size: {
      type: String,
      default: '4rem'
    },
    name: {
      type: String
    }
  },
  computed: {
    styles () {
      let color
      if (this.name) {
        color = toMaterialStyle(this.name, '700').backgroundColor
      } else {
        color = this.color
      }
      return {
        color,
        backgroundColor: this.backgroundColor,
        width: this.size,
        height: this.size
      }
    }
  }
}
</script>

<style lang="scss">
  .pictogram {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius:50%;
    font-weight: 600;
    font-size: 1.25rem;
  }
</style>
