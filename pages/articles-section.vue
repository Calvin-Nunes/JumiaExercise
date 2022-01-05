<template>
	<div class="page-content">
		<section>
			<div class="banner-box">
				<nuxt-link to="/">
					<img src="~/assets/images/banner.png" alt="banner" height="200" />
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
			<div class="about-article-box">
				<h5>{{ sectionTitle }}</h5>
			</div>
		</section>

		<section>
			<div v-if="errorMessage.length == 0" class="articles-holder-box">
				<load-spinner v-if="isFetchingData" :loading="isFetchingData"></load-spinner>
				<a v-for="(article, i) of topArticles" :key="i" class="thumbnail-article-card show-as-animation" @click="openArticle(article)">
					<div class="thumbnail-article-image-holder">
						<img :src="article.thumbnail_image" :alt="article.title" />
					</div>
					<div class="thumbnail-article-infos">
						<h4 class="thumbnail-article-title">{{ article.title }}</h4>
						<p class="thumbnail-article-description">{{ article.abstract }}</p>
					</div>
					<span class="thumbnail-article-date">{{ article.display_date }}</span>
				</a>

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

export default Vue.extend({
	components: {
		"load-spinner": LoadSpinner,
	},
	mixins: [mixinsHelper, articlesMixins],

	data: () => {
		return {
			sectionName: "",
			section: "",
			topArticles: [],
			minorArticles: [],
			isFetchingData: false,
			sectionTitle: "News",
			errorMessage: "",
			apiHelper: null,
		};
	},

	created() {
		this.apiHelper = new ApiHelper(this.$store.getters.nyTimesApiKey);
		this.getSelectedSection();
	},

	methods: {
		/*
		| função: getSelectedSection
		| Busca a section selecionada na store ou na query da URL
		| ---- */
		getSelectedSection: function () {
			let section = this.$store.getters.currentSection;

			if (LibUtils.isFilled(section)) {
				this.sectionName = section.display_name;
				this.section = section.section;
			}

			if (LibUtils.isEmpty(this.section)) {
				let queryParams = this.$route.query;
				if (queryParams != null) {
					this.section = queryParams.section;
				}
			}
			this.getSectionNews();
		},

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
			let endpoint = this.apiHelper.Endpoints.filtered;
			let apiUrl = this.apiHelper.buildRequestUrl(endpoint);

			if (LibUtils.isEmpty(this.section)) {
				this.section = "all";
			}

			let sectionDisplayName = this.sectionName || this.section || "News";
			this.section = this.section.replace(/ /g, "").replace(/[.]/g, "").toLowerCase();

			apiUrl = apiUrl.replace("[SECTION]", this.section);

			this.isFetchingData = true;
			this.errorMessage = "";
			this.sectionTitle = sectionDisplayName;
			this.topArticles = [];
			this.minorArticles = [];

			if (LibUtils.isFilled(apiUrl)) {
				axios
					.get(apiUrl)
					.then(
						function (response) {
							this.isFetchingData = false;
							this.normalizeArticlesData(response.data);

							//TODO -> adicionar paginação para melhorar fluidez da pagina
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
		| função: setSelectedSection
		| navega para pagina de noticias especifica de uma seção
		| ---- */
		setSelectedSection: function (section) {
			if (LibUtils.isFilled(section)) {
				if (section.section === "all") {
					this.navigate("/");
				} else {
					this.sectionName = "TESTE";
					this.$store.dispatch("setSection", section);
					this.navigate("articles-section", { section: section.section }, true);
				}
			}
		},
	},

	watch: {
		"$route.query": "getSelectedSection",
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
	margin: 5px calc(3% + 16px);
	justify-content: space-between;

	h5 {
		font-size: 23px;
		margin: 0;
	}
}

.input-pesquisa-box {
	width: 480px;
	margin: 0;
}

@media (max-width: 991px) {
}

@media (max-width: 767px) {
	.topArticles-holder {
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

	.about-article-box {
		h5 {
			width: 100%;
			text-align: center;
		}
	}
}
</style>
