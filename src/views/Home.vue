<template>
	<main class="pb-24 pt-8">
		<Header>
			<template v-slot:center class="">
				<span class="font-medium text-2xl">Chat</span>
			</template>
		</Header>
		<RoomHome :contact="contacts[0]" />
		<Navbar />
	</main>
</template>

<script setup>
import { useContacts } from '@/stores/contacts'
import { computed, watch, ref } from 'vue'
import Header from '@/components/Header.vue'
import Navbar from '@/components/Navbar.vue'
import Searchbar from '@/components/Searchbar.vue'
import Contacts from '@/components/Contacts.vue'
import RoomHome from '../components/RoomHome.vue'

const contacts = ref(useContacts().contacts)

const searchAction = () => {
	const currentKeyword = computed(() => useContacts().currentKeyword)
	contacts.value = useContacts().contacts.filter(contact => contact.name.toLowerCase().includes(currentKeyword.value.toLowerCase()))
}

</script>
