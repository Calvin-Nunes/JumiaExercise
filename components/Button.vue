<template>
	<button :class="buttonClass" @click="onTapButton">
		<slot></slot>
		<span v-if="route == null || disabled === true">{{ caption }}</span>
		<nuxt-link v-else :to="route">{{ caption }}</nuxt-link>
	</button>
</template>

<script>
import Vue from "vue";
import LibUtils from "static/libraries/libUtils";

const Button = Vue.extend({
	name: "Button",
	props: ["caption", "theme", "size", "onTap", "disabled", "route", "fontSize"],

	data() {
		return {
			cssClasses: ["button-base"],
			isDisabled: this.disabled || false,
		};
	},
	
	created() {
		this.setDisabledStatus();
	},

	mounted() {
		if (LibUtils.toDecimal(this.fontSize) > 0) {
			this.$el.children[0].style.fontSize = this.fontSize + "px";
		}
	},

	methods: {
		onTapButton: function () {
			if (this.onTap != null && this.isDisabled === false) {
				this.onTap(this);
			}
		},

		setDisabledStatus: function () {
			this.isDisabled = this.disabled || false;

			if (this.isDisabled && this.cssClasses.includes("disabled") === false) {
				this.cssClasses.push("disabled");
			} else if (!this.isDisabled) {
				let idx = this.cssClasses.indexOf("disabled");
				if (idx > -1) {
					this.cssClasses.splice(idx, 1);
				}
			}
		},
	},

	computed: {
		buttonClass() {
			if (this.theme === "success") {
				this.cssClasses.push("theme-success");
			} else if (this.theme === "light") {
				this.cssClasses.push("theme-light");
			} else if (this.theme === "dark") {
				this.cssClasses.push("theme-dark");
			} else if (this.theme === "warning") {
				this.cssClasses.push("theme-warning");
			} else if (this.theme === "danger") {
				this.cssClasses.push("theme-danger");
			} else {
				this.cssClasses.push("theme-default");
			}

			if (this.size === "big") {
				this.cssClasses.push("button-big");
			} else if (this.size === "small") {
				this.cssClasses.push("button-small");
			} else {
				this.cssClasses.push("button-default");
			}

			let classes = this.cssClasses.join(" ");
			return classes;
		},
	},

	watch: {
		disabled: function () {
			this.setDisabledStatus();
		},
	},
});
export default Button;
</script>

<style scoped lang="scss">
.button-base {
	display: inline-flex;
	justify-content: center;
	align-items: center;
	outline: none;
	border-radius: 2px;
	margin: 2px;
	cursor: pointer;
	box-shadow: 0 1px 5px var(--soft-border-color);
	transition: 0.3s all ease-out;
}

.button-base > *:first-child {
	padding: 4px 8px;
}

.button-base:hover {
	box-shadow: 0px 0px 0px;
}

//sizes
.button-default {
	font-size: 16px;
}

.button-big {
	min-width: 250px;
	min-height: 50px;
	font-size: 22px;
}

.button-small {
	width: 60px;
	height: 22px;
	font-size: 13px;
}

//themes
.theme-default {
	border: 1px solid #114aaa;
	background: var(--color-primary);
	color: white;
}

.theme-default:hover {
	border: 1px solid #002999;
	opacity: 0.9;
}

.theme-light {
	border: 1px solid #9b9b9b;
	background: var(--color-light);
	color: #333333;
}

.theme-light:hover {
	background-color: var(--system-secondary-color-dark);
	border-color: var(--system-primary-color-dark);
	opacity: 0.9;
	color: var(--system-primary-color);
}

.theme-dark {
	border: 1px solid #222222;
	background: var(--color-dark);
	color: #eeeeee;
}

.theme-dark:hover {
	border: 1px solid #000000;
	opacity: 0.9;
}

.theme-success {
	border: 1px solid #00b13b;
	background: var(--color-success);
	color: #ffffff;
}

.theme-success:hover {
	border: 1px solid #06d64c;
	opacity: 0.9;
}

.theme-warning {
	border: 1px solid #dfbd00;
	background: var(--color-warning);
	color: #333333;
}

.theme-warning:hover {
	border: 1px solid #bda000;
	opacity: 0.9;
}

.theme-danger {
	border: 1px solid #9b0000;
	background: var(--color-danger);
	color: #ffffff;
}

.theme-danger:hover {
	border: 1px solid #d11212;
	opacity: 0.9;
}
@media (max-width:767px) {
	.button-base span{
		font-size: 15px;
	}
}
</style>
