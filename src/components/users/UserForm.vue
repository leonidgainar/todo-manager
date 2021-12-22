<template>
  <div class="w-full max-w-xl py-8 px-4">
    <h1 class="text-2xl font-bold">Add new user</h1>
    <VeeForm
      @submit="addNewUser"
      class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
    >
      <div class="mb-4">
        <label
          class="block text-gray-700 text-md font-bold mb-2 text-left"
          for="name"
        >
          Name
        </label>
        <VeeField
          id="name"
          type="text"
          name="name"
          v-model.trim="name"
          placeholder="Enter the name"
          rules="required|min:3"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        <ErrorMessage name="name" class="text-red-600 text-sm" />
      </div>
      <button
        type="submit"
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Add user
      </button>
    </VeeForm>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapActions } = createNamespacedHelpers("users");

export default {
  name: "UserForm",

  data() {
    return {
      name: ""
    };
  },

  methods: {
    ...mapActions(["addUser"]),

    addNewUser(values, { resetForm }) {
      this.addUser({ name: this.name, tasks: [] });
      resetForm();
    }
  }
};
</script>

<style scoped></style>
