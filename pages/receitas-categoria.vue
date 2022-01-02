<template>
	<div class="page-content">
		<section>
			<div class="page-header">
				<a @click="$router.go(-1)" class="return-button">Back</a>
				<div class="header-top-holder">
					<h1 class="page-title">{{ categoryName }}</h1>
					<img src="~/assets/images/icon.png" class="page-logo" />
				</div>
			</div>
		</section>

		<section ref="section_meals">
			<h4 class="page-subtitle">Meals</h4>

			<div class="meals-holder">
				<load-spinner v-if="isFetchingData" :loading="isFetchingData"></load-spinner>
				<div
					v-else-if="meals.length > 0"
					v-for="meal of mealsDisplaying"
					:key="meal.idMeal"
					class="meal-row show-as-animation"
					@click="goToMealDetails(meal)">

					<div class="meal-image-holder">
						<img :src="meal.strMealThumb" :alt="meal.strMeal" class="img-thumbnail"/>
					</div>
					
					<p class="meal-name">{{ meal.strMeal }}</p>
				</div>
				<p v-else>No meals available</p>
			</div>

			<div class="pagination-box" v-if="totalPages > 1">
				<c-button caption="< Anterior" theme="light" :disabled="currentPage <= 1" :onTap="recuarPaginacao"> </c-button>
				<p>{{ currentPage }} / {{ totalPages }}</p>
				<c-button caption="Próximo >" theme="light" :disabled="currentPage >= totalPages" :onTap="avancarPaginacao"> </c-button>
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
	components: { "load-spinner": LoadSpinner },
	mixins: [mixinsHelper],
	data: () => {
		return {
			categoryName: "",
			categoryId: 0,
			searchText: "",
			meals: [],
			mealsDisplaying: [],
			perPageLimit: 20,
			currentPage: 1,
			totalPages: 1,
			isFetchingData: false,
		};
	},

	created() {
		let queryParams = this.$route.query;
		if (queryParams != null) {
			this.categoryName = queryParams.category || "";
			this.categoriaId = LibUtils.toDecimal(queryParams.id);
		}

		this.getMeals();
	},

	updated() {
		if (!this.isFetchingData && this.meals.length == 0) {
			this.getMeals();
		}
	},

	methods: {
		/*
		| função: getMeals
		| Utilizando a classe auxiliar ApiHelper, cria a URL, faz uma chamada GET para API buscando os dados das meals da category
		| ---- */
		getMeals: function () {
			if (LibUtils.isFilled(this.categoryName)) {
				const apiHelper = new ApiHelper("1");
				let mealsEndpoint = apiHelper.Endpoints.category;
				let mealsUrl = apiHelper.buildRequestUrl(mealsEndpoint, this.categoryName);

				if (LibUtils.isFilled(mealsUrl)) {
					this.isFetchingData = true;
					axios
						.get(mealsUrl)
						.then(
							function (response) {
								this.isFetchingData = false;
								this.verifyData(response.data);
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
			}
		},

		/*
		| função: verifyData
		| Verifica integridade dos dados recebidos e caso ok, atribui à propriedade
		| ---- */
		verifyData: function (data) {
			if (LibUtils.isFilled(data)) {
				this.meals = data.meals || [];
				this.paginarDados();
			}
		},

		/*
		| função: goToMealDetails
		| Listener de click para meals, ao clicar irá abrir a page de detalhes da meal selecionada
		| ---- */
		goToMealDetails: function (meal) {
			if (LibUtils.isFilled(meal)) {
				let params = {
					meal: meal.strMeal,
					id: meal.idMeal,
				};
				this.navigate("receita", params);
			}
		},

		/*
		| função: paginarDados
		| Corre do ponto inicial ao limite por exibição e coloca no array que será usado para exibição
		| ---- */
		paginarDados: function () {
			this.totalPages = Math.ceil(this.meals.length / this.perPageLimit);

			this.mealsDisplaying = [];
			let i = (this.currentPage - 1) * this.perPageLimit;

			let limite = i > 0 ? i * 2 : this.perPageLimit;
			if (limite >= this.meals.length) {
				limite = this.meals.length;
			}

			for (i; i < limite; i++) {
				let meal = this.meals[i];
				if (LibUtils.isFilled(meal)) {
					this.mealsDisplaying.push(meal);
				}
			}

			let scrollTo = this.$refs.section_meals;
			if (scrollTo != null) {
				scrollTo.scrollIntoView({ behavior: "smooth" });
			}
		},

		/*		 
		| funções relativas à avançar e recuar paginação
		| ---- */
		avancarPaginacao: function () {
			this.currentPage++;
			if (this.currentPage > this.totalPages) {
				this.currentPage = this.totalPages;
			}
			this.paginarDados();
		},

		recuarPaginacao: function () {
			this.currentPage--;
			if (this.currentPage < 1) {
				this.currentPage = 1;
			}
			this.paginarDados();
		},
	},
});
</script>

<style lang="scss" scoped>
.input-pesquisa-box {
	width: 100%;
	margin: 8px auto;
}

.meals-holder {
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

.meal-row {
	width: 100%;
	display: flex;
	flex-direction: row;
	border-radius: 4px;
	border: 1px solid rgb(210, 210, 210);
	box-shadow: 1px 2px 6px rgba(0, 0, 0, 0.15);
	transition: 0.3s all ease-in;
	align-items: center;
}

.meal-row:hover {
	border-color: rgb(175, 175, 175);
	background: rgba(40, 170, 60, 0.4);
	cursor: pointer;
}

.meal-row:hover .meal-name {
	color: #000000;
}

.meal-image-holder {
	display: inline-flex;
	width: 86px;
	height: 86px;
	padding: 0 5px;
	flex-shrink: 0;
}

.meal-name {
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
	.meals-holder {
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

	.meals-holder {
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
