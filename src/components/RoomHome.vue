<template>
	<div class="mt-4 mb-4 p-3 d-flex justify-content-center">
		<div class="card p-4">
			<span class="name mt-5">Bienvenido</span>
			<div class="camera-box justify-content-center align-items-center mt-5">
				<div v-if="isCameraOpen" v-show="!isLoading">
					<video v-show="!isPhotoTaken" ref="camera" :width="320" :height="240" autoplay></video>
					<canvas v-show="isPhotoTaken" id="photoTaken" ref="canvas" :width="320" :height="240"></canvas>
				</div>
				<div v-if="isCameraOpen && !isLoading" class="camera-shoot pt-10">
					<button v-show="!isPhotoTaken" type="button pb-10 primary" @click="takePhoto">
						<span class="name mt-3">Identificate</span>
					</button>
					<button v-show="isPhotoTaken" type="button pb-10 primary" @click="takePhoto">
						<span class="name mt-3">Volver a identificarte</span>
					</button>
					<br />
					<button type="button-ask pt-10" @click="openChat({ id: 0, name: '' })">
						<span class="name mt-3">Preguntar</span>
					</button>
				</div>
				<div v-show="false">
					<img id="orgImg" :src="img1" />
					<br />
					<img id="detImg" :src="img2" />
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import * as faceapi from "face-api.js";
export default {

	data() {
		return {
			distance: 0,
			desc: [],
			orgImgEl: null,
			detImgEl: null,
			img1: '',
			img2: '',
			isCameraOpen: false,
			isPhotoTaken: false,
			isShotPhoto: false,
			isLoading: false,
			link: '#',
			height: 450,
			width: 337,
			umbral: 0.50,
			contacts: [
				{
					id: 1,
					name: 'Daniel Solano',
					url: '/img/daniel/daniel2.jpeg'
				}, {
					id: 2,
					name: 'Michelle Penna',
					url: '/img/michelle/michelle3.jpeg'
				},
				{
					id: 3,
					name: 'Mateo Ceballos',
					url: '/img/mateo/mateo3.jpeg'
				},
			]
		}
	},
	props: {
		contact: {
			type: Object
		}
	},
	mounted() {
		this.toggleCamera()
		this.$nextTick(() => {
			this.initModel()
		});
	},
	methods: {
		async initModel() {
			const MODEL_URL = '/models'
			console.log(MODEL_URL)
			//https://chat-interactivo.netlify.app
			Promise.all([
				await faceapi.loadFaceRecognitionModel('https://chat-interactivo.netlify.app/models')]).then((val) => {
					// console here gives an array of undefined
					console.log(val)
				}).catch((err) => {
					console.log(err)
				})
		},
		openChat(payload) {
			setTimeout(() => {
				this.$router.push({ name: 'Chat', params: { id: this.contact.id, idUser: payload.id, name: payload.name } })
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

		async takePhoto() {
			if (!this.isPhotoTaken) {
				this.isShotPhoto = true;

				const FLASH_TIMEOUT = 50;

				setTimeout(() => {
					this.isShotPhoto = false;
				}, FLASH_TIMEOUT);
			}

			this.isPhotoTaken = !this.isPhotoTaken;
			const context = this.$refs.canvas.getContext('2d');
			context.drawImage(this.$refs.camera, 0, 0, 320, 240);
			await this.comparation()
		},
		async comparation() {
			let userfind
			for (let index = 0; index < this.contacts.length; index++) {
				userfind = await this.faceRecognition(document.getElementById("photoTaken"), index)
			}
			if (userfind != null) {
				this.openChat(userfind)
			}
		},
		async faceRecognition(currentImg, item) {
			let distance
			let desc
			let detImgEl = document.getElementById("detImg");
			this.img2 = this.contacts[item].url
			Promise.all([desc = [
				await faceapi.computeFaceDescriptor(currentImg),
				await faceapi.computeFaceDescriptor(detImgEl),
			]])
			Promise.all([distance = faceapi
				.euclideanDistance(desc[0], desc[1])
				.toFixed(2)])
			console.log(distance)
			if (distance < this.umbral) {
				return this.contacts[item]
			}
			return null
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