<template>
	<div class="page-content">
		<section>
			<div class="page-header">
				<a @click="$router.go(-1)" class="return-button">Back</a>
				<div class="header-top-holder">
					<h1 class="page-title">Searching: {{ getSearchedTextDisplay() }}</h1>
					<img src="~/assets/images/icon.png" class="page-logo" />
				</div>
				<div class="input-pesquisa-box">
					<c-search-box :onSearch="getSearchedArticles" placeholder="What you want to know?" height="50" fontSize="20"></c-search-box>
				</div>
			</div>
		</section>
		<section ref="section_articles">
			<h4 class="page-subtitle">Articles found</h4>
			<div class="articles-holder">
				<load-spinner v-if="isFetchingData" :loading="isFetchingData"></load-spinner>
				<div
					v-else-if="articles.length > 0"
					v-for="(article, i) of articles"
					:key="i"
					class="article-row show-as-animation"
					@click="openArticle(article)">
					<div class="article-image-holder">
						<img :src="article.thumbnail_image" :alt="article.thumbnail_image" class="img-thumbnail" />
					</div>
					<p class="article-name">{{ article.title }}</p>
					<span class="article-date">{{ article.original_date }}</span>
				</div>
				<p v-else>No articles found with '{{ getSearchedTextDisplay() }}'</p>
			</div>
			<div class="pagination-box" v-if="totalPages > 1">
				<c-button caption="< Previous" theme="light" :disabled="currentPage <= 1" :onTap="returnPagination"> </c-button>
				<p>{{ currentPage }} / {{ totalPages }}</p>
				<c-button caption="More >" theme="light" :disabled="currentPage >= totalPages" :onTap="forwardPagination"> </c-button>
			</div>
		</section>
	</div>
</template>

<script>
import Vue from "vue";
import ApiHelper from "static/libraries/ApiHelper";
import LibUtils from "static/libraries/libUtils";
import mixinsHelper from "~/mixins/mixins-helper";
import articlesMixin from "~/mixins/articles";
import axios from "axios";
import LoadSpinner from "@/components/LoadSpinner.vue";
import SearchBox from "@/components/SearchBox.vue";

export default Vue.extend({
	components: {
		"load-spinner": LoadSpinner,
		"c-search-box": SearchBox,
	},
	mixins: [mixinsHelper, articlesMixin],
	data: () => {
		return {
			searchText: "",
			articles: [],
			articlesShowing: [],
			perPageLimit: 10,
			currentPage: 1,
			totalPages: 1,
			errorMessage: "",
			isFetchingData: false,
			apiHelper: null,
		};
	},

	created() {
		let queryParams = this.$route.query;
		if (queryParams != null) {
			this.searchText = queryParams.search || "";
		}

		this.apiHelper = new ApiHelper(this.$store.getters.nyTimesApiKey);
		if (LibUtils.isFilled(this.searchText)) {
			this.getSearchedArticles(this.searchText, 0);
		}
	},

	methods: {
		/*
		| função: getSearchedArticles
		| Utilizando a classe auxiliar this.apiHelper, cria a URL, faz uma chamada GET para API buscando pelo texto digitado pelo usuario
		| ---- */
		getSearchedArticles: function (searchingText, pageNumber) {
			if (LibUtils.isFilled(searchingText)) {
				searchingText = this.getNormalizedQuery(searchingText.replace(/ /g, "_").toLowerCase());
			}

			if (this.searchText != searchingText) {
				this.searchText = searchingText;
			}
			let queryParams = searchingText + `&page=${pageNumber || 0}`;

			let searchEndpoint = this.apiHelper.Endpoints.search;
			let apiUrl = this.apiHelper.buildRequestUrl(searchEndpoint, queryParams);

			if (LibUtils.isFilled(apiUrl)) {
				this.isFetchingData = true;
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
							console.error(errorMsg);
						}.bind(this)
					);
			}
		},

		/*
		| função: getSearchedTextDisplay
		| Realiza replace de '_' por espaço, para exibir o texto de busca de forma legível
		| ---- */
		getSearchedTextDisplay: function () {
			if (LibUtils.isFilled(this.searchText)) {
				return this.searchText.toString().replace(/_/g, " ");
			}
		},

		/*
		| função: verifyData
		| Verifica integridade dos dados recebidos e caso ok, atribui à propriedade
		| ---- */
		verifyData: function (data) {
			this.totalPages = 0;
			this.articles = [];
			if (LibUtils.isFilled(data)) {
				let response = data.response;
				if (response != null) {
					this.normalizeFoundArticles(response.docs || []);
					this.totalPages = Math.ceil(response.meta.hits / this.perPageLimit);
				}
			}

			let scrollTo = this.$refs.section_articles;
			if (scrollTo != null) {
				scrollTo.scrollIntoView({ behavior: "smooth" });
			}
		},

		/*
		| função: normalizeFoundArticles
		| Ajusta os dados retornados como artigos, para manter a formatação padrão, 
		| já que a API quando usa a busca traz objetos diferentes dos artigos normais
		| ---- */
		normalizeFoundArticles: function (articles) {
			this.articles = [];

			for (let article of articles) {
				let normalizedArticle = {};
				normalizedArticle.title = article.headline ? article.headline.main : article.lead_paragraph;
				normalizedArticle.multimedia = article.multimedia;
				normalizedArticle.abstract = article.abstract;
				normalizedArticle.thumbnail_image = this.getArticleImage(normalizedArticle);
				normalizedArticle.original_date = this.getArticlePublishedDate(article);
				normalizedArticle.section = article.section_name;
				normalizedArticle.url = article.web_url;
				normalizedArticle.byline = article.byline ? article.byline.original : "";

				this.articles.push(normalizedArticle);
			}
		},

		/*
		| função: getArticlePublishedDate
		| Verifica integridade dos dados recebidos e caso ok, atribui à propriedade
		| ---- */
		getArticlePublishedDate(article) {
			let articleDateStr = article.pub_date;
			if (LibUtils.isFilled(articleDateStr)) {
				let articleDate = new Date(articleDateStr);
				return articleDate.toLocaleDateString();
			}
			return "";
		},

		/*
		| função: rebuildPagination
		| Corre do ponto inicial ao limite por exibição e coloca no array que será usado para exibição
		| ---- */
		rebuildPagination: function () {
			this.getSearchedArticles(this.searchText, this.currentPage);
		},

		/*
		| funções relativas à avançar e recuar paginação
		| ---- */
		forwardPagination: function () {
			this.currentPage++;
			if (this.currentPage > this.totalPages) {
				this.currentPage = this.totalPages;
			}
			this.rebuildPagination();
		},

		returnPagination: function () {
			this.currentPage--;
			if (this.currentPage < 1) {
				this.currentPage = 1;
			}
			this.rebuildPagination();
		},
	},
});
</script>

<style lang="scss" scoped>
.input-pesquisa-box {
	width: 100%;
	margin: 8px auto;
}

.articles-holder {
	display: flex;
	flex-direction: column;
	gap: 5px;
	flex-wrap: nowrap;
	margin: 0 20% 10px 20%;
	padding: 10px;
	background: linear-gradient(135deg, #f2f2f2 0%, #fafafa 40%, #f2f2f2 90%);
	border-radius: 5px;
	box-shadow: 1px 2px 6px rgba(0, 0, 0, 0.15);
}

.article-row {
	width: 100%;
	display: flex;
	flex-direction: row;
	border: 1px solid rgb(210, 210, 210);
	box-shadow: 1px 2px 6px rgba(0, 0, 0, 0.15);
	transition: 0.3s all ease-in;
	align-items: center;
	padding: 4px 6px;
	background-color: #fff;
	position: relative;
}

.article-row:hover {
	border-color: rgb(175, 175, 175);
	background: rgba(50, 140, 240, 0.2);
	cursor: pointer;
}

.article-row:hover .article-name {
	color: #000000;
}

.article-image-holder {
	display: inline-flex;
	width: 86px;
	height: 86px;
	flex-shrink: 0;
}

.article-name {
	display: inline-flex;
	flex-grow: 1;
	padding: 0 12px;
	color: #222222;
	font-size: 18px;
}

.article-date {
	color: #666666;
	font-size: 14px;
	text-align: right;
	position: absolute;
	bottom: 2px;
	right: 5px;
}

.pagination-box {
	padding-left: 20%;
	padding-right: 20%;
}

.pagination-box button {
	font-size: 18px;
}

@media (max-width: 991px) {
	.articles-holder {
		margin: 0 2% 10px 2%;
	}

	.pagination-box {
		padding-left: 2%;
		padding-right: 2%;
	}
}

@media (max-width: 767px) {
	.page-header {
		padding: 5px 2%;
	}

	.page-header .page-logo {
		width: 64px;
	}

	.header-top-holder {
		margin-top: 10px;
	}

	.articles-holder {
		padding: 5px;
	}

	.pagination-box {
		padding-left: 5px;
		padding-right: 5px;
	}

	.input-pesquisa-box {
		width: 90%;
		margin: 8px auto;
	}
}
</style>
