<template>
	<div class="page-content">
		<section>
			<div class="page-header">
				<a @click="$router.go(-1)" class="return-button">Back</a>
				<div class="header-left">
					<h1 class="page-title meal-name">{{ mealName }}</h1>
					<h4 class="meal-category" @click="returnToCategory">{{ meal.strCategory || "" }}</h4>
				</div>
				<div class="header-right">
					<img v-if="meal != null && meal.strMealThumb != null" :src="meal.strMealThumb" class="meal-photo" width="256px" />
				</div>
			</div>
		</section>
		<section>
			<div class="meal-holder" v-if="meal != null && meal.idMeal > 0">
				<c-button caption="Jump to Video" theme="light" id="go-video-button" :onTap="scrollToPreparationVideo">
					<icon icon="fas fa-video"></icon>
				</c-button>
				<h3 class="meal-section-title">Ingredients</h3>
				<div class="meal-section">
					<ul class="ingredients-list">
						<li v-for="(item, index) in mealIngredients" :key="index" class="show-as-animation">{{ item.measure }} {{ item.name }}</li>
					</ul>
				</div>
				<h3 class="meal-section-title">How to Prepare</h3>
				<div class="meal-section">
					<p v-for="(instruction, i) in meal.strInstructions.split('. ')" :key="i" class="prepare-instructions">{{ instruction }}.</p>
				</div>

				<div class="tags-holder">
					<span v-for="(tag, index) in getMealTags" :key="index">{{ tag }}</span>
				</div>

				<div v-if="meal.strYoutube && meal.strYoutube.length > 0" class="video-holder">
					<iframe title="Video" height="300" width="380" :src="getYoutubeEmbedVideo" id="preparation-video"></iframe>
				</div>
				<span class="meal-source">
					From:
					<a :href="this.meal.strSource || '#'" target="_blank">{{ this.meal.strSource || "" }}</a>
				</span>
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
	mixins: [mixinsHelper],
	data: () => {
		return {
			mealName: "",
			mealId: 0,
			meal: {},
			mealIngredients: [],
		};
	},

	created() {
		let queryParams = this.$route.query;
		if (queryParams != null) {
			this.mealName = queryParams.meal || "";
			this.mealId = LibUtils.toDecimal(queryParams.id);
		}

		this.getMeal();
	},

	methods: {
		/*
		| função: normalizeIngredients
		| Se houver uma receita, ajusta os dados referentes a ingredientes que vem da API por propriedade em uma lista organizada de objetos
		| ---- */
		normalizeIngredients: function () {
			this.mealIngredients = [];
			if (this.meal != null && this.meal.idMeal > 0) {
				let maxIngredientesFromApi = 20;
				for (let i = 1; i <= maxIngredientesFromApi; i++) {
					let ingredient = this.meal["strIngredient" + i];
					if (LibUtils.isFilled(ingredient)) {
						let measure = this.meal["strMeasure" + i];
						let obj = {
							name: ingredient,
							measure: measure,
						};
						this.mealIngredients.push(obj);
					}
				}
			}
		},

		/*
		| função: getMeal
		| Utilizando a classe auxiliar ApiHelper, cria a URL, faz uma chamada GET para API buscando os dados das receitas da categoria
		| ---- */
		getMeal: function () {
			if (this.mealId > 0) {
				const apiHelper = new ApiHelper("1");
				let mealEndpoint = apiHelper.Endpoints.mealDetail;
				let mealUrl = apiHelper.buildRequestUrl(mealEndpoint, this.mealId);

				if (LibUtils.isFilled(mealUrl)) {
					axios
						.get(mealUrl)
						.then(
							function (response) {
								this.verifyData(response.data);
							}.bind(this)
						)
						.catch(function (error) {
							let errorMsg = "Erro ao buscar dados na API: " + error;
							alert(errorMsg);
							console.error(errorMsg);
						});
				}
			}
		},

		/*
		| função: verifyData
		| Verifica integridade dos dados recebidos e caso ok, atribui à propriedade
		| ---- */
		verifyData: function (data) {
			if (LibUtils.isFilled(data)) {
				let returnedMeals = data.meals || [];
				this.meal = returnedMeals[0] || {};
				this.mealName = this.meal.strMeal || "";
				console.log(this.meal)
				this.normalizeIngredients();
			}
		},

		/*
		| função: returnToCategory
		| Volta para a page de receitas referente a mesma categoria desta receita atual
		| ---- */
		returnToCategory: function () {
			if (LibUtils.isFilled(this.meal)) {
				let params = {
					category: this.meal.strCategory,
				};
				this.navigate("receitas-categoria", params);
			}
		},

		/*
		| função: scrollToPreparationVideo
		| Função que usa o scroll vertical para ir até o video na tela 
		| ---- */
		scrollToPreparationVideo: function () {
			this.$el.querySelector("#preparation-video").scrollIntoView({ behavior: "smooth" });
		},
	},

	computed: {
		/*
		| função: getMealTags
		| se preenchido, retorna as tags da receita em formato de array
		| ---- */
		getMealTags: function () {
			if (this.meal != null && this.meal.strTags != null && this.meal.strTags.length > 0) {
				return this.meal.strTags.split(",");
			}
		},

		/*
		| função: getYoutubeEmbedVideo
		| Função utilizada para ajustar a URL do video para ser usada em iframe, tornando o link no formato de embedded video
		| ---- */
		getYoutubeEmbedVideo: function () {
			if (this.meal != null && this.meal.idMeal > 0) {
				let videoUrl = this.meal.strYoutube;
				return videoUrl.replace("watch?v=", "embed/");
			}
		},
	},
});
</script>

<style lang="scss" scoped>
.page-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 10px 15%;
}

.header-left {
	display: inline-flex;
	flex-grow: 1;
	flex-direction: column;
	align-items: center;
}

.header-right {
	display: inline-flex;
	width: 256px;
	align-items: center;
}

.meal-name {
	text-align: left;
}

.meal-category {
	width: 100%;
	color: #666666;
	text-align: left;
	margin: 0;
}

.meal-category:hover {
	cursor: pointer;
	color: var(--system-primary-color);
}

.meal-photo {
	max-width: 256px;
	width: 100%;
	height: auto;
	object-fit: contain;
	box-shadow: 1px 2px 6px rgba(0, 0, 0, 0.2);
	border-radius: 5px;
}

.meal-holder {
	display: flex;
	flex-direction: column;
	position: relative;
	gap: 5px;
	flex-wrap: nowrap;
	margin: 0 20% 10px 20%;
	padding: 10px;
	background: linear-gradient(135deg, #ecf0ee 0%, #f5f5f5 40%, #e2e7e4 90%);
	border-radius: 5px;
	box-shadow: 1px 2px 6px rgba(0, 0, 0, 0.15);
	transition: 0.4s height ease-in;
}

.meal-section-title {
	text-align: center;
	color: var(--system-primary-color-dark);
	margin: 5px;
}

.ingredients-list {
	width: 90%;
	margin: auto;
	padding: 0 8px;
}

.ingredients-list li {
	margin: 4px 0;
	padding: 0 5px;
	list-style-type: circle;
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

#go-video-button {
	position: absolute;
	top: 5px;
	right: 5px;
	width: 180px;
	height: 40px;
}

.video-holder {
	width: 100%;
	margin: 5px auto;
	text-align: center;
}

.video-holder iframe {
	max-width: 520px;
}

.meal-source {
	font-size: 13px;
	font-style: italic;
	color: #333333;
}

@media (max-width: 991px) {
	.page-header {
		padding: 10px 10%;
	}

	.meal-holder {
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

	.meal-section {
		margin: 10px 0;
	}

	.meal-section-title {
		margin: 0px;
	}

	.ingredients-list {
		width: 95%;
	}

	.meal-name {
		font-size: 28px;
	}

	.meal-category {
		font-size: 18px;
	}

	.header-right {
		max-width: 180px;
	}

	.meal-photo {
		max-width: 180px;
	}

	.meal-holder {
		padding: 5px;
	}

	.video-holder iframe {
		max-width: 280px;
	}
}
</style>
<style lang="scss">
@media (max-width: 767px) {
	.meal-holder {
		#go-video-button {
			width: 45px;
		}
		#go-video-button span {
			display: none;
		}
	}
}
</style>
