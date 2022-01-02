<template>
	<div class="input-outer-box">
		<label v-if="label != null" class="input-label">{{ label }}</label>
		<div class="input-holder" :style="'height:' + getHeight">
			<button @click="startSearch" class="no-style-button">
			<icon icon="fas fa-search" class="input-icon" ></icon>
			</button>
			<input
				v-model="searchText"
				:placeholder="placeholder"
				:style="getInputStyle"
				class="input-base"
				v-on:keyup.enter="startSearch"/>
		</div>
	</div>
</template>

<script>
import Vue from "vue";
import LibUtils from "static/libraries/libUtils";

const Input = Vue.extend({
	name: "Input",

	data() {
		return {
			searchText: "",
		};
	},

	beforeMount() {
		this.searchText = this.value;
	},

	props: {
		placeholder: { default: "" },
		value: { default: "" },
		label: { default: "" },
		height: { default: 30 },
		fontSize: { default: 16 },
		onSearch: {default: null}
	},

	methods: {
		startSearch: function () {
			if (this.onSearch != null && typeof this.onSearch === 'function'){
				this.onSearch(this.searchText)
			}
		},
	},

	computed: {
		getHeight() {
			return this.height + "px";
		},

		getInputStyle() {
			return `font-size: ${this.fontSize}px`;
		},
	},
});
export default Input;
</script>

<style scoped lang="scss">
.input-outer-box {
	margin: 6px 3px;
}

.input-holder {
	display: flex;
	flex-wrap: nowrap;
	align-items: center;
	border-radius: 2px;
	border: 1px solid var(--soft-border-color);
}

.input-base {
	display: inline-flex;
	align-items: center;
	outline: none;
	border: none;
	min-width: calc(100% - 35px);
	flex-grow: 1;
	height: 100%;
	margin: 0;
	transition: 0.3s all ease-out;
	padding: 0 3px;
}

.input-icon {
	min-width: 35px;
	max-width: 35px;
	height: 100%;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	font-size: 18px;
	padding: 0 4px;
	color: #777777;
	border-right: 1px solid var(--soft-border-color);
	background: rgba(0, 0, 0, 0.05);
	cursor: pointer;
}

.input-label {
	width: 100%;
	color: #777777;
	font-size: 12px;
	padding: 0;
	margin: 0;
}

</style>
