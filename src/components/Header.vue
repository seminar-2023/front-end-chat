<template>
	<main class="fixed top-0 right-0 left-0">
		<section class="bg-primary px-5 py-3 text-gray-100 w-full md:px-28 md:mx-auto flex justify-between items-center lg:p-5">
			<slot name="start"></slot>
			<slot name="center"></slot>
			<slot name="end"></slot>
		</section>
	</main>
</template>
