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
import ApiHelper from "static/libraries/ApiHelper";
import axios from "axios";

const Navbar = Vue.extend({
	name: "Navbar",

	data() {
		return {
			todayDate: new Date(),
			sections: [],
		};
	},

	props: [],

	created() {
		this.todayDate = new Date().toLocaleDateString();
		this.getSections();
	},

	mounted() {},

	methods: {
		openMenu: function () {
			//TODO
		},

		/*
		| função: getSections
		| busca a lista de seções de notícias na API do NY times
		| ---- */
		getSections: function () {
			const apiHelper = new ApiHelper();
			let endpoint = apiHelper.Endpoints.sections;
			let apiUrl = apiHelper.buildRequestUrl(endpoint);

			if (LibUtils.isFilled(apiUrl)) {
				axios
					.get(apiUrl)
					.then(
						function (response) {
							if (LibUtils.isFilled(response) && response.data != null) {
								this.sections = response.data.results;
							}
						}.bind(this)
					)
					.catch(
						function (error) {
							this.isFetchingData = false;
							let errorMsg = "Error while fetching sections from API: " + error;
							console.error(errorMsg);
							this.sections = [];
						}.bind(this)
					);
			}
		},

		/*
		| função: setSection
		| define na store a section selecionada para buscar artigos/noticias
		| ---- */
		setSection: function (section) {
			debugger;
			this.$store.dispatch("setSection", section);
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

	i {
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
