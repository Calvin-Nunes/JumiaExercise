<template>
	<div class="page-content">
		<section>
			<div class="banner-box">
				<img src="~/assets/images/banner.svg" alt="banner" height="250" />
			</div>
		</section>

		<section>
			<div class="description-card">
				<div class="input-pesquisa-box">
					<c-search-box :onSearch="goToSearchIngredient" placeholder="What ingredient is your favorite?" height="50" fontSize="20"></c-search-box>
				</div>
				<h3>Choose a Category</h3>
			</div>
		</section>

		<section>
			<div class="categories-holder">
				<load-spinner v-if="isFetchingData" :loading="isFetchingData"></load-spinner>
				<a v-for="category of categories" :key="category.idCategory" class="category-card show-as-animation" @click="goToMealCategory(category)">
					<div class="category-image-holder">
						<img :src="category.strCategoryThumb" :alt="category.strCategory" />
					</div>
					<h4 class="category-name">{{ category.strCategory }}</h4>
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
			categories: [],
			isFetchingData: false,
		};
	},

	created() {
		this.getCategories();
	},

	methods: {
		/*
		| função: goToMealCategory
		| Listener de click para categorias, ao clicar irá abrir a page das receitas da categoria selecionada
		| ---- */
		goToMealCategory: function (category) {
			if (LibUtils.isFilled(category)) {
				let params = {
					category: category.strCategory,
					id: category.idCategory,
				};
				this.navigate("receitas-categoria", params);
			}
		},
		/*
		| função: getCategories
		| Utilizando a classe auxiliar ApiHelper, cria a URL, faz uma chamada GET para API buscar todas categorias do MealDB
		| ---- */
		getCategories: function () {
			const apiHelper = new ApiHelper("1");
			let categoriesEndpoint = apiHelper.Endpoints.categories;
			let categoriesUrl = apiHelper.buildRequestUrl(categoriesEndpoint);

			this.isFetchingData = true;

			if (LibUtils.isFilled(categoriesUrl)) {
				axios
					.get(categoriesUrl)
					.then(
						function (response) {
							this.isFetchingData = false;
							this.verifyCategoriesData(response.data);
						}.bind(this)
					)
					.catch(
						function (error) {
							this.isFetchingData = false;
							let errorMsg = "Erro ao buscar dados na API: " + error;
							alert(errorMsg);
							console.error(errorMsg);
						}.bind(this)
					);
			}
		},

		/*
		| função: verifyCategoriesData
		| Verifica integridade dos dados recebidos e caso ok, atribui à propriedade
		| ---- */
		verifyCategoriesData: function (data) {
			if (LibUtils.isFilled(data)) {
				this.categories = data.categories || [];
			}
		},

		/*
		| função: goToSearchIngredient
		| Utilizando o texto pesquisado, abre a pagina de pesquisa já com a pesquisa pronta
		| ---- */
		goToSearchIngredient: function (text) {
			if (text && text.length > 0) {
				this.navigate("pesquisa-ingrediente", { ingredient: text });
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

.input-pesquisa-box {
	width: 480px;
	margin: 15px auto;
}

.categories-holder {
	display: flex;
	gap: 5px;
	flex-wrap: wrap;
	margin: 0 5% 10px 5%;
	padding: 10px;
	background: linear-gradient(135deg, #ecf0ee 0%, #f5f5f5 40%, #e2e7e4 90%);
	border-radius: 5px;
	box-shadow: 1px 2px 6px rgba(0, 0, 0, 0.15);
}

.category-card {
	width: calc(20% - 5px);
	display: inline-flex;
	flex-direction: column;
	border-radius: 4px;
	border: 1px solid rgb(210, 210, 210);
	transition: 0.3s all ease-in;
	align-items: center;
	background-color: #f5f5f5;
}

.category-card:hover {
	border-color: rgb(175, 175, 175);
	background: rgba(40, 170, 60, 0.4);
	cursor: pointer;
}

.category-card:hover .category-name {
	color: #000000;
}

.category-image-holder {
	width: 100%;
	padding: 10px 5px;
	height: 86px;
}

.category-image-holder img {
	display: block;
	max-width: 86px;
	height: auto;
	max-height: 86px;
	object-fit: contain;
	margin: 0 auto;
	text-align: center;
}

.category-name {
	text-align: center;
	margin: 5px 0;
	padding: 0 5px;
	color: #222222;
}

@media (max-width: 991px) {
	.category-card {
		width: calc(25% - 5px);
	}
}

@media (max-width: 767px) {
	.categories-holder {
		padding: 5px;
		margin: 0 0 10px 0;
	}

	.category-card {
		width: calc(50% - 5px);
	}

	.input-pesquisa-box {
		width: 90%;
		margin: 8px auto;
	}
}
</style>
