<template>
	<nav class="page-navbar">
		<div class="nav-left">
			<button id="navbar-menu" @click="openMenu" title="Open menu">
				<i class="fas fa-bars"></i>
			</button>
			<span>Calvin News - {{ todayDate }}</span>
		</div>
		<div class="nav-right">
			<p>Jumia - Challenge</p>
		</div>
	</nav>
</template>

<script>
import Vue from "vue";
import LibUtils from "static/libraries/libUtils";

const Navbar = Vue.extend({
	name: "Navbar",

	data() {
		return {
			todayDate: new Date(),
		};
	},

	props: [],

	created() {
		this.todayDate = new Date().toLocaleDateString();
	},

	mounted() {},

	methods: {
		openMenu: function () {
			//TODO
		},
	},

	computed: {},
});
export default Navbar;
</script>

<style scoped lang="scss">
nav {
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	height: 45px;
	border-bottom: 1px solid var(--soft-border-color);
	padding: 0 1%;
	background: var(--system-primary-color-dark);
}

.nav-left {
	display: inline-flex;
	justify-self: flex-start;
	align-items: center;
	max-width: 35%;
	padding: 1px 4px;
	color: #fff;
}

.nav-left #navbar-menu {
	margin: 0 10px;
	border: none;
	background: none;
	color: #fff;
	cursor: pointer;

	i{
		font-size: 20px;
	}
}

.nav-left #navbar-logo {
	width: 36px;
	height: 36px;
	margin: 0 4px;	
}

.nav-right {
	display: inline-flex;
	justify-self: flex-end;
	max-width: 65%;
	padding: 1px 4px;
	color: #fff;
}
</style>
