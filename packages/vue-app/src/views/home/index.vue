<script setup lang="ts">
import { Head } from '@vueuse/head'
import { useHomeStore } from './store'

const store = useHomeStore()

</script>

<template>
  <Head>
    <title>Home</title>
  </Head>
  <div>Home</div>
  <p>{{ store.name }}</p>
</template>
