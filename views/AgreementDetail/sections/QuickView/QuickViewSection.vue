<template>
  <div>
    <div class="qv-section">
      <div class="columns">
        <div class="column column--separated">
          <div class="qv-card qv-card--separated qv-card--centered">
            <div class="qv-card__left">
              <pictogram>
                <i class="fas fa-user-alt"></i>
              </pictogram>
            </div>
            <div class="qv-card__right">
              <span
                class="has-text-weight-semibold has-text-grey-light is-uppercase"
                >Client</span
              >
              <span>Ms Dracht</span>
            </div>
          </div>
        </div>
        <div class="column column--separated">
          <div class="qv-card qv-card--separated qv-card--centered">
            <div class="qv-card__left">
              <pictogram>
                <i class="fas fa-pencil-alt"></i>
              </pictogram>
            </div>
            <div class="qv-card__right">
              <span
                class="has-text-weight-semibold has-text-grey-light is-uppercase"
                >Agreement status</span
              >
              <span v-if="cruise">{{
                `${cruise.status.charAt(0)}${cruise.status
                  .slice(1)
                  .toLowerCase()}`
              }}</span>
            </div>
          </div>
        </div>
        <div class="column  column--separated">
          <div class="qv-card qv-card--centered">
            <div class="qv-card__left">
              <pictogram>
                <i class="fas fa-dollar-sign"></i>
              </pictogram>
            </div>
            <div class="qv-card__right">
              <span
                class="has-text-weight-semibold has-text-grey-light is-uppercase"
                >Accounting</span
              >
              <span v-if="cruise.paid" class="has-text-success">Paid</span>
              <button
                v-else
                type="button"
                class="button is-success is-small"
                @click="handlePayment"
              >
                Pay now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="v-spaced-2">
      <div class="columns">
        <div class="column qv-column">
          <div class="qv-column__header">
            <span class="title is-5">Schedule</span>
          </div>
          <div class="qv-column__body">
            <v-date-picker
              mode="range"
              v-model="datepickerDates"
              show-caps
              is-inline
              is-expanded
              :themeStyles="datepickerStyles"
            >
            </v-date-picker>
          </div>
        </div>
        <div class="column qv-column">
          <div class="qv-column__header">
            <span class="title is-5">Location</span>
          </div>
          <div class="qv-column__body">
            <waypoints-map
              :style="{ 'max-height': '100%', 'min-height': 'unset' }"
              v-if="!isFetchingWaypoints"
              :disable-default-u-i="true"
              :is-map-active="false"
            />
          </div>
        </div>
        <div class="column qv-column">
          <div class="qv-column__header">
            <span class="title is-5"
              >Yacht&nbsp;&nbsp;
              <span
                v-if="yacht"
                class="has-text-weight-normal has-text-grey-light"
                >|&nbsp;&nbsp;{{ yacht.type === "SAIL" ? "SY" : "MY" }}
                {{ yacht.name }}</span
              >
              <span v-else class="has-text-weight-normal has-text-grey-light"
                >|&nbsp;&nbsp; Not Set</span
              >
            </span>
          </div>
          <div class="qv-column__body">
            <img
              :src="
                yacht && yacht.pictures.length
                  ? `http://localhost:5000${yacht.pictures[0].public_url}`
                  : require('@/assets/img/yacht/empty.png')
              "
            />
          </div>
        </div>
      </div>
    </div>

    <div class="qv-section v-spaced-2">
      <span class="qv-section__title title is-5">Approvals</span>
      <template v-if="!isFetchingRoleStatuses">
        <div class="columns">
          <template v-if="userRoleStatuses.length">
            <div
              class="column is-narrow"
              v-for="(roleStatus, index) in userRoleStatuses"
              :key="`user-${index}`"
            >
              <role-status-card
                @approval-change="fetchRoleStatuses"
                is-user
                :role-status="roleStatus"
              />
            </div>
          </template>
          <template v-if="othersRoleStatuses.length">
            <div
              class="column is-narrow"
              v-for="(roleStatus, index) in othersRoleStatuses"
              :key="`other-${index}`"
            >
              <role-status-card :role-status="roleStatus" />
            </div>
          </template>
          <div
            class="column"
            v-if="!userRoleStatuses.length && !othersRoleStatuses.length"
          >
            No roles are assigned yet.
          </div>
        </div>
      </template>
      <div v-else>
        <span>Loading roles</span>
      </div>
    </div>
    <!--   <form @submit.prevent="send" @change.capture="send" novalidate autocomplete="on">

    <b-field>
      <p class="control">
        <span class="button is-static">Duration</span>
      </p>
      <b-input
        :disabled="isFormReadOnly"
        :readonly="isFormReadOnly"
        v-model.number="cruiseGeneralData.navigation_hours"
        type="number"
      />
    </b-field>

    <div class="columns is-hcentered">
      <div class="column">
        <b-field>
          <p class="control">
            <span class="button is-static">Departure date</span>
          </p>
          <b-datepicker
            :disabled="isFormReadOnly"
            :readonly="isFormReadOnly"
            v-model="cruiseGeneralData.from_date"
          />
        </b-field>
      </div>
      <div class="column">
        <b-field>
          <p class="control">
            <span class="button is-static">Arrival date</span>
          </p>
          <b-datepicker
            :disabled="isFormReadOnly"
            :readonly="isFormReadOnly"
            v-model="cruiseGeneralData.to_date"
          />
        </b-field>
      </div>
    </div>
    <b-field>
      <submit-button :is-loading="isSending" :is-disabled="isSending" buttonText="Create cruise" />
    </b-field>
  </form> -->
    <div class="v-spaced">
      <button
        v-if="cruise.locked && cruise.write_access"
        type="button"
        class="button is-warning"
        @click="handleUnlock"
      >
        Unlock cruise
      </button>
      <button
        type="button"
        class="button is-danger"
        @click="handleCruiseDelete"
      >
        Delete cruise
      </button>
    </div>
  </div>
</template>

<script>
import SubmitButton from "@/components/UI/SubmitButton";
import Pictogram from "@/components/UI/Pictogram";
import RoleStatusCard from "./components/RoleStatusCard";
import WaypointsMap from "@/views/AgreementDetail/sections/waypoints/WaypointsMap";
import { datepickerStyles } from "@/helpers/datepickers";
import { unlockCruise } from "@/api/cruise";

export default {
  name: "QuickViewSection",
  components: {
    SubmitButton,
    Pictogram,
    RoleStatusCard,
    WaypointsMap
  },
  created() {
    this.fetchData();
    // init dates
    // if (this.cruise.from_date && this.cruise.to_date) {
    // this.datepickerDates = {

    // }
    // }
  },
  data() {
    return {
      isSending: false,
      isFetchingRoleStatuses: false,
      isFetchingWaypoints: false,
      userRoleStatuses: null,
      othersRoleStatuses: [],
      cruiseGeneralData: {
        yacht_id: 1,
        cruise_areas: [],
        from_date: new Date(),
        to_date: new Date(),
        status: "DRAFT", // FIXME: Set DRAFT in backend
        navigation_hours: 0
      },
      datepickerDates: null,
      datepickerStyles: datepickerStyles
    };
  },
  computed: {
    cruise() {
      return this.$store.state.cruise.cruise;
    },
    yacht() {
      return this.$store.state.cruise.yacht;
    },
    isFormReadOnly() {
      return (
        !this.$store.state.cruise.cruise.write_access &&
        this.$store.state.cruise.cruise.locked
      );
    },
    roleStatuses() {
      return this.$store.state.cruise.roleStatuses;
    }
  },
  methods: {
    send() {
      this.isSending = true;
      this.$store.dispatch("updateCruise");
    },
    fetchData() {
      this.fetchRoleStatuses();
      this.fetchWaypoints();
    },
    fetchWaypoints() {
      this.isFetchingWayPoints = true;
      this.$store.dispatch("getCruiseWaypoints").then(waypoints => {
        // Synchronous, no promise returned
        this.$store.dispatch("setWaypoints", waypoints);
        this.isFetchingWayPoints = false;
      });
    },
    fetchRoleStatuses() {
      this.isFetchingRoleStatuses = true;
      this.$store.dispatch("getCruiseRoleStatuses").then(() => {
        let userProfileIds = this.$store.state.auth.user.profiles.map(
          profile => profile.id
        );
        this.userRoleStatuses = this.roleStatuses.filter(roleStatus =>
          userProfileIds.includes(roleStatus.profile.id)
        );
        this.othersRoleStatuses = this.roleStatuses.filter(
          roleStatus => !userProfileIds.includes(roleStatus.profile.id)
        );
        this.isFetchingRoleStatuses = false;
      });
    },
    handleCruiseDelete() {
      if (confirm("Delete cruise ?")) {
        this.$store
          .dispatch("deleteCruise", this.$route.params.cruiseId)
          .then(() => {
            this.$router.replace({ name: "AgreementList" });
          })
          .catch(errorMessage => {
            console.log(errorMessage);
          });
      }
    },
    handleUnlock() {
      unlockCruise(this.cruise.id)
        .then(({ data: cruise }) => {
          this.$store.commit("toggleCruiseLock");
        })
        .catch(error => {
          console.error("cruise unlock error", error);
        });
    },
    handlePayment() {
      this.$checkout.open({
        name: `Contract #${this.cruise.id}`,
        amount: 5000,
        token: token => {
          // call payment endpoint here
          console.log(token);
          alert(`Payment token = ${token.id}`);
        }
      });
    }
  }
};
</script>

<style lang="scss">
.column--separated {
  position: relative;
  &:not(:last-of-type)::after {
    content: "";
    display: block;
    position: absolute;
    right: 0;
    width: 2px;
    height: 60%;
    top: 50%;
    transform: translateY(-50%);
    background-color: rgba(0, 0, 0, 0.1);
  }
}

.qv-section {
  &__title {
    display: block;
    margin-bottom: 1.5rem;
  }
}

.qv-card {
  display: flex;
  flex-flow: row nowrap;
  flex: 0 0 0;
  position: relative;

  &--centered {
    justify-content: center;
  }

  &__left {
    flex: 0;
    margin-right: 1rem;
  }

  &__right {
    display: flex;
    justify-content: center;
    flex-flow: column nowrap;
  }
}

.qv-column {
  display: flex;
  flex-flow: column nowrap;

  &__header {
    flex: 0;
    margin-bottom: 1rem;
  }

  &__body {
    display: flex;
    flex: 1;
    align-items: center;
    // Will change with new datepicker
    height: 270px;
  }
}
</style>
