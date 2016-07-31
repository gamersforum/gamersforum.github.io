var MyRouter = Backbone.Router.extend({
    initialize: function(){
        new RegisterView();
        new LoginView();
        new LogoutView();
        username = localStorage.getItem('username');
        users.fetch({
            success: function(request, xhr, others){
                var g = users.where({username:username});
                if(g.length == 0){
                    $("#usernavbar").hide();
                    $("#logoutnavbar").hide();
                    username = "";
                    localStorage.setItem('username', username);
                }
                else{
                    $("#loginnavbar").hide();
                    $("#usernavbar").html("<a> Welcome " + username + ",</a>");
                    $("#logoutnavbar").html("<a data-toggle='modal' data-target='#logoutModal' href=\"\">Logout</a>").show();
                }    
            }
        });
    },
    routes:{
        "":"MainRoute",
        "topics/:id":"getTopics",
        "topics/:gid/posts/:tid":"getPosts"
    },
    MainRoute: function(){
        $("#game-division").show();
        new GamesView();
        $("#topic-division").hide();
        $("#post-division").hide();
    },
    getTopics: function(topicsid){
        $("#game-division").hide();
        $("#post-division").hide();
        new TopicsView({id:topicsid});
        new TopicCreateView({id:topicsid});
        $("#topic-division").show();
    },
    getPosts: function(gid, tid){
        $("#game-division").hide();
        $("#topic-division").hide();
        new PostsView({gid:gid,tid:tid});
        new PostCreateView({tid:tid,gid:gid});
        $("#post-division").show();    
    }
});

var router = new MyRouter;
Backbone.history.start();