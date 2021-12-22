<template>
  <div v-if="tasks.length" class="min-w-full sm:px-6 lg:px-4">
    <h1 class="text-2xl font-bold">Tasks</h1>
    <div class="shadow border-b border-gray-200 sm:rounded mt-4">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              v-for="header in tableHeaders"
              :key="header"
            >
              {{ header }}
            </th>

            <th class="px-6 py-3">
              <span class="sr-only">Edit</span>
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="task in tasks" :key="task.id">
            <td class="px-6 py-4 text-left">
              {{ task.title }}
            </td>
            <td class="px-6 py-4 text-left">
              <span v-if="task.assignedTo">
                {{ getUserById(task.assignedTo).name }}
              </span>
              <span v-else> N/A </span>
            </td>
            <td class="py-4 text-left">
              <TaskStatusLabel :status="task.complete" />
            </td>
            <td class="px-6 py-4 text-right text-xs">
              <button
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                @click="editTask(task)"
              >
                Edit
              </button>
              <button
                class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 ml-2 mt-2 md:mt-0 rounded"
                @click="deleteAndUnassignTask(task)"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <TaskEditModal
    @close-task-modal="closeEditModal()"
    v-bind="{
      showModal: showEditModal,
      taskId: currentTask.id,
      taskTitle: currentTask.title,
      taskAssignedTo: currentTask.assignedTo,
      taskComplete: currentTask.complete
    }"
  />
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapState: mapStateTasks, mapActions: mapActionsTasks } =
  createNamespacedHelpers("tasks");
const { mapGetters: mapGettersUsers, mapActions: mapActionsUsers } =
  createNamespacedHelpers("users");

import TaskStatusLabel from "../tasks/TaskStatusLabel.vue";
import TaskEditModal from "../tasks/TaskEditModal.vue";

export default {
  name: "TaskList",
  components: {
    TaskStatusLabel,
    TaskEditModal
  },

  data() {
    return {
      tableHeaders: ["title", "assigned to", "status"],
      currentTask: {
        id: "",
        title: "",
        assignedTo: "",
        complete: false
      },
      showEditModal: false
    };
  },

  computed: {
    ...mapStateTasks(["tasks"]),
    ...mapGettersUsers(["getUserById"])
  },

  methods: {
    ...mapActionsTasks(["deleteTask"]),
    ...mapActionsUsers(["deleteTaskFromUser"]),

    deleteAndUnassignTask(task) {
      this.deleteTask(task.id);
      if (task.assignedTo) {
        this.deleteTaskFromUser({ taskId: task.id, userId: task.assignedTo });
      }
    },

    editTask(task) {
      this.currentTask = task;
      this.showEditModal = true;
    },

    closeEditModal() {
      this.currentTask = {};
      this.showEditModal = false;
    }
  }
};
</script>
