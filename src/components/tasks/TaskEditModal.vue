<template>
  <BaseModal :showModal="showModal">
    <template v-slot:modal-title> Edit task </template>
    <template v-slot:modal-body>
      <VeeForm @submit="saveTask">
        <div class="mb-4">
          <label class="form-label" for="editedTitle"> Title </label>
          <VeeField
            id="editedTitle"
            name="title"
            type="text"
            v-model.trim="title"
            placeholder="Enter the title"
            rules="required|min:3"
            class="input-text"
          />
          <ErrorMessage name="title" class="text-red-600 text-sm" />
        </div>
        <div class="mb-4">
          <label for="status" class="form-label">
            <VeeField
              id="status"
              name="complete"
              type="checkbox"
              :value="true"
              v-model="complete"
              class="mr-2"
            />
            <span class="text-sm"> Task completed </span>
          </label>
        </div>
        <div class="mb-4">
          <div class="mb-4">
            <label for="assignedTo" class="form-label"> Assigned to </label>
            <VeeField
              as="select"
              id="assignedTo"
              name="assignedTo"
              v-model="assignedTo"
              class="select"
            >
              <option value="">-- None --</option>
              <option v-for="user in users" :key="user.id" :value="user.id">
                {{ user.name }}
              </option>
            </VeeField>
          </div>
        </div>
        <div class="bg-white py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button type="submit" class="btn-primary ml-2">Save</button>
          <button
            type="reset"
            class="btn-secondary"
            @click="$emit('close-task-modal')"
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

    saveTask(_, { resetForm }) {
      const updatedTask = {
        id: this.taskId,
        title: this.title,
        assignedTo: this.assignedTo,
        complete: this.complete || false
      };
      this.editTask(updatedTask);

      if (this.assignedTo !== this.taskAssignedTo) {
        this.changeTaskAssignedUser();
      }

      resetForm();
      this.$emit("close-task-modal");
    }
  }
};
</script>
