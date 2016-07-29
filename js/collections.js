var Users = Backbone.Collection.extend({
    model: User,
    url: "http://ashuthosh.pythonanywhere.com/api/user/",
});

var Games = Backbone.Collection.extend({
    model: Game,
    url: "http://ashuthosh.pythonanywhere.com/api/game/",
});

var Topics = Backbone.Collection.extend({
    model: Topic,
    setParent: function(parentId){
        this.game_id = parentId;
    },
    url: function(){
        return "http://ashuthosh.pythonanywhere.com/api/game/" + this.game_id + "/topics/";
    }
});

var Posts = Backbone.Collection.extend({
    model: Post,
    setParent: function(topicsId, gamesId){
        console.log("T:" + topicsId +"G:" + gamesId);
        this.topic_id = topicsId;
        this.game_id = gamesId;
    },
    url: function(){
        return "http://ashuthosh.pythonanywhere.com/api/game/" + this.game_id + "/topics/" + this.topic_id + "/posts/";
    }
});

var users = new Users;
users.fetch();
var games = new Games;
var topics = new Topics;
var posts = new Posts;
var username = "";