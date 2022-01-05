export const state = () => ({
	currentSection: null,
	article: null,
	nyTimesApiKey: "hOjNh9CbqGgfNV8N7qawjcMchELLkL9X"
});

//Actions
export const actions = {
	setSection({ commit }, section) {
		commit("defineCurrentSection", section);
	},
	setArticle({ commit }, article) {
		commit('defineArticle', article)
	},
};

//Mutations
export const mutations = {
	defineCurrentSection(state, section) {
		state.currentSection = section;
	},
	defineArticle(state, article) {
		state.article = article;
	}
};

//Getters
export const getters = {
	currentSection: (state) => { return state.currentSection },
	article: (state) => { return state.article },
	nyTimesApiKey:(state) => {return state.nyTimesApiKey}
};
