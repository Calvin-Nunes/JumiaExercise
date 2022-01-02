<template>
	<div class="main-content center">
		<section>
			<div class="center-content">
				<img src="~/assets/images/icon-180x180.png" alt="banner-error-page" class="page-content-image" />
			</div>
		</section>
		<section>
			<div class="center-content error-info-box">
				<span id="current-url" v-html="CurrentURL"></span>
				<span id="error-msg" v-html="ErrorMsg"></span>
				<nuxt-link to="/" class='block-button'>Return to Home</nuxt-link>
			</div>
		</section>
	</div>
</template>

<script>
export default {
	name: "Error",
	props: ["error"],

	data: () => {
		return {
			CurrentURL: "",
			ErrorMsg: "An error occured with the requested page",
		};
	},

	mounted() {
		this.Show();
	},

	methods: {
		Show: function () {
			this.CurrentURL = "URL:</br>" + window.location.href;
			if (this.error) {
				this.ErrorMsg += "</br>Code.: " + this.error.statusCode;
			}
		},
	},
};
</script>

<style scoped>
.main-content {
	background: var(--color-bg);
}

.error-info-box {
	display: flex;
	flex-direction: column;
	margin: 12px auto;
}

#current-url {
	display: block;
	margin: 15px auto;
	text-align: center;
	font-size: 17px;
	color: var(--color-fonte);
}

#error-msg {
	display: block;
	margin: 15px auto;
	text-align: center;
	color: #e42121;
	font-size: 20px;
	font-weight: bold;
}

.buttons-opcoes {
	display: flex;
	justify-content: center;
	align-items: center;
}

.buttons-opcoes .btn {
	color: #fff;
	min-width: 120px;
}
</style>
