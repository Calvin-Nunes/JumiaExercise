<template>
	<div class="page-content">
		<section>
			<div class="banner-box">
				<nuxt-link to="/">
					<img src="~/assets/images/banner.png" alt="banner" height="250" />
				</nuxt-link>
			</div>
		</section>

		<section>
			<div class="categories-bar">
				<a v-for="(section, i) of getMainSections()" :key="i" class="section-label" @click="goToNewsSection(section)">
					<span class="section-name">{{ section.display_name }}</span>
				</a>
			</div>
		</section>

		<section>
			<div class="about-article-box">
				<h5>
					{{ newsTitle }}
				</h5>
				<div class="input-pesquisa-box">
					<c-search-box :onSearch="goToSearch" placeholder="What you want to know?" height="28" fontSize="18"></c-search-box>
				</div>
			</div>
		</section>

		<section>
			<div v-if="errorMessage.length == 0" class="articles-holder-box" ref="section_top_articles">
				<load-spinner v-if="isFetchingData" :loading="isFetchingData"></load-spinner>

				<a
					v-for="(article, i) of displayingArticles"
					:key="i"
					class="thumbnail-article-card show-as-animation"
					:data-article-index="i"
					@click="openArticle(article)">
					<div class="thumbnail-article-image-holder">
						<img :src="article.thumbnail_image" :alt="article.title" />
					</div>
					<div class="thumbnail-article-infos">
						<h4 class="thumbnail-article-title">{{ article.title }}</h4>
						<p class="thumbnail-article-description">{{ article.abstract }}</p>
					</div>
					<span class="thumbnail-article-date">{{ article.display_date }}</span>
				</a>

				<div class="pagination-box" v-if="totalPages > 1">
					<c-button caption="< Previous" theme="light" :disabled="currentPage <= 1" :onTap="paginationPreviousPage"> </c-button>
					<p>{{ currentPage }} / {{ totalPages }}</p>
					<c-button caption="Next >" theme="light" :disabled="currentPage >= totalPages" :onTap="paginationNextPage"> </c-button>
				</div>

				<div v-if="minorArticles.length > 0" style="width: 100%">
					<h4 class="page-section-title">Other Articles</h4>
					<ul>
						<li v-for="(article, i) of minorArticles" :key="i" class="thumbnail-minor-article-list-item" @click="openArticle(article)">
							<span class="thumbnail-article-title">{{ article.title }}</span>
						</li>
					</ul>
				</div>
			</div>
			<div v-else class="fetch-error-display">{{ this.errorMessage }}</div>
		</section>
	</div>
</template>

<script>
import Vue from "vue";
import ApiHelper from "static/libraries/ApiHelper";
import LibUtils from "static/libraries/libUtils";
import mixinsHelper from "~/mixins/mixins-helper";
import articlesMixins from "~/mixins/articles";
import axios from "axios";
import LoadSpinner from "@/components/LoadSpinner.vue";
import SearchBox from "@/components/SearchBox.vue";

export default Vue.extend({
	components: {
		"load-spinner": LoadSpinner,
		"c-search-box": SearchBox,
	},
	mixins: [mixinsHelper, articlesMixins],

	data: () => {
		return {
			searchText: "",
			displayingArticles: [],
			topArticles: [],
			minorArticles: [],
			isFetchingData: false,
			newsTitle: "Top News",
			errorMessage: "",
			perPageLimit: 10,
			currentPage: 1,
			totalPages: 1,
		};
	},

	created() {
		this.$store.dispatch("setSection", null);
		this.getLatestNews();
	},

	methods: {
		/*
		| função: getMainSections
		| retorna uma lista fixa de categorias de notícias/artigos
		| ---- */
		getMainSections: function () {
			return [
				{ display_name: "Arts", section: "arts" },
				{ display_name: "Business", section: "business" },
				{ display_name: "Politics", section: "politics" },
				{ display_name: "Science", section: "science" },
				{ display_name: "Sports", section: "sports" },
				{ display_name: "World", section: "world" },
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
			this.errorMessage = "";
			this.newsTitle = "Top News";
			this.topArticles = [];
			this.minorArticles = [];

			if (LibUtils.isFilled(apiUrl)) {
				axios
					.get(apiUrl)
					.then(
						function (response) {
							this.isFetchingData = false;
							this.normalizeArticlesData(response.data);
							this.buildVirtualPagination();
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
		| função: goToNewsSection
		| navega para pagina de noticias especifica de uma seção
		| ---- */
		goToNewsSection: function (section) {
			if (LibUtils.isFilled(section)) {
				this.$store.dispatch("setSection", section);
				this.navigate("articles-section", { section: section.section });
			}
		},

		/*
		| função: goToSearch
		| Utilizando o texto pesquisado, abre a pagina de pesquisa já com a pesquisa pronta
		| ---- */
		goToSearch: function (text) {
			if (text && text.length > 0) {
				this.navigate("search-article", { searchQuery: text });
			}
		},

		/*
		| função: buildVirtualPagination
		| Corre do ponto inicial ao limite por exibição e coloca no array que será usado para exibição
		| ---- */
		buildVirtualPagination: function () {
			this.totalPages = Math.ceil(this.topArticles.length / this.perPageLimit);

			this.displayingArticles = [];
			let i = (this.currentPage - 1) * this.perPageLimit;

			let limite = i > 0 ? i * 2 : this.perPageLimit;
			if (limite >= this.topArticles.length) {
				limite = this.topArticles.length;
			}

			for (i; i < limite; i++) {
				let article = this.topArticles[i];
				if (LibUtils.isFilled(article)) {
					this.displayingArticles.push(article);
				}
			}

			let scrollTo = this.$refs.section_top_articles;
			if (scrollTo != null) {
				scrollTo.scrollIntoView({ behavior: "smooth" });
			}
		},

		/*		 
		| funções relativas à avançar e recuar paginação
		| ---- */
		paginationNextPage: function () {
			this.currentPage++;
			if (this.currentPage > this.totalPages) {
				this.currentPage = this.totalPages;
			}
			this.buildVirtualPagination();
		},

		paginationPreviousPage: function () {
			this.currentPage--;
			if (this.currentPage < 1) {
				this.currentPage = 1;
			}
			this.buildVirtualPagination();
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

.articles-holder-box {
	display: flex;
	gap: 8px;
	flex-wrap: wrap;
	margin: 0 3% 10px 3%;
	border-radius: 5px;
}

.about-article-box {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	justify-content: space-between;
	border-bottom: 1px solid #bbbbbb;
	background-color: #f8f8f8;
	padding: 0 12px;

	h5 {
		font-size: 21px;
		margin: 0;
	}
}

.input-pesquisa-box {
	width: 480px;
	margin: 0;
}

.pagination-box button {
	font-size: 18px;
}

@media (max-width: 991px) {
}

@media (max-width: 767px) {
	.articles-holder-box {
		padding: 5px;
		margin: 0 0 10px 0;
	}

	.input-pesquisa-box {
		width: 90%;
		margin: 8px auto;
	}

	.about-article-box {
		h5 {
			width: 100%;
			text-align: center;
		}
	}

	.pagination-box {
		padding-left: 5px;
		padding-right: 5px;
	}
}
</style>
