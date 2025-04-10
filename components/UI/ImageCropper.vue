<template>
  <div class="image-cropper">
    <div v-if="currentStatus === statuses.VALIDATING">
      <img class="cropped-image" style="width: auto;max-width: 100%;max-height: calc(95vh - 11rem);" ref="croppedImage" key="croppedImage" :src="croppedImageDataURL">
      <div class="buttons" style="margin-top: 1rem;">
        <button @click="cancelValidation" class="button is-danger">Cancel</button>
        <button @click="handleCroppedImageValidated" class="button is-link">Add to yacht pictures</button>
      </div>
    </div>

    <template v-else-if="currentStatus === statuses.CROPPING">
      <img style="width: auto;max-width: 100%;max-height: calc(95vh - 11rem);" ref="imageToCrop" key="imageToCrop" :src="imageToCrop">
      <div class="buttons" style="margin-top: 1rem;">
        <button @click="handleImageCropped" class="button is-link">Crop picture</button>
        <button @click="cancelCrop" class="button is-danger">Change picture</button>
      </div>
    </template>

    <div v-else-if="currentStatus === statuses.SELECTING" style="display: flex; flex-flow: column nowrap; align-items: center;">
      <div class="file is-boxed">
        <label class="file-label">
          <input @change="handleImageSelected" class="file-input" type="file" accept="image/png, image/jpeg">
          <span class="file-cta">
            <span class="file-icon">
              <i class="fas fa-upload"></i>
            </span>
            <span class="file-label">Select picture</span>
          </span>
        </label>
      </div>
      <span style="margin-top: 1rem" class="has-text-grey">Image must be at least {{imageMinDimensions.width}}x{{imageMinDimensions.height}}px</span>
    </div>
  </div>
</template>

<script>
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'

const statuses = {
  VALIDATING: 'VALIDATING',
  CROPPING: 'CROPPING',
  SELECTING: 'SELECTING'
}

export default {
  name: 'ImageCropper',
  props: {
    // Enforce crop ration
    destinationImageRatio: {
      type: Number,
      default: 16 / 9
    },
    // Enforce minimum image dimensions
    imageMinDimensions: {
      type: Object,
      default: () => {
        // Allows for 400*225px images with retina resolution
        return {
          width: 800,
          height: 450
        }
      },
      validator: function (value) {
        // Passed object must have height and width properties
        return (value.hasOwnProperty('width') && value.hasOwnProperty('height'))
      }
    }
  },
  data () {
    return {
      statuses: statuses,
      currentStatus: statuses.SELECTING,
      imageToCrop: null,
      croppedImageDataURL: null,
      croppedImageBlob: null,
      cropper: null,
      cropperOptions: {
        background: false,
        viewMode: 3,
        aspectRatio: this.destinationImageRatio,
        zoomable: false,
        rotatable: false,
        movable: false,
        scalable: true,
        minCropBoxWidth: this.imageMinDimensions.width,
        minCropBoxHeight: this.imageMinDimensions.height
      }
    }
  },
  methods: {
    handleImageSelected (event) {
      const fileList = event.target.files
      if (fileList.length) {
        // This will loop only once since file input is not multiple
        for (let i = 0; i < fileList.length; i++) {
          this.imageToCrop = URL.createObjectURL(fileList[i])
          this.imageName = fileList[i].name
        }
        let img = new Image()
        img.onload = (event) => {
          let selectedImage = event.path[0]
          if (selectedImage.width >= this.imageMinDimensions.width && selectedImage.height >= this.imageMinDimensions.height) {
            console.log('image has minimum dimensions')
            console.log(`Selected image is ${selectedImage.width}x${selectedImage.height}`)
            this.currentStatus = this.statuses.CROPPING
            this.$nextTick(() => {
              this.cropper = new Cropper(this.$refs.imageToCrop, this.cropperOptions)
            })
          } else {
            alert('This image doesn\'t meet the size requirements.')
          }
        }
        img.src = this.imageToCrop
      }
    },
    handleImageCropped () {
      this.croppedImageDataURL = this.cropper.getCroppedCanvas().toDataURL('image/jpeg', 1)
      this.cropper.getCroppedCanvas({
        imageSmoothingEnabled: false
      }).toBlob(blob => {
        this.croppedImageBlob = blob
      }, 'image/jpeg', 1)
      this.currentStatus = this.statuses.VALIDATING
      this.cropper.destroy()
      this.cropper = null
    },
    handleCroppedImageValidated () {
      this.$emit('image-cropped', {
        name: this.imageName,
        blob: this.croppedImageBlob
      })
    },
    cancelCrop () {
      this.cropper.destroy()
      this.cropper = null
      this.currentStatus = this.statuses.SELECTING
    },
    cancelValidation () {
      this.croppedImageDataURL = null
      this.croppedImageBlob = null
      this.currentStatus = this.statuses.CROPPING
      this.$nextTick(() => {
        this.cropper = new Cropper(this.$refs.imageToCrop, this.cropperOptions)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .cropped-image {
    border:  1px solid lightgray;
  }
</style>
