var User = Backbone.Model.extend({
    default: function(){
        return{
            id: null,
            username: "",
            first_name: "",
            last_name: "",
            email: "",
            password: ""
        }
    } 
});

var Game = Backbone.Model.extend({
    default: function(){
        return{
            id: null,
            name: "",
            poster: "",
            info: "",
            category: "",
            owner: null
        }
    }
});

var Topic = Backbone.Model.extend({
    default: function(){
        return{
            name: "",
            desc: "",
            game_id: null,
            owner: null
        }
    }
});

var Post = Backbone.Model.extend({
    default: function(){
        return{
            topic_id: 0,
            game_id: 0,
            title: "",
            post: "",
            likes: 0,
            dislikes: 0,
            owner: null
        }
    } 
});