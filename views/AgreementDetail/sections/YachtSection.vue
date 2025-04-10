<template>
  <div>
    <template v-if="!isFetching">

        <div class="card">
          <div class="card-header">
            <div class="columns is-vcentered" style="flex: 1;padding: 1rem;">
              <div class="column">
                <span class="has-text-grey has-text-weight-semibold is-centered">Yacht</span>
              </div>
              <div class="column">
                <multi-select
                  v-model="selectedYacht"
                  :disabled="cruiseReadOnlyStatus"
                  label="name"
                  placeholder="Type Yacht"
                  selectLabel=""
                  trackBy="id"
                  :hideSelected="true"
                  :options="userYachts"
                  @input="handleCruiseYachtChanged"
                  ref="yachtSelectionBox"
                >
                  <template slot="beforeList">
                    <div>
                      <a style="display: block; padding:.75rem;" class="is-italic" @click="enableYachtCreation">Add new</a>
                    </div>
                  </template>
                  <template slot="noResult">No yacht matches this search.</template>
                  <template slot="option" slot-scope="props">
                    <div class="columns is-vcentered">
                      <div class="column option__label">
                        <span class="option__title">{{ props.option.name }}</span>
                      </div>
                      <div class="column is-narrow option__delete" @click.stop="handleYachtDelete(props.option)">
                        <div class="option__delete">
                          <b-icon icon="trash-alt" size="is-small"/>
                        </div>
                      </div>
                    </div>
                  </template>
                </multi-select>
              </div>
            </div>
          </div>
          <div class="card-content" v-if="selectedYacht">
            <yacht-update-form :yachtId="selectedYacht.id"/>
          </div>
        </div>

      <modal @modal-close="isYachtCreationModalShown = false" v-if="isYachtCreationModalShown">
        <div slot="body">
          <yacht-create-form @yacht-created="handleYachtCreated($event)" @close-modal="isYachtCreationModalShown = false"/>
        </div>
      </modal>

    </template>
    <hr style="margin-top: 0;">
    <role-form
      role="carriers"
      roleFriendlyNameSingular="carrier"
      roleFriendlyNamePlural="Carriers"
      empty-text="There is no carrier."
    />
    <hr style="margin-top: 0;">
    <role-form
      role="central_agents"
      roleFriendlyNameSingular="central agent"
      roleFriendlyNamePlural="Central agents"
      empty-text="There are no central agents."
      multiple
    />
    <hr style="margin-top: 0;">
    <role-form
      role="captains"
      roleFriendlyNameSingular="captain"
      roleFriendlyNamePlural="Captains"
      empty-text="There are no captains."
      multiple
    />
  </div>
</template>

<script>
import RoleForm from '@/components/forms/cruise/RoleForm'
import SubmitButton from '@/components/UI/SubmitButton'
import MultiSelect from 'vue-multiselect'
import Modal from '@/components/UI/Modal'
import YachtCreateForm from '@/components/forms/yacht/YachtCreateForm'
import YachtUpdateForm from '@/components/forms/yacht/YachtUpdateForm'
// import { required } from 'vuelidate/lib/validators'

export default {
  name: 'YachtSection',
  components: {
    RoleForm,
    YachtCreateForm,
    YachtUpdateForm,
    SubmitButton,
    Modal,
    MultiSelect
  },
  data () {
    return {
      selectedYacht: null,
      isYachtCreationModalShown: false,
      isSending: false,
      isFetching: false
    }
  },
  validations: {},
  created () {
    this.getYachts()
    if (this.$store.state.cruise.cruise.yacht) {
      this.selectedYacht = this.$store.state.cruise.cruise.yacht
    }
  },
  computed: {
    cruiseReadOnlyStatus () {
      return this.$store.getters.cruiseReadOnlyStatus
    },
    userYachts () {
      return this.$store.state.yacht.yachts
    }
  },
  methods: {
    handleYachtCreated (createdYacht) {
      this.isYachtCreationModalShown = false
      this.selectedYacht = this.$store.state.yacht.yachts.find(yacht => yacht.id === createdYacht.id)
      this.handleCruiseYachtChanged(createdYacht)
    },
    handleYachtDelete (yacht) {
      if (confirm(`Delete "${yacht.name}" from your list of yachts ?`)) {
        this.$store.dispatch('deleteYacht', yacht.id)
          .then(() => {
            console.log(`${yacht.name} has been removed from users yachts`)
          })
          .catch(error => {
            console.error(error)
          })
      }
    },
    handleCruiseYachtChanged (yacht) {
      this.$store.commit('updateCruiseYacht', yacht)
      this.$store.dispatch('updateCruise')
    },
    getYachts () {
      this.isFetching = true
      this.$store.dispatch('getUserYachts')
        .finally(() => {
          this.isFetching = false
        })
    },
    enableYachtCreation () {
      this.selectedYacht = null
      this.isYachtCreationModalShown = true
      this.$refs.yachtSelectionBox.$refs.search.blur()
    }
  }
}
</script>

<style lang="scss">
.b-tabs .tab-content {
  overflow: visible !important;
}

.form-wrapper {
  margin-top: 2rem;
  padding: 2rem;
  border: 1px solid lightgray;
  border-radius:4px;
}

.option__delete {
  display: flex;
  padding: .5rem;
  transition: background-color .2s ease;

  &:hover {
    background-color: #E53935; // Material red 600
  }
}
</style>
