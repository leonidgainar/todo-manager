<template>
  <BaseModal :showModal="showModal">
    <template v-slot:modal-title> Edit user </template>
    <template v-slot:modal-body>
      <VeeForm @submit="saveUser">
        <div class="mb-4">
          <label class="form-label" for="editedName"> Name </label>
          <VeeField
            id="editedName"
            name="name"
            type="text"
            v-model.trim="name"
            placeholder="Enter the name"
            :rules="{
              required: true,
              min: 3,
              max: 64,
              unique: nameWasChanged ? [getUsersName] : false
            }"
            class="input-text"
          />
          <ErrorMessage name="name" class="text-red-600 text-sm" />
        </div>
        <div class="mb-4">
          <label class="form-label mt-4" for="tasks"> Tasks </label>
          <ul v-if="tasks.length" id="tasks">
            <li v-for="task in tasks" :key="task">
              <div
                class="flex py-2 border-solid border-b-2 w-full justify-between"
              >
                <div>
                  {{ getTaskById(task).title }}
                  <TaskStatusLabel
                    class="ml-4"
                    :status="getTaskById(task).complete"
                  />
                </div>
                <button @click="deleteTaskFromList(task)">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 fill-red-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </li>
          </ul>
          <div v-else>This user doesn't have some tasks assigned to them.</div>
        </div>
        <div class="bg-white py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button type="submit" class="btn-primary ml-2">Save</button>
          <button
            type="reset"
            class="btn-secondary"
            @click="$emit('close-user-modal')"
          >
            Cancel
          </button>
        </div>
      </VeeForm>
    </template>
  </BaseModal>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapGetters: mapGettersUsers, mapActions: mapActionsUsers } =
  createNamespacedHelpers("users");
const { mapGetters: mapGettersTasks, mapActions: mapActionsTasks } =
  createNamespacedHelpers("tasks");

import BaseModal from "../BaseModal.vue";
import TaskStatusLabel from "../tasks/TaskStatusLabel.vue";

export default {
  components: {
    BaseModal,
    TaskStatusLabel
  },

  props: {
    showModal: {
      type: Boolean,
      default: false
    },
    userId: {
      type: String,
      default: ""
    },
    userName: {
      type: String,
      default: ""
    },
    userTasks: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      name: "",
      tasks: [],
      tasksToDelete: []
    };
  },

  watch: {
    userName() {
      this.name = this.userName;
    },
    userTasks() {
      this.tasks = this.userTasks;
    }
  },

  computed: {
    ...mapGettersTasks(["getTaskById"]),
    ...mapGettersUsers(["getUsersName"]),

    nameWasChanged() {
      return this.name !== this.userName;
    }
  },

  methods: {
    ...mapActionsUsers(["editUser"]),
    ...mapActionsTasks(["unassignTasksFromUser"]),

    deleteTaskFromList(taskId) {
      this.tasks = this.tasks.filter((task) => task !== taskId);
      this.tasksToDelete.push(taskId);
    },

    deleteAssignedTasks() {
      this.unassignTasksFromUser({
        userId: this.userId,
        tasks: this.tasksToDelete
      });
      this.tasksToDelete = [];
    },

    saveUser(_, { resetForm }) {
      const updatedUser = {
        id: this.userId,
        name: this.name,
        tasks: this.tasks
      };
      this.editUser(updatedUser);

      if (this.tasksToDelete.length) {
        this.deleteAssignedTasks();
      }

      resetForm();
      this.$emit("close-user-modal");
    }
  }
};
</script>
