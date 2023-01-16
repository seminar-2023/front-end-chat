import { defineStore } from 'pinia'

export const useChats = defineStore('chats', {
	state: () => {
		return {
			chats: [
			]
		}
	},
	actions: {
		addingNewChat(payload) {
			this.chats.push(payload)
		}
	}
})
