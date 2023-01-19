<template>
	<main class="w-full py-5 pb-20">
		<template v-for="(chat, x) in chats" :key="x">
			<BallonChat :text="chat.text" :left="chat.left" />
		</template>
	</main>
	<main class="fixed bottom-0 left-0 right-0">
		<section class="bg-primary items-center p-5 px-5 flex justify-evenly">
			<div class="w-10/12 text-gray-100 bg-secondary px-3 py-1 flex items-center rounded-xl">
				<textarea rows="2" v-model="textField" type="text" placeholder="Escriba su mensaje"
					class="bg-secondary w-full px-2 py-1 rounded-xl"></textarea>
			</div>
			<span style="
    width: 20px;
">
				<i @click="newChat" class="active:scale-90 duration-300 fa fa-paper-plane text-indigo-600 text-3xl"></i>

				<i v-show="!muted" @click="changemuted"
					class="active:scale-90 duration-300 fa fa-volume-mute text-indigo-600 text-3xl"></i>

				<i v-show="muted" @click="changemuted"
					class="active:scale-90 duration-300 fa fa-volume-up text-indigo-600 text-3xl"></i>
			</span>
		</section>
	</main>
</template>

<script>
import BallonChat from '@/components/BallonChat.vue'
export default {
	data() {
		return {
			textField: '',
			muted: false,
			isLoading: true,
			name: '',
			selectedVoice: 148,
			synth: window.speechSynthesis,
			voiceList: [],
			greetingSpeech: new window.SpeechSynthesisUtterance(),
			chats: []
		}
	},
	props: {
		user: { type: Object }
	},
	components: {
		BallonChat
	},
	computed: {
	},

	mounted() {

		setTimeout(async () => {
			this.initialchat(this.user)
		}, 500)
		this.voiceList = this.synth.getVoices()
		if (this.voiceList.length) {
			this.isLoading = false
		}
		this.synth.onvoiceschanged = () => {
			this.voiceList = this.synth.getVoices()
		}
		this.listenForSpeechEvents()

	},

	methods: {
		async initialchat(payload) {
			if (payload.idUser == 0) {
				console.log('a')
				this.chats.push({
					text: 'Hola buen dia, por favor escriba o dicte lo que quiere preguntar',
					left: true,
					id: 1
				})
				this.greet('Hola buen dia, por favor escriba o dicte lo que quiere preguntar')
			} else {
				console.log('b')
				this.chats.push({
					text: `Hola buen dia ${payload.name} te vamos a enviar una recopilación de información`,
					left: true,
					id: 1
				})
				this.greet(this.chats[0].text)
				const result = await fetch('https://pro-equinox-374617.uc.r.appspot.com/v1/user/' + 1, {
					method: 'GET',
				})
					.then(function (response) {
						if (response.status != 200) {
							throw response.status;
						} else {
							return response.json();
						}
					});
				this.greet(result.detail.dateResume)
				this.chats.push({
					text: result.detail.dateResume,
					left: true,
					id: 1
				})
			}
			console.log(result)
		},
		changemuted() {
			this.muted = !this.muted
			console.log(this.muted)
		},
		listenForSpeechEvents() {
			this.greetingSpeech.onstart = () => {
				this.isLoading = true
			}

			this.greetingSpeech.onend = () => {
				this.isLoading = false
			}
		},
		greet(payload) {
			if (!this.muted) {
				this.greetingSpeech.text = payload
				this.greetingSpeech.voice = this.voiceList[this.selectedVoice]
				this.synth.speak(this.greetingSpeech)
			}
		},
		newChat() {
			if (this.textField.length > 0) {
				setTimeout(async () => {
					this.chats.push({
						text: this.textField,
						left: false,
						id: 1
					})
					const result = await fetch('https://pro-equinox-374617.uc.r.appspot.com/v1/ask?question=' + this.textField, {
						method: 'GET',
					})
						.then(function (response) {
							if (response.status != 200) {
								throw response.status;
							} else {
								return response.json();
							}
						});
					this.chats.push({
						text: result.detail.answer,
						left: true,
						id: 1
					})
					if (!this.muted) {
						this.greetingSpeech.text = `${result.detail.answer}`

						this.greetingSpeech.voice = this.voiceList[this.selectedVoice]

						this.synth.speak(this.greetingSpeech)
					}

					this.textField = ''
				}, 500)

			}
		}
	}
}
</script>
