<template>
  <SchemaRenderer :schema="schemaObj"></SchemaRenderer>
</template>

<script setup>
import SchemaRenderer from "@opentiny/tiny-schema-renderer";
import { computed } from "vue";

const props = defineProps({
  schema: {
    type: String,
    required: true,
    default: () => "",
  },
});

const schemaObj = computed(() => {
  return JSON.parse(props.schema)
});
</script>
<style>
@import url("@opentiny/vue-theme/index.css");
</style>
