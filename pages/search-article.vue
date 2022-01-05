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
						<img :src="article.thumbnail_image" :alt="article.headline" class="img-thumbnail" />
					</div>
					<p class="article-name">{{ article.headline }}</p>
				</div>
				<p v-else>No articles found with '{{ getSearchedTextDisplay() }}'</p>
			</div>
			<div class="pagination-box" v-if="totalPages > 1">
				<c-button caption="< Anterior" theme="light" :disabled="currentPage <= 1" :onTap="returnPagination"> </c-button>
				<p>{{ currentPage }} / {{ totalPages }}</p>
				<c-button caption="Próximo >" theme="light" :disabled="currentPage >= totalPages" :onTap="forwardPagination"> </c-button>
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
		};
	},

	created() {
		let queryParams = this.$route.query;
		if (queryParams != null) {
			this.searchText = queryParams.searchQuery || "";
		}

		if (LibUtils.isFilled(this.searchText)) {
			this.getSearchedArticles(this.searchText, 0);
		}
	},

	methods: {
		/*
		| função: getSearchedArticles
		| Utilizando a classe auxiliar ApiHelper, cria a URL, faz uma chamada GET para API buscando pelo texto digitado pelo usuario
		| ---- */
		getSearchedArticles: function (searchingText, pageNumber) {
			if (LibUtils.isFilled(searchingText)) {
				searchingText = this.getNormalizedQuery(searchingText.replace(/ /g, "_").toLowerCase());
			}

			if (this.searchText != searchingText) {
				this.searchText = searchingText;
			}

			const apiHelper = new ApiHelper();
			let searchEndpoint = apiHelper.Endpoints.search;
			let apiUrl = apiHelper.buildRequestUrl(searchEndpoint, searchingText);

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
					this.articles = response.docs || [];
					this.normalizeArticlesData(this.articles);
					this.totalPages = Math.ceil(response.meta.hits / this.perPageLimit);
				}
			}
			console.log(this.articles);
			let scrollTo = this.$refs.section_articles;
			if (scrollTo != null) {
				scrollTo.scrollIntoView({ behavior: "smooth" });
			}
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
	background: linear-gradient(135deg, #ecf0ee 0%, #f5f5f5 40%, #e2e7e4 90%);
	border-radius: 5px;
	box-shadow: 1px 2px 6px rgba(0, 0, 0, 0.15);
}

.article-row {
	width: 100%;
	display: flex;
	flex-direction: row;
	border-radius: 4px;
	border: 1px solid rgb(210, 210, 210);
	box-shadow: 1px 2px 6px rgba(0, 0, 0, 0.15);
	transition: 0.3s all ease-in;
	align-items: center;
}

.article-row:hover {
	border-color: rgb(175, 175, 175);
	background: rgba(40, 170, 60, 0.4);
	cursor: pointer;
}

.article-row:hover .article-name {
	color: #000000;
}

.article-image-holder {
	display: inline-flex;
	width: 86px;
	height: 86px;
	padding: 0 5px;
	flex-shrink: 0;
}

.article-name {
	display: inline-flex;
	padding: 0 12px;
	color: #222222;
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
		width: 86px;
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
