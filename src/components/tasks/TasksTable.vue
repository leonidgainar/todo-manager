<template>
  <div v-if="tasks.length" class="min-w-full sm:px-6 lg:px-4">
    <h1 class="text-2xl font-bold">Tasks</h1>
    <table class="min-w-full table-container">
      <thead class="bg-gray-50">
        <tr>
          <th class="table-header" v-for="header in tableHeaders" :key="header">
            {{ header }}
          </th>

          <th class="px-6 py-3">
            <span class="sr-only">Edit</span>
          </th>
        </tr>
      </thead>
      <tbody class="table-body">
        <tr v-for="task in tasks" :key="task.id">
          <td class="px-6 py-4 text-left">
            <span :title="task.title">
              {{ truncateText(task.title) }}
            </span>
          </td>
          <td class="px-6 py-4 text-left">
            <span
              v-if="task.assignedTo"
              :title="getUserById(task.assignedTo)?.name"
            >
              {{ truncateText(getUserById(task.assignedTo)?.name) }}
            </span>
            <span v-else> N/A </span>
          </td>
          <td class="py-4 text-left">
            <TaskStatusLabel :status="task.complete" />
          </td>
          <td class="px-6 py-4 text-right text-xs">
            <button class="btn-primary mb-2" @click="editTask(task)">
              Edit
            </button>
            <button
              class="btn-danger ml-2"
              @click="deleteAndUnassignTask(task)"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
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
  name: "TasksTable",
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
    },

    truncateText(text, length = 20, suffix = "...") {
      if (text.length > length) {
        return text.substring(0, length) + suffix;
      } else {
        return text;
      }
    }
  }
};
</script>
