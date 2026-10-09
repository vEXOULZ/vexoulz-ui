<script setup lang="ts">
// Provides an Account backed by a fake vexoulz-auth, so stories can show <VxAccount> without the service.
import { provide } from 'vue'
import { ACCOUNT_KEY, createAccount } from '../../src/account'

const props = defineProps<{ signedIn?: boolean; off?: boolean }>()
const me = { id: '1', login: 'vexoulz', displayName: 'vexoulz', avatar: null, color: '#9146FF', csrf: 'x' }
const account = createAccount({
  authBase: props.off ? '' : 'https://auth.example',
  fetch: async () => (props.signedIn ? new Response(JSON.stringify(me), { status: 200 }) : new Response('{}', { status: 401 })),
  navigate: () => {},
})
void account.refresh()
provide(ACCOUNT_KEY, account)
</script>

<template><slot></slot></template>
