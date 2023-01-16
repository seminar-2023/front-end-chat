<template>
	<div class="mt-4 mb-4 p-3 d-flex justify-content-center">
		<div class="card p-4">
			<span class="name mt-5">Bienvenido</span>
			<div class="camera-box justify-content-center align-items-center mt-5">
				<div v-if="isCameraOpen" v-show="!isLoading">
					<video v-show="!isPhotoTaken" ref="camera" :width="450" :height="337.5" autoplay></video>
					<canvas v-show="isPhotoTaken" id="photoTaken" ref="canvas" :width="337" :height="550"></canvas>
				</div>
				<div v-if="isCameraOpen && !isLoading" class="camera-shoot pt-10">
					<button type="button pb-10 primary" @click="takePhoto">
						<span v-show="!isPhotoTaken" class="name mt-3">Identificate</span>
						<span v-show="isPhotoTaken" class="name mt-3">Volver a identificarte</span>
					</button>
					<br />
					<button type="button-ask pt-10" @click="openChat">
						<span class="name mt-3">Preguntar</span>
					</button>
				</div>
			</div>
		</div>
	</div>
</template>
<script>

import { useRouter } from 'vue-router'
import { useContacts } from '@/stores/contacts'
export default {
	data() {
		return {
			isCameraOpen: false,
			isPhotoTaken: false,
			isShotPhoto: false,
			isLoading: false,
			link: '#'
		}
	},
	props: {
		contact: {
			type: Object
		}
	},
	mounted() {
		this.toggleCamera()
	},

	methods: {
		openChat() {
			setTimeout(() => {
				this.$router.push({ name: 'Chat', params: { id: this.contact.id } })
			}, 500)
		},
		toggleCamera() {
			if (this.isCameraOpen) {
				this.isCameraOpen = false;
				this.isPhotoTaken = false;
				this.isShotPhoto = false;
				this.stopCameraStream();
			} else {
				this.isCameraOpen = true;
				this.createCameraElement();
			}
		},

		createCameraElement() {
			this.isLoading = true;

			const constraints = (window.constraints = {
				audio: false,
				video: true
			});


			navigator.mediaDevices
				.getUserMedia(constraints)
				.then(stream => {
					this.isLoading = false;
					this.$refs.camera.srcObject = stream;
				})
				.catch(error => {
					this.isLoading = false;
					alert("May the browser didn't support or there is some errors.");
				});
		},

		stopCameraStream() {
			let tracks = this.$refs.camera.srcObject.getTracks();

			tracks.forEach(track => {
				track.stop();
			});
		},

		takePhoto() {
			if (!this.isPhotoTaken) {
				this.isShotPhoto = true;

				const FLASH_TIMEOUT = 50;

				setTimeout(() => {
					this.isShotPhoto = false;
				}, FLASH_TIMEOUT);
			}

			this.isPhotoTaken = !this.isPhotoTaken;

			const context = this.$refs.canvas.getContext('2d');
			context.drawImage(this.$refs.camera, 0, 0, 450, 337.5);
		},

		downloadImage() {
			const download = document.getElementById("downloadPhoto");
			const canvas = document.getElementById("photoTaken").toDataURL("image/jpeg")
				.replace("image/jpeg", "image/octet-stream");
			download.setAttribute("href", canvas);
		}
	}
}
</script>
<style  scoped>
::v-deep button {
	background-color: #008CBA;
	/* Green */
	border: none;
	color: white;
	padding: 15px 32px;
	text-align: center;
	text-decoration: none;
	display: inline-block;
	font-size: 16px;
	border-radius: 20px;
}


.camera-box {
	display: flex;
	justify-content: center;
	flex-direction: column;
	align-items: center;
}

* {
	margin: 0;
	padding: 0
}

body {
	background-color: #FFF
}

.card {
	text-align: center;
}

.image img {
	transition: all 0.5s
}

.card:hover .image img {
	transform: scale(1.5)
}

.btn {
	height: 140px;
	width: 140px;
	border-radius: 50%
}

.name {
	font-size: 22px;
	font-weight: bold;
	color: #fff;
}

.idd {
	font-size: 14px;
	font-weight: 600
}

.idd1 {
	font-size: 12px
}

.number {
	font-size: 22px;
	font-weight: bold
}

.follow {
	font-size: 12px;
	font-weight: 500;
	color: #444444
}

.btn1 {
	height: 40px;
	width: 150px;
	border: none;
	background-color: #000;
	color: #aeaeae;
	font-size: 15px
}

.text span {
	font-size: 13px;
	color: #545454;
	font-weight: 500
}

.icons i {
	font-size: 19px
}

hr .new1 {
	border: 1px solid
}

.camera-shoot {
	display: grid;
	grid-row: auto
}


.join {
	font-size: 14px;
	color: #a0a0a0;
	font-weight: bold
}

.date {
	background-color: #ccc
}
</style>