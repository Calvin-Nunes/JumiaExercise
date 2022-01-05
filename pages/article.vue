<template>
	<div class="page-content">
		<div v-if="errorMessage.length > 0" class="fetch-error-display">{{ this.errorMessage }}</div>

		<div v-if="article != null && errorMessage.length == 0" style="width: 100%">
			<section>
				<div class="page-header">
					<a @click="$router.go(-1)" class="return-button">Back</a>
					<div class="header-box">
						<h1 class="page-title article-name">{{ article.title }}</h1>
						<h4 class="article-section" @click="goToSection(article.section)">{{ article.section || "" }}</h4>
						<span class="article-update-date">{{ article.display_date || "" }}</span>
					</div>
				</div>
			</section>

			<section>
				<div class="article-holder">
					<img v-if="article != null && article.thumbnail_image != null" :src="article.thumbnail_image" class="article-photo" width="300px" />

					<div v-if="article.subheadline != null && article.subheadline.length > 0">
						<h4 class="article-subheadline">{{ article.subheadline }}</h4>
					</div>

					<div>
						<p class="article-description">{{ article.abstract }}</p>
					</div>

					<span class="article-writer">
						<p>{{ article.byline || "" }}</p>
					</span>
					<span class="article-original-date">{{ article.original_date || "" }}</span>

					<div class="tags-holder">
						<span v-for="(tag, index) in getArticleTags" :key="index">{{ tag }}</span>
					</div>

					<span class="article-source">
						From:
						<a :href="this.article.url || '#'" target="_blank">{{ this.article.url || "" }}</a>
					</span>
				</div>
			</section>
		</div>
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
	mixins: [mixinsHelper],
	data: () => {
		return {
			article: {},
			errorMessage: "",
		};
	},

	created() {
		this.getArticleInfo();
	},

	beforeDestroy() {
		this.$store.dispatch("setArticle", null);
	},

	methods: {
		/*
		| função: getArticleInfo
		| Busca na store (ou na sessionStorage) o artigo selecionado
		| ---- */
		getArticleInfo: function () {
			this.article = this.$store.getters.article;

			if (LibUtils.isEmpty(this.article)) {
				let articleFromSession = sessionStorage.getItem("article");
				if (LibUtils.isFilled(articleFromSession)) {
					this.article = JSON.parse(articleFromSession);
					this.$store.dispatch("setArticle", this.article);
				}
			}

			console.log(this.article);
		},

		/*
		| função: goToSection
		| Volta para a page especifica de artigos de uma section
		| ---- */
		goToSection: function (section) {
			if (LibUtils.isFilled(this.article)) {
				let params = {
					section: section,
				};
				this.navigate("articles-section", params);
			}
		},
	},

	computed: {
		/*
		| função: getArticleTags
		| se preenchido, retorna as tags da receita em formato de array
		| ---- */
		getArticleTags: function () {
			if (this.article != null && this.article.section != null) {
				return this.article.section.split(",");
			}
		},
	},
});
</script>

<style lang="scss" scoped>
.page-header {
	display: flex;
	flex-direction: column;
	padding: 10px 15%;
	margin: 0 0 5px 0;
}

.header-box {
	display: inline-flex;
	flex-grow: 1;
	flex-direction: column;
}

.article-name {
	text-align: left;
}

.article-section {
	width: 100%;
	color: #666666;
	text-align: left;
	margin: 0;

	&:hover {
		color: black;
		cursor: pointer;
	}
}

.article-photo {
	max-width: 512px;
	width: 100%;
	height: auto;
	object-fit: contain;
	box-shadow: 1px 2px 6px rgba(0, 0, 0, 0.15);
	border-radius: 5px;
	margin: 0 auto;
}

.article-holder {
	display: flex;
	flex-direction: column;
	position: relative;
	gap: 5px;
	flex-wrap: nowrap;
	margin: 0 20% 10px 20%;
	padding: 10px;
	background: linear-gradient(135deg, #f2f2f2 0%, #fafafa 40%, #f2f2f2 90%);
	border: 1px solid #e9e9e9;
	border-radius: 5px;
	transition: 0.4s height ease-in;
}

.article-subheadline {
	text-align: center;
	color: #444444;
	margin: 5px 0;
	padding: 0 5px;
}

.article-section-title {
	text-align: center;
	color: black;
	margin: 5px;
}

.tags-holder {
	margin: 3px 0;
}

.tags-holder span {
	margin: 2px;
	border: 1px solid rgba(0, 0, 0, 0.15);
	border-radius: 5px;
	background-color: var(--color-primary);
	padding: 3px 5px;
	color: #eeeeee;
	font-size: 13px;
}

.article-source {
	margin-top: 8px;
	font-size: 13px;
	font-style: italic;
	color: #888888;
}

.article-writer {
	color: #666666;
	font-size: 14px;
}

.article-update-date {
	color: #888888;
	font-size: 12px;
	text-align: left;
	margin-top: 2px;

	&::before {
		content: "Last update: ";
	}
}

.article-original-date {
	color: #888888;
	font-size: 12px;
}

@media (max-width: 991px) {
	.page-header {
		padding: 10px 10%;
	}

	.article-holder {
		margin: 0 2% 10px 2%;
	}
}

@media (max-width: 767px) {
	.page-header {
		padding: 15px 2%;
	}
	.page-header .page-logo {
		width: 86px;
	}

	.article-section {
		margin: 10px 0;
	}

	.article-section-title {
		margin: 0px;
	}

	.article-name {
		font-size: 28px;
	}

	.article-section {
		font-size: 18px;
	}

	.header-right {
		max-width: 180px;
	}

	.article-photo {
		max-width: 180px;
	}

	.article-holder {
		padding: 5px;
	}
}
</style>
