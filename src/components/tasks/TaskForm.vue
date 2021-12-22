<template>
  <div class="w-full max-w-xl py-8 px-4">
    <h1 class="text-2xl font-bold">Add new task</h1>
    <VeeForm
      @submit="addNewTask"
      class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
    >
      <div class="mb-4">
        <label
          for="title"
          class="block text-gray-700 text-md font-bold mb-2 text-left"
        >
          Title
        </label>
        <VeeField
          id="title"
          name="title"
          type="text"
          v-model.trim="title"
          placeholder="Enter the title"
          rules="required|min:3"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        <ErrorMessage name="title" class="text-red-600 text-sm" />
      </div>
      <div class="mb-4">
        <label
          for="completed"
          class="block text-gray-700 text-md font-bold mb-2 text-left"
        >
          <input
            id="completed"
            type="checkbox"
            v-model="completed"
            class="mr-2"
          />
          <span class="text-sm"> Task completed </span>
        </label>
      </div>
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
          <option value="" disabled>-- None --</option>
          <option v-for="user in users" :key="user.id" :value="user.id">
            {{ user.name }}
          </option>
        </select>
      </div>
      <button
        type="submit"
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Add task
      </button>
    </VeeForm>
  </div>
</template>

<script>
import { nanoid } from "nanoid";
import { createNamespacedHelpers } from "vuex";
const { mapState: mapStateUsers, mapActions: mapActionsUsers } =
  createNamespacedHelpers("users");
const { mapActions: mapActionsTasks } = createNamespacedHelpers("tasks");

export default {
  name: "TaskForm",

  data() {
    return {
      title: "",
      completed: false,
      assignedTo: ""
    };
  },

  computed: {
    ...mapStateUsers(["users"])
  },

  methods: {
    ...mapActionsTasks(["addTask"]),
    ...mapActionsUsers(["addTaskToUser"]),

    addNewTask(values, { resetForm }) {
      const taskId = nanoid();
      this.addTask({
        id: taskId,
        title: this.title,
        complete: this.completed,
        assignedTo: this.assignedTo
      });
      this.addTaskToUser({ userId: this.assignedTo, taskId });
      resetForm();
    }
  }
};
</script>

<style scoped></style>
