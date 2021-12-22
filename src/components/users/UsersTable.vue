<template>
  <div v-if="users.length" class="min-w-full sm:px-6 lg:px-6">
    <h1 class="text-2xl font-bold">Users</h1>
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
          <tr v-for="user in users" :key="user.id">
            <td class="px-6 py-4 text-left align-top">
              {{ user.name }}
            </td>
            <td class="px-6 py-4 text-left align-top">
              <div
                v-for="task in user.tasks"
                :key="task"
                class="text-gray-900 mb-2"
              >
                {{ getTaskById(task)?.title }}
                <TaskStatusLabel :status="getTaskById(task)?.complete" />
              </div>
            </td>
            <td class="px-6 py-4 align-top text-right text-xs">
              <button
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                @click="editUser(user)"
              >
                Edit
              </button>
              <button
                class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 ml-2 mt-2 md:mt-0 rounded"
                @click="deleteUserAndUnassignTask(user)"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <UserEditModal
    @close-user-modal="closeEditModal()"
    v-bind="{
      showModal: showEditModal,
      userId: currentUser.id,
      userName: currentUser.name,
      userTasks: currentUser.tasks
    }"
  />
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapState: mapStateUsers, mapActions: mapActionsUsers } =
  createNamespacedHelpers("users");
const { mapGetters: mapGettersTasks, mapActions: mapActionsTasks } =
  createNamespacedHelpers("tasks");

import TaskStatusLabel from "../tasks/TaskStatusLabel.vue";
import UserEditModal from "../users/UserEditModal.vue";

export default {
  name: "UserList",
  components: {
    TaskStatusLabel,
    UserEditModal
  },

  data() {
    return {
      tableHeaders: ["name", "tasks"],
      currentUser: {
        id: "",
        name: "",
        tasks: []
      },
      showEditModal: false
    };
  },

  computed: {
    ...mapStateUsers(["users"]),
    ...mapGettersTasks(["getTaskById"])
  },

  methods: {
    ...mapActionsUsers(["deleteUser"]),
    ...mapActionsTasks(["unassignTasksFromUser"]),

    deleteUserAndUnassignTask(user) {
      this.deleteUser(user.id);
      if (user.tasks.length) {
        this.unassignTasksFromUser({ userId: user.id, tasks: user.tasks });
      }
    },

    editUser(user) {
      this.currentUser = user;
      this.showEditModal = true;
    },

    closeEditModal() {
      this.currentUser = {};
      this.showEditModal = false;
    }
  }
};
</script>
