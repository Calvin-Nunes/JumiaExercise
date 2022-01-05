<template>
	<nav class="page-navbar">
		<div class="nav-left">
			<button id="navbar-menu" @click="toggleNavMenu" title="Open menu">
				<i class="fas fa-bars"></i>
			</button>
			<span>Calvin News - {{ todayDate }}</span>
		</div>
		<div class="nav-right">
			<p>Jumia - Challenge</p>
		</div>
		<div v-if="showingMenu" class="navbar-menu">
			<ul>
				<li v-for="(section, i) of sections" :key="i" class="navbar-menu-list-item">
					<a @click="setSection(section)">{{ section.display_name }}</a>
				</li>
			</ul>
		</div>
	</nav>
</template>

<script>
import Vue from "vue";
import LibUtils from "static/libraries/libUtils";
import ApiHelper from "static/libraries/ApiHelper";
import mixinsHelper from "~/mixins/mixins-helper";
import axios from "axios";

const Navbar = Vue.extend({
	name: "Navbar",
	mixins: [mixinsHelper],

	data() {
		return {
			todayDate: new Date(),
			sections: [],
			showingMenu: false,
		};
	},

	props: [],

	created() {
		this.todayDate = new Date().toLocaleDateString();
		this.getSections();
	},

	mounted() {},

	methods: {
		toggleNavMenu: function () {
			this.showingMenu = !this.showingMenu;
		},

		/*
		| função: getSections
		| busca a lista de seções de notícias na API do NY times
		| ---- */
		getSections: function () {
			/* a API não fornece uma lista de seções de conteudo de artigos, apenas 
			/ uma lista se todas seções que inclui áreas do NY Times que não são referentes a artigos e notícias
			/ Como livros (Books) por exemplo, portanto estou usando uma lista fixa fornecida na pagina:
			 https://developer.nytimes.com/docs/top-stories-product/1/overview
			 */

			this.sections = [
				{ display_name: "Home", section: "all" },
				{ display_name: "Arts", section: "arts" },
				{ display_name: "Automobiles", section: "automobiles" },
				{ display_name: "Business", section: "business" },
				{ display_name: "Fashion", section: "fashion" },
				{ display_name: "Food", section: "food" },
				{ display_name: "Health", section: "health" },
				{ display_name: "Insider", section: "insider" },
				{ display_name: "Magazine", section: "magazine" },
				{ display_name: "Movies", section: "movies" },
				{ display_name: "Obituaries", section: "obituaries" },
				{ display_name: "Opinion", section: "opinion" },
				{ display_name: "Politics", section: "politics" },
				{ display_name: "Real Estate", section: "realestate" },
				{ display_name: "Science", section: "science" },
				{ display_name: "Sports", section: "sports" },
				{ display_name: "Technology", section: "technology" },
				{ display_name: "Theater", section: "theater" },
				{ display_name: "Travel", section: "travel" },
				{ display_name: "upshot", section: "upshot" },
				{ display_name: "U.S", section: "us" },
				{ display_name: "World", section: "world" },
			];
		},

		/*
		| função: setSection
		| define na store a section selecionada para buscar artigos/noticias
		| ---- */
		setSection: function (section) {
			this.showingMenu = false;
			this.$store.dispatch("setSection", section);
			if (section.section === "all") {
				this.navigate("/");
			} else {
				this.navigate("articles-section", { section: section.section });
			}
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
	position: relative;
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

.navbar-menu {
	position: absolute;
	top: 45px;
	left: 0;
	height: calc(100vh - 45px);
	width: 220px;
	background-color: #fff;
	border-top: 1px solid #bbbbbb;
	border-right: 1px solid #bbbbbb;
	overflow-y: auto;
	padding: 8px 5px 8px 12px;
	z-index: 999;
	box-shadow: 0px 1px 6px #888888;

	.navbar-menu-list-item {
		margin: 5px 0;

		a {
			font-size: 14px;
		}
	}
}
</style>
