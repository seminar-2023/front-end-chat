

<template>
	<main class="fixed bottom-0 left-0 right-0">
		<section class="bg-primary items-center p-5 px-5 flex justify-evenly">
			<div class="w-10/12 text-gray-100 bg-secondary px-3 py-1 flex items-center rounded-xl">
				<textarea rows="2" v-model="textField" type="text" placeholder="Your message"
					class="bg-secondary w-full px-2 py-1 rounded-xl"></textarea>
			</div>
			<span>
				<i @click="newChat" class="active:scale-90 duration-300 fa fa-paper-plane text-indigo-600 text-3xl"></i>

				<i v-show="!muted" @click="changemuted"
					class="pl-5 active:scale-90 duration-300 fa fa-volume-mute text-indigo-600 text-3xl"></i>

				<i v-show="muted" @click="changemuted"
					class="pl-5 active:scale-90 duration-300 fa fa-volume-up text-indigo-600 text-3xl"></i>
			</span>
		</section>
	</main>
</template>

<script>

import { chatsState } from '@/common/chat'

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
			greetingSpeech: new window.SpeechSynthesisUtterance()
		}
	},
	mounted() {
		this.voiceList = this.synth.getVoices()

		if (this.voiceList.length) {
			this.isLoading = false
		}

		this.synth.onvoiceschanged = () => {
			this.voiceList = this.synth.getVoices()

		}

		this.listenForSpeechEvents()
		setTimeout(() => {
			this.greet('Hola buen dia, por favor escriba o dicte lo que quiere preguntar')
		}, 500);
	},

	methods: {

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
			// it should be 'craic', but it doesn't sound right
			if (!this.muted) {
				this.greetingSpeech.text = payload
				this.greetingSpeech.voice = this.voiceList[this.selectedVoice]
				this.synth.speak(this.greetingSpeech)
			}
		},
		newChat() {
			if (this.textField.length > 0) {
				setTimeout(async () => {
					chatsState.push({
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
					console.log(result.detail.answer)
					chatsState.push({
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
					console.log(chatsState)
				}, 500)

			}
		}
	}
}
</script>