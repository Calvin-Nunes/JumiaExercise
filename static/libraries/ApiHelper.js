import LibUtils from "static/libraries/libUtils";

class ApiHelper {
	ApiKey = "";
	ApiUrl = "https://themealdb.com/api/";
	ApiVersion = "json/v1/";
	Endpoints = {
		categories: "/categories.php",
		mealDetail: "/lookup.php?i=",
		category: "/filter.php?c=",
		searchIngredient: "/filter.php?i=",
	};

	constructor(apiKey) {
		this.ApiKey = apiKey;
	}

	buildRequestUrl(endpoint, queryParams) {
		if (LibUtils.isEmpty(endpoint)) {
			alert("Não é possível enviar a requisição para API: Endpoint inválido");
		} else {
			let url = this.ApiUrl + this.ApiVersion + this.ApiKey + endpoint;
			if (LibUtils.isFilled(queryParams)) {
				url += queryParams;
			}

			return url;
		}
	}
}

export default ApiHelper;
