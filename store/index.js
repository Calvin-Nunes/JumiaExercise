//NÃO USADO NESTE PROJETO
// holds your root state
export const state = () => ({
	currentSection: null
});

//Actions
export const actions = {
	setSection({commit}, section){
		commit("defineCurrentSection", section)
	}
};

//Mutations
export const mutations = {
	defineCurrentSection(state, section){
		state.currentSection = section
	}
};

//Getters
export const getters = {
	currentSection: (state) => {return state.currentSection}
};
