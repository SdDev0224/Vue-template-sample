<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper" @click.self="close">
        <div class="modal-container">
          <a @click="close" class="modal-cross delete"></a>
          <div class="modal-header">
            <slot name="header">
            </slot>
          </div>

          <div class="modal-body">
            <slot name="body"></slot>
          </div>

          <div class="modal-footer">
            <slot name="footer"></slot>
          </div>

        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Modal',
  props: {

  },
  methods: {
    close () {
      this.$emit('modal-close')
    },
    outerClick () {
      console.log('Modal outerclick -> should close')
    }
  }
}
</script>

<style>
.modal-mask {
  position: fixed;
  z-index: 10000;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, .35);
  display: flex;
  transition: opacity .3s ease;
  will-change: transform;
  transform: translate3d(0, 0, 0);
}

.modal-wrapper {
  margin: auto;
  padding: 2rem;
}

.modal-body {
}

.modal-cross {
  position: absolute !important;
  top: .5rem;
  right: .5rem;
}

.modal-container {
  position: relative;
  margin: 0 auto;
  padding: 2rem 2rem;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  max-width: 95vw;
  max-height: 95vh;

  @media and (min-width: $fullhd) {
    max-width: 50%;
  }
}

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
