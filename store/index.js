//NÃO USADO NESTE PROJETO
// holds your root state
export const state = () => ({
	currentSection: null,
	article: null,
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
};
