import LibUtils from "static/libraries/libUtils";
export default {
	methods: {
		navigate: function (page, queryParams) {
			if (LibUtils.isFilled(page)) {
				let navigatorOptions = { path: page };

				if (LibUtils.isFilled(page)) {
                    for (let prop in queryParams){
                        queryParams[prop] = this.getNormalizedQuery(queryParams[prop])
                    }
					navigatorOptions.query = queryParams;
				}

				this.$router.push(navigatorOptions);
			}
		},

        getNormalizedQuery:function(query){
            query = query.replace(/ /g,"-")
            query = query.replace(/&/g,"")
            query = query.replace(/\?/g,"-")
            query = encodeURI(query)
            return query
        },		
	},
};
