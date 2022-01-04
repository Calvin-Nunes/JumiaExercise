<template>
	<div class="page-content">
		<section>
			<div class="banner-box">
				<nuxt-link to="/">
					<img src="~/assets/images/banner.svg" alt="banner" height="200" />
				</nuxt-link>
			</div>
		</section>

		<section>
			<div class="categories-bar">
				<a v-for="(section, i) of getMainSections()" :key="i" class="section-label" @click="setSelectedSection(section)">
					<span class="section-name">{{ section.display_name }}</span>
				</a>
			</div>
		</section>

		<section>
			<div class="about-news-box">
				<h5>					{{ sectionTitle }}				</h5>
			</div>
		</section>

		<section>
			<div class="sectionArticles-holder">
				<load-spinner v-if="isFetchingData" :loading="isFetchingData"></load-spinner>
				<a v-for="(article, i) of sectionArticles" :key="i" class="thumbnail-article-card show-as-animation" @click="openArticle(article)">
					<div class="thumbnail-article-image-holder">
						<img :src="getArticleImage(article)" :alt="article.title" />
					</div>
					<h4 class="thumbnail-article-title">{{ article.title }}</h4>
					<p class="thumbnail-article-description">{{ article.abstract }}</p>
				</a>
			</div>
		</section>
	</div>
</template>

<script>
import Vue from "vue";
import ApiHelper from "static/libraries/ApiHelper";
import LibUtils from "static/libraries/libUtils";
import mixinsHelper from "~/mixins/mixins-helper";
import axios from "axios";
import LoadSpinner from "@/components/LoadSpinner.vue";

export default Vue.extend({
	components: {
		"load-spinner": LoadSpinner,
	},
	mixins: [mixinsHelper],

	data: () => {
		return {
			sectionName: "",
			section: "",
			sectionArticles: [],
			isFetchingData: false,
			sectionTitle: "News",
			errorMessage: "",
		};
	},

	created() {
		// let queryParams = this.$route.query;
		// if (queryParams != null) {
		// 	this.sectionName = queryParams.sectionName || "";
		// 	this.section = queryParams.section || "";
		// }

		let section = this.$store.getters.currentSection();
		if (LibUtils.isFilled(section)) {
			this.sectionName = section.display_name;
			this.section = section.section;
		}

		this.getSectionNews();
	},

	methods: {
		/*
		| função: getMainSections
		| retorna uma lista fixa de categorias de notícias/artigos
		| ---- */
		getMainSections: function () {
			return [
				{ display_name: "All", section: "all" },
				{ display_name: "Arts", section: "arts" },
				{ display_name: "Business", section: "business" },
				{ display_name: "Politics", section: "politics" },
				{ display_name: "Science", section: "science" },
				{ display_name: "Sports", section: "sports" },
				{ display_name: "World", section: "world" },
			];
		},

		/*
		| função: getSectionNews
		| Utilizando a classe auxiliar ApiHelper, cria a URL, faz uma chamada GET para API buscar as ultimas noticias do NY Times
		| ---- */
		getSectionNews: function () {
			const apiHelper = new ApiHelper();
			let endpoint = apiHelper.Endpoints.filtered;
			let apiUrl = apiHelper.buildRequestUrl(endpoint);

			if (LibUtils.isEmpty(this.section)) {
				this.section = "all";
			}

			apiUrl = apiUrl.replace("[SECTION]", this.section);

			this.isFetchingData = true;
			this.errorMessage = ""
			this.sectionTitle = this.sectionName || "News";

			if (LibUtils.isFilled(apiUrl)) {
				axios
					.get(apiUrl)
					.then(
						function (response) {
							this.isFetchingData = false;
							this.verifyData(response.data);
						}.bind(this)
					)
					.catch(
						function (error) {
							this.isFetchingData = false;
							let errorMsg = "Ops! An error occured while fetching data from API: " + error;
							this.errorMessage = errorMsg;
							alert(errorMsg);
							console.error(errorMsg);
						}.bind(this)
					);
			}
		},

		/*
		| função: setSelectedSection
		| navega para pagina de noticias especifica de uma seção
		| ---- */
		setSelectedSection: function (section) {
			if (LibUtils.isFilled(section)) {
				this.$store.dispatch("setSection", section);
				this.navigate("news-section", { sectionName: section.display_name });
			}
		},

		/*
		| função: verifyData
		| Verifica integridade dos dados recebidos e caso ok, atribui à propriedade
		| ---- */
		verifyData: function (data) {
			if (LibUtils.isFilled(data)) {
				this.sectionArticles = data.results || [];
			}
		},

		/*
		| função: getArticleImage
		| retorna a imagem que representa o artigo/notícia
		| ---- */
		getArticleImage: function (article) {
			if (LibUtils.isFilled(article)) {
				let multimedias = article.multimedia;
				if (multimedias != null && multimedias.length > 0) {
					let image = multimedias.find((x) => x.type == "image" && x.format == "mediumThreeByTwo440");

					if (image == null) {
						image = multimedias.find((x) => x.type == "image");
					}

					if (image != null) {
						return image.url;
					}
				}
			}
			return "./assets/images/icon.png"; //TODO -> change to deafult no photo
		},
	},
});
</script>

<style lang="scss" scoped>
.description-card {
	margin: 5px auto;
	text-align: center;
}

.description-card h1 {
	color: var(--system-primary-color);
}

.sectionArticles-holder {
	display: flex;
	gap: 8px;
	flex-wrap: wrap;
	margin: 0 3% 10px 3%;
	padding: 10px;
	background: linear-gradient(135deg, #ecf0ee 0%, #f5f5f5 40%, #e2e7e4 90%);
	border-radius: 5px;
	box-shadow: 1px 2px 6px rgba(0, 0, 0, 0.15);
}

.about-news-box {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	padding: 0 3%;
	justify-content: space-between;

	h5 {
		font-size: 21px;
		margin: 0;
	}
}

.input-pesquisa-box {
	width: 480px;
	margin: 0;
}

//Categories Bar
.categories-bar {
	display: flex;
	justify-content: space-evenly;
	margin: 5px 5px 15px 5px;
	padding-bottom: 2px;
	border-bottom: 1px solid #999999;

	.section-label {
		display: inline-flex;
		padding: 0 4px;
	}

	.section-name {
		color: #222222;
		font-size: 14px;
	}

	.section-label:hover .section-name {
		color: #999999;
	}
}

@media (max-width: 991px) {
}

@media (max-width: 767px) {
	.sectionArticles-holder {
		padding: 5px;
		margin: 0 0 10px 0;
	}

	.input-pesquisa-box {
		width: 90%;
		margin: 8px auto;
	}

	.categories-bar {
		display: none;
	}

	.about-news-box {
		h5 {
			width: 100%;
			text-align: center;
		}
	}
}
</style>
