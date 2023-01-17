

const state = {
	chats: [{
		text: 'Hola buen dia, por favor escriba o dicte lo que quiere preguntar',
		left: true,
		id: 1
	}]
}

const getters = {
	chats: (state) => {
		return state.chats;
	},
}

const actions = {
	addingNewChat(payload) {
		this.chats.push(payload)
	}
}

const mutations = {
}

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations,
}
