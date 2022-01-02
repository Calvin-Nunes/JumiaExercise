<template>
	<i :class="getClass"></i>
</template>

<script>
import Vue from "vue";

const Icon = Vue.extend({
	name: "Icon",

	data() {
		return {
			cssClasses: ["icon-base"],
		};
	},

	props: ["icon", "size"],

	computed: {
		getClass() {
			this.cssClasses.push(this.icon);

			if (this.size === "big") {
				this.cssClasses.push("icon-big");
			} else if (this.size === "medium") {
				this.cssClasses.push("icon-medium");
			}
			return this.cssClasses.join(" ");
		},
	},
});
export default Icon;
</script>

<style scoped lang="scss">
.icon-base {
	display: inline-flex;
	font-size: 18px;
	text-align: center;
}

.icon-big {
	font-size: 48px;
}

.icon-medium {
	font-size: 32px;
}
</style>
