<template>
  <section class="section">
      <div class="container">

        <nav class="level">
          <div class="level-left"></div>
          <div class="level-right">
            <div class="level-item">
              <CTAButton @click.native="createCruise" text="Create new agreement"/>
            </div>
          </div>
        </nav>

        <request-error :error="requestError"/>

        <div id="ContractList" class="section-box">
          <div class="section-box__header">
            <span class="title is-5">Agreements</span>
          </div>
          <b-table :data="cruises">
            <template slot-scope="props">
              <b-table-column field="yacht.name" label="Yacht" width="200" sortable>
                <span v-if="props.row.yacht">
                  {{ props.row.yacht.name }}
                </span>
                <span v-else class="has-text-grey">Not assigned</span>
              </b-table-column>

              <b-table-column field="from_date" label="Departure date">
                <span class="has-text-grey">None</span>
              </b-table-column>

              <b-table-column field="to_date" label="Arrival date">
                <span class="has-text-grey">None</span>
              </b-table-column>

              <b-table-column field="status" label="Status" sortable>
                <template v-if="props.row.status === 'DRAFT'">
                  <div class="status">
                    <span :class="['status__bullet', props.row.status === 'DRAFT' ? 'status__bullet--failure' : 'status__bullet--success']"></span>
                    <span class="status__text">Draft</span>
                  </div>
                </template>
                <template v-else-if="props.row.status === 'LOCKED'">
                  <div class="status">
                    <i class="fas fa-lock fa-xs"></i>
                    <span class="status__text">Locked</span>
                  </div>
                </template>
                <template v-else>
                  {{ props.row.status }}
                </template>
              </b-table-column>

              <b-table-column label="" :sortable="false">
                <router-link :to="{name: 'AgreementDetail', params: {cruiseId: props.row.id }}">
                  <span class="edit-button">
                    <b-icon v-if="props.row.write_access" icon="pencil-alt" size="is-small"/>
                    <b-icon v-else icon="eye" size="is-small"/>
                  </span>
                </router-link>
              </b-table-column>
            </template>

          <template slot="empty">
              <table-placeholder :is-fetching="isFetching" emptyMessage="No contracts yet."></table-placeholder>
          </template>
        </b-table>
      </div>
    </div>
  </section>
</template>

<script>
import TablePlaceholder from '@/components/UI/TablePlaceholder'
import CTAButton from '@/components/UI/CTAButton'
import { postUserCruise } from '@/api/cruise'
import RequestError from '@/components/UI/RequestError'

export default {
  name: 'AgreementList',
  components: {
    TablePlaceholder,
    CTAButton,
    RequestError
  },
  data () {
    return {
      isFetching: false,
      requestError: null
    }
  },
  created () {
    this.isFetching = true
    this.$store.dispatch('getUserCruises')
      .catch(error => {
        this.requestError = error
      })
      .finally(() => {
        this.isFetching = false
      })
  },
  computed: {
    cruises () {
      return this.$store.state.cruise.cruises
    }
  },
  methods: {
    createCruise () {
      postUserCruise(this.$store.state.auth.user.id, {})
        .then(({data: newCruise}) => {
          this.$router.push({name: 'AgreementDetail', params: {cruiseId: newCruise.id}})
        })
        .catch(error => {
          this.requestError = error
        })
    }
  }
}
</script>

<style lang="scss" scoped>
#ContractList {

  table {
    border-radius: 0;
  }

  .edit-button {
    display: inline-flex;
    background-color: #DBEBF5;
    color: #43A9E3;
    padding: 6px;
    border-radius: 4px;
    line-height: 1;
    transition: background-color .2s ease;

    &:hover {
      background-color: #c0def3;
    }
  }

  .delete-button {
    display: inline-flex;
    background-color: #ffdfdf;
    color: red;
    padding: 6px;
    border-radius: 4px;
    line-height: 1;
  }

}
</style>
