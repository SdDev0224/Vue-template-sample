<template>
  <div v-if="error" class="message is-danger">
    <div class="message-header">
      <span v-if="error.response"
        >{{ errorType }} error<span v-if="showDetails">
          - {{ error.response.data.status }}</span
        ></span
      >
      <span v-else>Error</span>
    </div>
    <div class="message-body">
      <template v-if="error.response">
        <p>{{ error.response.data.message }}</p>
        <div v-if="showDetails && error.response.data.messages" class="content">
          <template v-for="(value, key) in error.response.data.messages">
            <ul :key="key">
              <li>
                {{ key }}
                <ul>
                  <li v-for="(val, index) in value" :key="index">{{ val }}</li>
                </ul>
              </li>
            </ul>
          </template>
        </div>
      </template>
      <p v-else-if="error.request">
        Unable to contact the server. If the problem persists, please contact us
        at support
      </p>
      <p v-else>{{ error.message }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "RequestError",
  props: {
    error: {
      type: [Object, Error]
    },
    showDetails: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    errorType() {
      return this.error.response.data.status >= 500 &&
        this.error.response.data.status <= 599
        ? "Server"
        : "Client";
    }
  }
};
</script>
