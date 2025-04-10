<template>
  <div>
    <request-error :error="requestError" />
    <fieldset>
      <legend>Pictures</legend>
      <div class="gallery">
        <div
          v-for="picture in yacht.pictures"
          :key="picture.public_url"
          class="gallery__item card"
        >
          <div class="card-image"></div>
          <img :src="`${backendURL}${picture.public_url}`" />
        </div>
      </div>
    </fieldset>
    <a
      class="button"
      :disabled="readOnlyStatus"
      @click="readOnlyStatus ? null : (isImageUploadModalShown = true)"
    >
      <span class="icon">
        <i class="fas fa-image"></i>
      </span>
      <span>Add picture</span>
    </a>
    <modal
      v-if="isImageUploadModalShown"
      @modal-close="isImageUploadModalShown = false"
    >
      <template slot="body">
        <image-cropper @image-cropped="handleImageUpload($event)" />
      </template>
    </modal>
  </div>
</template>

<script>
import { postYachtImage } from "@/api/yacht";
import RequestError from "@/components/UI/RequestError";
import Modal from "@/components/UI/Modal";
import ImageCropper from "@/components/UI/ImageCropper";

export default {
  name: "YachtPicturesForm",
  components: {
    RequestError,
    Modal,
    ImageCropper
  },
  props: {
    yacht: {
      type: Object,
      required: true
    }
  },
  computed: {
    readOnlyStatus() {
      return this.$store.getters.yachtReadOnlyStatus;
    }
  },
  data() {
    return {
      isSending: false,
      isImageUploadModalShown: false,
      backendURL: process.env.CONTRACT_REST_SERVER
        ? `http://${process.env.CONTRACT_REST_SERVER}`
        : "http://localhost:5000",
      requestError: null
    };
  },
  methods: {
    handleImageUpload(image) {
      const formData = new FormData();
      formData.append("file", image.blob, image.name);
      console.log(...formData);
      postYachtImage(this.yacht.id, formData)
        .then(() => {
          console.info("Image upload success");
          this.$emit("pictures-updated");
        })
        .catch(error => {
          this.requestError = error;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.gallery {
  display: flex;
  flex-flow: row wrap;

  &__item {
    flex: 0 0 calc(100% / 3);
  }
}
</style>
