<script setup lang="ts">
// A link that uses RouterLink for `to` when vue-router is installed, and a plain <a> otherwise.
// The library doesn't depend on vue-router, so this checks the app at runtime.
import { computed, getCurrentInstance } from 'vue'

const props = defineProps<{ to?: string; href?: string; external?: boolean }>()
const RouterLink = getCurrentInstance()?.appContext.components.RouterLink
const useRouter = computed(() => !!props.to && !!RouterLink)
</script>

<template>
  <component :is="RouterLink" v-if="useRouter" :to="to"><slot></slot></component>
  <a
    v-else
    :href="href ?? to"
    :target="external ? '_blank' : undefined"
    :rel="external ? 'noopener' : undefined"
  ><slot></slot></a>
</template>
