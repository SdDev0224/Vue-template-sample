<template>
  <div>
    <iframe ref="draftIframe" @load="resizeIframe" :src="draftURL" scrollable="no" style="width: 1px; min-width: 100%;"></iframe>
  </div>
</template>

<script>
import { serverURL } from '@/api/config'
import { iframeResizer } from 'iframe-resizer'

export default {
  name: 'ContractSection',
  computed: {
    draftURL () {
      return `${serverURL}/contract/draft/${this.$store.state.cruise.cruise.id}`
    }
  },
  methods: {
    resizeIframe () {
      iframeResizer({
        log: true,
        bodyMargin: 0,
        heightCalculationMethod: 'lowestElement'
      }, this.$refs.draftIframe)
    }
  }
}
</script>
