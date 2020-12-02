new Vue({
    el: "#app",
    data: function () {
        return {
            name: "Nonga",
            user: null,
            comments: [],
            loading: false,
            message: null,
            token: null,
            //token : "067d009333ade3f735405b06f1930ec933e8969178706da496dc0adf92fa29f3",
            email: null,
            password: null
        }
    },
    methods: {
        postComment(e) {
            let _this = this;
            e.preventDefault();
            $.post(`http://localhost:8000/api/comments?api_token=${this.token}`, {content: this.message}, function (data) {
                //alert(JSON.stringify(data));
                if (data != null && data.id) {
                    Toastify({
                        text: "Commentaire posté avec succès"
                    }).showToast();
                    _this.message = null;
                    _this.loadComments();
                } else {
                    Toastify({
                        text: "Echec de l'envoi du commentaire",
                        backgroundColor: "red"
                    }).showToast();
                }
            }, "json");
        },
        login() {
            let _this = this;
            Toastify({
                text: "Connexion en cours..."
            }).showToast();
            $.post(`http://localhost:8000/api/login`, {email: this.email, password: this.password}, function (data) {
                //alert(JSON.stringify(data));
                if (data != null && data.api_token) {
                    _this.token = data.api_token;
                    _this.user = data;
                    Toastify({
                        text: "connexion reussie"
                    }).showToast();
                    _this.loadComments();
                } else {
                    Toastify({
                        text: "Connexion echouée",
                        backgroundColor: "red"
                    }).showToast();
                }
            }, "json");
        },
        loadComments() {
            let _this = this;
            Toastify({
                text: "Chargement des commentaires en cours..."
            }).showToast();
            $.get(`http://localhost:8000/api/comments?api_token=${this.token}`, function (data) {
                _this.loading = false;
                const comments = [];
                if (data == null || !Array.isArray(data)) return;
                data.forEach(function (item) {
                    comments.push(item)
                });
                _this.comments = comments;
            });
        }
    },
    mounted: function () {
        if (this.token) this.loadComments();
    }
})