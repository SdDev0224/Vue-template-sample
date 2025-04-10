<template>
  <div>
    <header class="header">
      <div class="header__content">
        <div class="header__logo">
          <img src="../assets/img/home/logo@1x.svg" width="180" />
        </div>
        <div class="header__buttons">
          <router-link
            class="control button is-outlined is-link is-inverted is-medium"
            :to="{ name: 'Login' }"
            >Log in</router-link
          >
          <router-link
            class="control button is-link is-inverted is-medium"
            :to="{ name: 'Registration' }"
            >Sign up</router-link
          >
        </div>
      </div>
    </header>

    <div class="hero is-fullheight landing">
      <div class="hero-body">
        <div class="container">
          <div class="columns is-vcentered">
            <div class="column">
              <img
                style="padding: 1rem;"
                src="../assets/img/home/Boat@2x.png"
              />
            </div>
            <div class="column">
              <h1 class="serif has-text-weight-bold">
                The Charter Supervision Software
              </h1>
              <p>
                Discover <b>Contract .pro</b>, the complete toolbox to create
                and manage charter agreements. Benefit from the attractive tax
                scheme and secured legal framework of the new Cruise Agreement.
                Connect with other professionals to prepare your draft, collect
                eSignature and close a deal in minutes!
              </p>
              <router-link
                :to="{ name: 'Registration' }"
                class="button is-link is-inverted is-medium"
                >Create an account</router-link
              >
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="hero">
      <div class="hero-body">
        <div class="container">
          <div
            v-for="(feature, featureIndex) in features"
            :key="featureIndex"
            class="columns is-vcentered home-feature"
          >
            <div
              class="column is-7"
              :style="isIndexEven(featureIndex) ? null : 'order: 2;'"
            >
              <div class="columns">
                <div
                  :class="[
                    'column',
                    !isIndexEven(featureIndex) ? 'is-2' : 'is-1'
                  ]"
                ></div>
                <div class="column">
                  <img
                    :src="require(`../assets/img/home/${feature.picture}`)"
                    :style="{ 'max-height': feature.imageHeight + 'px' }"
                  />
                </div>
                <div
                  :class="[
                    'column',
                    isIndexEven(featureIndex) ? 'is-2' : 'is-1'
                  ]"
                ></div>
              </div>
            </div>
            <div class="column is-5">
              <span class="home-feature__number has-text-weight-bold"
                >0{{ featureIndex + 1 }}</span
              >
              <h2
                class="title is-3 serif has-text-weight-bold home-feature__title"
              >
                {{ feature.title }}
              </h2>
              <p class="home-feature__body-text" v-html="feature.body"></p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="hero waves">
      <div class="hero-body">
        <div class="container has-text-centered">
          <div class="title is-3 serif has-text-white">
            Try Contract for free
          </div>
          <div>
            <p>
              Already own an account ?
              <router-link
                :to="{ name: 'Login' }"
                class="has-text-white is-underlined"
                >Log in</router-link
              >
            </p>
          </div>
          <router-link
            :to="{ name: 'Registration' }"
            class="button is-white is-outlined is-large"
            >Create an account</router-link
          >
        </div>
      </div>
    </div>

    <footer class="footer">
      <div class="container">
        <div class="content has-text-centered">
          <img class="footer__logo" src="../assets/img/home/logo-grey@1x.svg" />
          <p>©2018 Contract. All Rights Reserved</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      features: [
        {
          title: "Boost profits by increasing efficiency",
          body: `Let Contract suggest the best option for both your client and yourself and provide a secured legal framework for the yacht owner.<br>Maintain the focus on your business from lead to deal.`,
          picture: "illu-01@2x.png",
          imageHeight: 360
        },
        {
          title: "Keep your collaborations swift and secure",
          body: `Keep your working relationships swift and secure
                Save time for everyone: connect instantly with brokers, agents, yacht owners and other stakeholders in a secure environment.<br>Reach agreements faster through live collaboration.`,
          picture: "illu-02@2x.png",
          imageHeight: 260
        },
        {
          title: "Generate Contracts with unique tools",
          body: `Your interface offers unique tools to optimize prices using the new Cruise Agreement. Benefit from legally backed tax-reductions.<br>Compare prices and commissions between different types of charter agreements.`,
          picture: "illu-03@2x.png",
          imageHeight: 360
        },
        {
          title: "Streamline the process with eSignature",
          body:
            "Offer all parties a ready-to-sign agreement and the advantage of legally-binding and officially-recognized ID and eSignature processes.",
          picture: "illu-04@2x.png",
          imageHeight: 300
        }
      ]
    };
  },
  methods: {
    isIndexEven(index) {
      return index % 2 === 0;
    }
  }
};
</script>

<style lang="scss" scoped>
$headerHeight: 80px;

.header {
  position: absolute;
  top: 0;

  display: flex;
  justify-content: center;

  height: $headerHeight;
  width: 100%;

  padding: 1rem;
  background-color: transparent;

  &__content {
    display: flex;
    justify-content: space-between;
    flex-flow: row nowrap;
    width: 100%;
    max-width: $fullhd;
  }

  &__logo {
    display: inline-flex;
    align-items: center;
    flex: 1 0 auto;
  }

  &__buttons {
    display: flex;
    flex-flow: nowrap;
    flex: 0;

    & > *:not(:last-child) {
      margin-right: 1rem;
    }
  }
}

.button {
  font-size: 1rem !important;
  height: 3rem;
  padding: 0.5rem 1rem;
}

.landing {
  background-image: linear-gradient(to bottom right, #1badd9, #010a4f);
  color: white;

  .hero-body {
    padding-top: $headerHeight;
  }

  h1 {
    font-size: 4rem;
  }

  p {
    margin: 2rem 0;
    line-height: 2rem;
  }
}

.waves {
  height: 100%;
  max-height: 460px;
  background-size: 100% 100%;
  background-image: url("../assets/img/home/bg@2x.png");
  color: white;

  .hero-body {
    display: flex;
    align-items: center;
  }

  .button {
    margin-top: 2rem;
  }
}

.home-feature {
  margin-bottom: 8rem !important;

  &__number {
    color: #dfe6ee;
    font-size: 115px;
  }

  &__body-text {
    line-height: 1.75rem;
  }
}

.footer {
  &__logo {
    margin-bottom: 1.5rem;
  }
}
</style>
