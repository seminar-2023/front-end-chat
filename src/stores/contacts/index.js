import { defineStore } from 'pinia'

export const useContacts = defineStore('contacts', {
	actions: {
		setLastMessage(payload, id) {
			this.contacts.forEach(contact => {
				if (contact.id == id) contact.lastMessage = payload
			})
		},
		setCurrentKeyword(payload) {
			this.currentKeyword = payload
		}
	},
	state: () => {
		return {
			currentKeyword: '',
			contacts: [
				{
					id: 1,
					avatar: '/profile.jpg',
					name: 'Asistente',
					initial: 'JC',
					lastMessage: 'Hola Mundo',
					unReadMessage: 0,
					timestamp: '14:23',
					status: 'online'
				},
			]
		}
	}
})
