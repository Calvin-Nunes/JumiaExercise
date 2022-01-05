import LibUtils from "static/libraries/libUtils";

class ApiHelper {
	ApiKey = "hOjNh9CbqGgfNV8N7qawjcMchELLkL9X"; //TODO -> Add to secure place before production release
	ApiUrl = "https://api.nytimes.com/svc/";
	Endpoints = {
		latest: "news/v3/content/nyt/all.json",
		search: "search/v2/articlesearch.json?q=",
		filtered: "topstories/v2/[SECTION].json",
	};

	constructor(apiKey) {
		if (apiKey != null) {
			this.ApiKey = apiKey;
		}
	}
	
	buildRequestUrl(endpoint, queryParams) {
		if (LibUtils.isEmpty(endpoint)) {
			alert("Não é possível enviar a requisição para API: Endpoint inválido");
		} else {
			let url = `${this.ApiUrl}${endpoint}`;

			if (LibUtils.isFilled(queryParams)) {
				url += `${queryParams}&api-key=${this.ApiKey}`;
			} else {
				url += `?api-key=${this.ApiKey}`
			}

			return url;
		}
	}
}

export default ApiHelper;
