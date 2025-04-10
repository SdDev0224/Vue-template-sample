<template>
    <section>
        <b-autocomplete
                rounded
                v-model="name"
                :data="filteredDataArray"
                placeholder="Search"
                icon="magnify"
                @select="option => selected = option">
                <template slot="empty">No results found</template>
        </b-autocomplete>
    </section>
</template>
<script>
export default {
  name: 'SearchButton',
  data () {
    return {
      data: [],
      name: '',
      selected: null
    }
  },
  props: {
    text: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      default: 'magnify'
    }
  },
  computed: {
    filteredDataArray () {
      return this.data.filter((option) => {
        return option
          .toString()
          .toLowerCase()
          .indexOf(this.name.toLowerCase()) >= 0
      })
    }
  }
}
</script>