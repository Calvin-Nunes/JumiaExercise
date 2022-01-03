<template>
	<div class="page-content">
		<section>
			<div class="banner-box">
				<nuxt-link to="/">
					<img src="~/assets/images/banner.svg" alt="banner" height="250" />
				</nuxt-link>
			</div>
		</section>

		<section>
			<div class="categories-bar">
				<a v-for="(category, i) of getCategoriesList()" :key="i" class="category-label" @click="getByCategory(category)">
					<span class="category-name">{{ category.category }}</span>
				</a>
			</div>
		</section>

		<section>
			<div class="about-news-box">
				<h5>
					{{ newsTitle }}
				</h5>
				<div class="input-pesquisa-box">
					<c-search-box :onSearch="goToSearch" placeholder="What you want to know?" height="28" fontSize="18"></c-search-box>
				</div>
			</div>
		</section>

		<section>
			<div class="articles-holder">
				<load-spinner v-if="isFetchingData" :loading="isFetchingData"></load-spinner>
				<a v-for="(article, i) of articles" :key="i" class="article-card show-as-animation" @click="openArticle(article)">
					<div class="article-image-holder">
						<img :src="getArticleImage(article)" :alt="article.title" />
					</div>
					<h4 class="article-title">{{ article.title }}</h4>
					<p class="article-description">{{ article.abstract }}</p>
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
import SearchBox from "@/components/SearchBox.vue";

export default Vue.extend({
	components: {
		"load-spinner": LoadSpinner,
		"c-search-box": SearchBox,
	},
	mixins: [mixinsHelper],

	data: () => {
		return {
			searchText: "",
			articles: [],
			isFetchingData: false,
			newsTitle: "Top News",
		};
	},

	created() {
		this.getLatestNews();
	},

	methods: {
		/*
		| função: openArticle
		| Listener de click para artigo clicado, ao clicar irá abrir a page com a notícia/artigo detalhado
		| ---- */
		openArticle: function (article) {
			debugger;
			if (LibUtils.isFilled(article)) {
				let params = {
					article: article.title,
					id: article.idCategory,
				};
				this.navigate("news", params);
			}
		},

		/*
		| função: getCategoriesList
		| retorna uma lista fixa de categorias de notícias/artigos
		| ---- */
		getCategoriesList: function () {
			return [
				{ category: "Arts", endpoint: "arts" },
				{ category: "Business", endpoint: "business" },
				{ category: "Politics", endpoint: "politics" },
				{ category: "Science", endpoint: "science" },
				{ category: "Sports", endpoint: "sports" },
				{ category: "World", endpoint: "world" },
			];
		},

		/*
		| função: getLatestNews
		| Utilizando a classe auxiliar ApiHelper, cria a URL, faz uma chamada GET para API buscar as ultimas noticias do NY Times
		| ---- */
		getLatestNews: function () {
			const apiHelper = new ApiHelper();
			let endpoint = apiHelper.Endpoints.latest;
			let apiUrl = apiHelper.buildRequestUrl(endpoint);

			this.isFetchingData = true;
			this.newsTitle = "Top News"

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
							let errorMsg = "Error while fetching data from API: " + error;
							alert(errorMsg);
							console.error(errorMsg);
						}.bind(this)
					);
			}
		},

		/*
		| função: getByCategory
		| Busca notícias especificas de uma categoria
		| ---- */
		getByCategory: function (category) {
			const apiHelper = new ApiHelper();
			let endpoint = apiHelper.Endpoints.filtered;
			let apiUrl = apiHelper.buildRequestUrl(endpoint);

			apiUrl = apiUrl.replace("[CATEGORY]", category.endpoint);

			this.isFetchingData = true;
			this.newsTitle = category.category
			debugger;

			if (LibUtils.isFilled(apiUrl)) {
				this.articles = [];
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
							let errorMsg = "Error while fetching data from API: " + error;
							alert(errorMsg);
							console.error(errorMsg);
						}.bind(this)
					);
			}
		},

		/*
		| função: verifyData
		| Verifica integridade dos dados recebidos e caso ok, atribui à propriedade
		| ---- */
		verifyData: function (data) {
			if (LibUtils.isFilled(data)) {
				this.articles = data.results || [];
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

		/*
		| função: goToSearch
		| Utilizando o texto pesquisado, abre a pagina de pesquisa já com a pesquisa pronta
		| ---- */
		goToSearch: function (text) {
			if (text && text.length > 0) {
				this.navigate("search-news", { searchQuery: text });
			}
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

.articles-holder {
	display: flex;
	gap: 8px;
	flex-wrap: wrap;
	margin: 0 3% 10px 3%;
	padding: 10px;
	background: linear-gradient(135deg, #ecf0ee 0%, #f5f5f5 40%, #e2e7e4 90%);
	border-radius: 5px;
	box-shadow: 1px 2px 6px rgba(0, 0, 0, 0.15);
}

.article-card {
	width: calc(33% - 8px);
	display: inline-flex;
	flex-direction: column;
	border-radius: 0px;
	border: 1px solid rgb(210, 210, 210);
	transition: 0.3s all ease-in;
	align-items: center;
	background-color: #ffffff;
}

.article-card:hover {
	border-color: rgb(175, 175, 175);
	background: rgba(40, 170, 60, 0.4);
	cursor: pointer;
}

.article-card:hover .article-title {
	color: #000000;
}

.article-image-holder {
	width: 100%;
	padding: 10px 5px;
	max-height: 256px;
}

.article-image-holder img {
	display: block;
	width: 100%;
	max-width: 256px;
	height: auto;
	max-height: 256px;
	object-fit: contain;
	margin: 0 auto;
	text-align: center;
}

.article-title {
	text-align: center;
	margin: 5px 0;
	padding: 0 5px;
	color: #222222;
}

.about-news-box {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	padding: 0 3%;
	justify-content: space-between;
	
	h5{
		font-size: 21px;
		margin: 0;
	}
}

.input-pesquisa-box {
	width: 480px;
	margin: 0;
}

.article-description {
	font-size: 14px;
	margin: 10px 5px 5px 5px;
	color: #555555;
	overflow: hidden;
}

//Categories Bar
.categories-bar {
	display: flex;
	justify-content: space-evenly;
	margin: 5px 5px 15px 5px;
	padding-bottom: 2px;
	border-bottom: 1px solid #999999;

	.category-label {
		display: inline-flex;
		padding: 0 4px;
	}

	.category-name {
		color: #222222;
		font-size: 14px;
	}

	.category-label:hover .category-name {
		color: #999999;
	}
}

@media (max-width: 991px) {
	.article-card {
		width: calc(50% - 5px);
	}
}

@media (max-width: 767px) {
	.articles-holder {
		padding: 5px;
		margin: 0 0 10px 0;
	}

	.article-card {
		width: calc(100% - 5px);
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
