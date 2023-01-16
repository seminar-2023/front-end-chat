<template>
	<nav>
		<section class="fixed bottom-0 left-0 right-0">
			<section
				class="w-full md:px-28 md:mx-auto flex justify-between items-center px-6 py-5 text-gray-100 bg-primary lg:p-5">
			</section>
		</section>
	</nav>
</template>

<script setup>

import { ref } from 'vue'
import menu from '@/menu.js'

const active = ref('Chats')

</script>
