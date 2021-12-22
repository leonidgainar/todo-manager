<template>
  <BaseModal :showModal="showModal">
    <template v-slot:modal-title> Edit task </template>
    <template v-slot:modal-body>
      <div class="mb-4">
        <VeeForm>
          <label
            class="block text-gray-700 text-md font-bold mb-2 text-left"
            for="editedTitle"
          >
            Title
          </label>
          <VeeField
            id="editedTitle"
            name="title"
            type="text"
            v-model.trim="title"
            placeholder="Enter the title"
            rules="required|min:3"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <ErrorMessage name="title" class="text-red-600 text-sm" />
        </VeeForm>
      </div>
      <div class="mb-4">
        <label
          for="completed"
          class="block text-gray-700 text-md font-bold mb-2 text-left"
        >
          <input
            id="completed"
            type="checkbox"
            v-model="complete"
            class="mr-2"
          />
          <span class="text-sm"> Task completed </span>
        </label>
      </div>
      <div class="mb-4">
        <div class="mb-4">
          <label
            for="assignedTo"
            class="block text-gray-700 text-md font-bold mb-2 text-left"
          >
            Assigned to
          </label>
          <select
            id="assignedTo"
            v-model="assignedTo"
            class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          >
            <option value="">-- None --</option>
            <option v-for="user in users" :key="user.id" :value="user.id">
              {{ user.name }}
            </option>
          </select>
        </div>
      </div>
    </template>
    <template v-slot:modal-actions>
      <button
        type="button"
        class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
        @click="saveTask()"
      >
        Save
      </button>
      <button
        type="button"
        class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
        @click="$emit('close-task-modal')"
      >
        Cancel
      </button>
    </template>
  </BaseModal>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapState: mapStateUsers, mapActions: mapActionsUsers } =
  createNamespacedHelpers("users");
const { mapActions: mapActionsTasks } = createNamespacedHelpers("tasks");

import BaseModal from "../BaseModal.vue";

export default {
  components: {
    BaseModal
  },

  props: {
    showModal: {
      type: Boolean,
      default: false
    },
    taskId: {
      type: String,
      default: ""
    },
    taskTitle: {
      type: String,
      default: ""
    },
    taskAssignedTo: {
      type: String,
      default: ""
    },
    taskComplete: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      title: "",
      assignedTo: "",
      complete: false
    };
  },

  watch: {
    taskTitle() {
      this.title = this.taskTitle;
    },
    taskAssignedTo() {
      this.assignedTo = this.taskAssignedTo;
    },
    taskComplete() {
      this.complete = this.taskComplete;
    }
  },

  computed: {
    ...mapStateUsers(["users"])
  },

  methods: {
    ...mapActionsTasks(["editTask"]),
    ...mapActionsUsers(["addTaskToUser", "deleteTaskFromUser"]),

    changeTaskAssignedUser() {
      this.deleteTaskFromUser({
        userId: this.taskAssignedTo,
        taskId: this.taskId
      });
      this.addTaskToUser({ userId: this.assignedTo, taskId: this.taskId });
    },

    saveTask() {
      const updatedTask = {
        id: this.taskId,
        title: this.title,
        assignedTo: this.assignedTo,
        complete: this.complete
      };
      this.editTask(updatedTask);

      if (this.assignedTo !== this.taskAssignedTo) {
        this.changeTaskAssignedUser();
      }

      this.$emit("close-task-modal");
    }
  }
};
</script>
