<template>
	<div class="page-wrapper">
		<navbar></navbar>
		<transition name="fade" mode="out-in">
			<Nuxt />
		</transition>
		<bottom></bottom>
	</div>
</template>

<script>
import Vue from "vue";
import Footer from "@/components/Footer.vue";

export default Vue.extend({
	components: { bottom: Footer },
});
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.15s ease-in;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
