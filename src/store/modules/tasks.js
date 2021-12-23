const state = () => ({
  tasks: []
});

const getters = {
  getTaskById: (state) => (id) => {
    return state.tasks.find((task) => task.id === id);
  }
};

const actions = {
  addTask({ commit }, task) {
    commit("addTask", task);
  },

  editTask({ commit }, updatedTask) {
    commit("editTask", updatedTask);
  },

  deleteTask({ commit }, taskId) {
    commit("deleteTask", taskId);
  },

  unassignTasksFromUser({ commit }, payload) {
    commit("unassignTasksFromUser", payload);
  }
};

const mutations = {
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
    state.tasks.map((task) => {
      if (tasks.includes(task.id) && task.assignedTo === userId) {
        task.assignedTo = "";
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
