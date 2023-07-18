<!-- CommonIcon -->
<template>
  <svg class="base-icon" aria-hidden="true">
    <use :xlink:href="`#${icon}`"></use>
  </svg>
</template>
<script lang="ts" setup>
defineProps({
  icon: { type: String, required: true },
});
</script>

<style scoped>
.base-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
