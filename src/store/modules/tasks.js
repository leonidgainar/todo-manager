const state = () => ({
  tasks: []
});

const getters = {
  getTaskById: (state) => (id) => {
    return state.tasks.find((task) => task.id === id);
  }
};

const actions = {
  setTasks({ commit }, tasks) {
    commit("setTasks", tasks);
  },
  addTask({ commit }, task) {
    commit("addTask", task);
  },
  editTask({ commit }, updatedTask) {
    commit("editTask", updatedTask);
  },
  deleteTask({ commit }, taskId) {
    commit("deleteTask", taskId);
  },
  unassignTasksFromUser({ commit }, user) {
    commit("unassignTasksFromUser", user);
  }
};

const mutations = {
  setTasks(state, tasks) {
    state.tasks = tasks;
  },
  addTask(state, task) {
    state.tasks.push(task);
  },
  editTask(state, updatedTask) {
    const taskIndex = state.tasks.findIndex(
      (task) => task.id === updatedTask.id
    );
    if (taskIndex !== -1) {
      state.tasks[taskIndex] = updatedTask;
    }
  },
  deleteTask(state, taskId) {
    state.tasks = state.tasks.filter((task) => task.id !== taskId);
  },
  unassignTasksFromUser(state, payload) {
    const { userId, tasks } = payload;
    tasks.forEach((taskId) => {
      const taskIndex = state.tasks.findIndex((task) => task.id === taskId);
      if (taskIndex !== -1) {
        state.tasks[taskIndex].assignedTo === userId
          ? (state.tasks[taskIndex].assignedTo = "")
          : state.tasks[taskIndex].assignedTo;
      }
    });
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
