import LibUtils from "static/libraries/libUtils";

export default {
    methods: {
        /*
        | função: openArticle
        | Listener de click para artigo clicado, ao clicar irá abrir a page com a notícia/artigo detalhado
        | ---- */
        openArticle: function (article) {
            if (LibUtils.isFilled(article)) {

                let friendlyName = article.title.replace(/ /g, "-").toLowerCase()
                friendlyName = friendlyName.replace(/[,]/g, "")
                friendlyName = friendlyName.replace(/[.]/g, "")
                friendlyName = friendlyName.replace(/[?]/g, "")
                friendlyName = friendlyName.replace(/[&]/g, "")
                friendlyName = friendlyName.replace(/[#]/g, "")
                friendlyName = friendlyName.replace(/[%]/g, "")
                friendlyName = friendlyName.replace(/[@]/g, "")

                let params = {
                    article: friendlyName,
                };
                console.log(article)
                this.$store.dispatch("setArticle", article);
                sessionStorage.setItem('article', JSON.stringify(article))
                this.navigate("article", params);
            }
        },

        /*
        | função: normalizeArticlesData
        | Verifica integridade dos dados recebidos e caso ok, atribui as propriedades
        | ---- */
        normalizeArticlesData: function (data) {
            if (LibUtils.isFilled(data)) {
                let allArticles = data.results || [];
                //se artigo/notícia não tem imagem, será considerado um artigo de
                //menor importância, para melhor organização
                allArticles.forEach(
                    function (art) {
                        let articleImage = this.getArticleImage(art);
                        art.display_date = new Date(art.updated_date).toLocaleString();
                        art.original_date = new Date(art.created_date).toLocaleString();

                        if (LibUtils.isFilled(articleImage)) {
                            art.thumbnail_image = articleImage;
                            this.topArticles.push(art);
                        } else {
                            this.minorArticles.push(art);
                        }
                    }.bind(this)
                );
            }
        },

        /*
        | função: getArticleImage
        | retorna a imagem que representa o artigo/notícia
        | ---- */
        getArticleImage: function (article) {
            if (LibUtils.isFilled(article)) {
                let multimedias = article.multimedia;
                if (multimedias != null && multimedias.length > 0) {
                    let image = multimedias.find((x) => x.type == "image" && x.format == "mediumThreeByTwo440");

                    if (image == null) {
                        image = multimedias.find((x) => x.type == "image");
                    }

                    if (image != null) {
                        return image.url;
                    }
                }
            }
            return null;
        },
    }
}