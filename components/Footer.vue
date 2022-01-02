<template>
	<footer class="page-footer">
		<div class="footer-column footer-left">
			<p>Developer Email: calvin_nunes13@hotmail.com</p>
			<p>Developer Phone: +55 51 98402-9317</p>
		</div>
		<div class="footer-column footer-center"><b>MealDB Challenge</b></div>
		<div class="footer-column footer-right">
			<ul class="footer-links">
				<li v-for="(link, index) in footerLinks" :key="index">
					<a :href="link.path">{{ link.description }}</a>
				</li>
			</ul>
		</div>
	</footer>
</template>

<script>
import Vue from "vue";
import LibUtils from "static/libraries/libUtils";

const Navbar = Vue.extend({
	name: "Navbar",

	data() {
		return {
			footerLinks: [
				{ description: "LinkedIn", path: "https://www.linkedin.com/in/calvinnunes13/" },
				{ description: "GitHub", path: "https://github.com/Calvin-Nunes" },
				{ description: "StackOverflow", path: "https://stackoverflow.com/users/8691276/calvin-nunes" },
			],
		};
	},

	props: [],

	mounted() {},

	computed: {},
});
export default Navbar;
</script>

<style scoped lang="scss">
.page-footer {
	position: absolute;
	bottom: 0;
	left: 0;
	display: flex;
	height: 90px;
	width: 100%;
	border-top: 1px solid var(--soft-border-color);
	background-color: var(--soft-background-color);
}

.page-footer > .footer-column {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	width: 33.33%;
	font-size: 13px;
}

.page-footer > .footer-column p {
	margin: 2px;
}

@media (max-width: 767px) {
	.page-footer {
		position: relative;
		flex-direction: column;
		align-items: center;
		height: fit-content;
		bottom: unset;
		left: unset;
	}

	.page-footer > div.footer-column {
		width: 100%;
		margin: 5px auto;
	}

	.page-footer .footer-links li {
		text-align: center;
	}
}
</style>
