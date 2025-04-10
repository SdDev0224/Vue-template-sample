import {
  getPorts,
  getCountries
  // searchLocations
} from "../../api/geo";
import localforage from "localforage";

function initialState() {
  return {
    ports: [],
    countries: [],
    searchedLocations: []
  };
}

const geoModule = {
  state: initialState,
  mutations: {
    setPorts(state, ports) {
      state.ports = ports;
    },
    setCountries(state, countries) {
      state.countries = countries;
    },
    resetGeoState(state) {
      const s = initialState();
      Object.keys(s).forEach(key => {
        state[key] = s[key];
      });
    }
  },
  actions: {
    getPorts({ commit, state }) {
      if (state.ports.length) {
        console.info("No need to get ports, they are already in the store.");
        return Promise.resolve();
      } else {
        return new Promise((resolve, reject) => {
          localforage
            .getItem("contract_ports")
            .then(ports => {
              if (!ports) {
                // Ports are not in BS, fetch them from the API.
                getPorts()
                  .then(({ data: apiPorts }) => {
                    // Cache them in BS
                    localforage
                      .setItem("contract_ports", apiPorts)
                      .then(() => {
                        console.info(
                          "Ports have been fetched from the API and stored in browser storage."
                        );
                        resolve();
                      })
                      .catch(() => {
                        console.error(
                          "Unable to cache ports in browser storage."
                        );
                        resolve();
                      })
                      .finally(() => {
                        commit("setPorts", apiPorts);
                      });
                  })
                  .catch(error => {
                    if (error.response) {
                      reject(error.response.data.message);
                    } else {
                      reject(error);
                    }
                  });
              } else {
                // Ports are already cached in BS
                console.info("Ports have been fetched from browser storage.");
                commit("setPorts", ports);
                resolve();
              }
            })
            .catch(() => {});
        });
      }
    },
    getCountries({ commit, state }) {
      if (state.countries.length) {
        console.info(
          "No need to get countries list, they are already in the store."
        );
        return Promise.resolve();
      } else {
        return new Promise((resolve, reject) => {
          localforage
            .getItem("contract_countries")
            .then(countries => {
              if (!countries) {
                // Ports are not in BS, fetch them from the API.
                getCountries()
                  .then(({ data: apiCountries }) => {
                    // Cache them in BS
                    localforage
                      .setItem("contract_countries", apiCountries)
                      .then(() => {
                        console.info(
                          "Countries have been fetched from the API and stored in browser storage."
                        );
                        resolve();
                      })
                      .catch(() => {
                        console.error(
                          "Unable to cache countries in browser storage."
                        );
                        resolve();
                      })
                      .finally(() => {
                        commit("setCountries", apiCountries);
                      });
                  })
                  .catch(error => {
                    if (error.response) {
                      reject(error.response.data.message);
                    } else {
                      reject(error);
                    }
                  });
              } else {
                // Ports are already cached in BS
                console.info(
                  "Countries have been fetched from browser storage."
                );
                commit("setCountries", countries);
                resolve();
              }
            })
            .catch(() => {});
        });
      }
    }
  },
  getters: {
    getPortById: state => id => {
      return state.ports.find(port => port.id === Number(id));
    },
    getCountryById: state => id => {
      return state.ports.find(port => port.id === Number(id));
    }
  }
};

export default geoModule;
