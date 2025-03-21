import { ref } from "vue";

export const $aiWatcher = ref({});

if (!window.$ai) {
  window.$ai = {
    callback(options) {
      $aiWatcher.value=options
    },
  };
}
