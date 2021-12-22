import { createStore, createLogger } from "vuex";
import createPersistedState from "vuex-persistedstate";

import users from "./modules/users";
import tasks from "./modules/tasks";

const debug = process.env.NODE_ENV !== "production";

const dataState = createPersistedState({
  paths: ["users", "tasks"],
});

export default createStore({
  modules: {
    users,
    tasks,
  },
  strict: debug,
  plugins: debug ? [createLogger(), dataState] : [dataState],
});
