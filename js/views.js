var LoginView = Backbone.View.extend({
    el: $("#loginform"),
    initialize: function(){
       	this.render()
    },
    events: {
        'click #login': 'loginFunction',
    },
    render: function(){
        return this;
    },
    loginFunction: function(event){
   		$("#loginError").hide();
        var url = 'https://ashuthosh.pythonanywhere.com/api-auth/login/';
        var formValues = {
            username: $('#lusername').val(),
            password: $('#lpassword').val()
        };
        
        $.ajax({
            url: url,
            type: 'POST',
            dataType: "json",
            data: formValues,
            success: function(data){
                username = data.username;
                localStorage.setItem('username', username);
                if(data.error){
                    $("#loginError").text(data.error.text).show();
                }
                else{
                    $("#loginnavbar").hide();
                    $("#loginError").hide();
                    $("#usernavbar").html("<a> Welcome " + username + ",</a>").show();
                    $("#logoutnavbar").html("<a data-toggle='modal' data-target='#logoutModal' href=\"\">Logout</a>").show();
                    window.location.reload();
                }
            },
            error: function(){
           		$("#loginError").text("Entered Wrong Credentials.").show();
            }
        });
    }
});

var LogoutView = Backbone.View.extend({
    el: $("#logoutform"),
    initialize: function(){
        this.render();
    },
    events: {
        'click #logout': 'logoutFunction',
    },
    render: function(){
        return this;
    },
    logoutFunction: function(event){
        username = "";
        localStorage.setItem('username', username);
        $("#logoutnavbar").hide();
        $("#usernavbar").hide();
        $("#loginnavbar").show();
        window.location.reload();
    }
});

var RegisterView = Backbone.View.extend({
    el: $('#signupform'),
    events: {
        'click #signup': 'createUser',
    },
    createUser: function(){
        var us = new User(this.newAttributes());
        us.save({wait: true}).success(function(model, response){
        		$("#loginModel").hide();
        		$("#signupError").text("Registration Success Full - Login With your Credentials").show();
        		window.location.reload();
        	}).error(function(model, response, options){
        		$("#signupError").text(model.responseText).show();
        	});
    },
    newAttributes: function(){
        return{
            username: this.$("#username").val(),
            first_name: this.$("#firstname").val(),
            last_name: this.$("#lastname").val(),
            email: this.$("#emailaddress").val(),
            password: this.$("#password").val()
        }
    }
});

var GameView = Backbone.View.extend({
    tagName: 'div',
    template: _.template($('#gameitems-template').html()),
    initialize: function(){
        this.render();
    },
    render: function(){
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },
    events: {
        'click #openTopics': 'gotClicked',
    },
    gotClicked: function(){
        router.navigate('topics/' + this.model.get('id'), {trigger: true, replace:false});
    }
});

var GamesView = Backbone.View.extend({
    el: $('#gameitems'),
    initialize: function(){
        self = this;
        games.fetch({
            success: function(response, xhr, options){
                self.render();
            }
        });
    },
    render: function(){
        this.$el.html("");
        games.each(function(model){
            var list = new GameView({
                model: model
            });
            this.$el.append(list.render().el);
        }.bind(this));
    }
});

var TopicView = Backbone.View.extend({
    tagName: 'tr',
    template: _.template($('#topicitems-template').html()),
    initialize: function(){
        this.count = 0;
        this.render();
    },
    events:{
        'click #deleteTopic': 'topicDelete',
        'click .openPosts': 'openPosts',
        'click .editTopic': 'topicEdit',
        'keypress #editTopicNameInput': 'updateTopicOnEnter',
        'blur #editTopicNameInput': 'saveTopicName',
        'dblclick #topicDesc': 'descEdit',
        'keypress #editTopicDescInput': 'updateDescOnEnter',
        'blur #editTopicDescInput': 'saveDesc'
    },
    descEdit: function(){
        self = this;
        username = localStorage.getItem("username");
        users.fetch({
            success: function(request, xhr, others){
                var g = users.where({username:username,id:self.model.toJSON()['owner']});
                if(g.length == 0){
                    return;
                }
                else{
                    this.$("#topicDesc").hide();
                    this.$("#editTopicDescInput").show();
                    this.$("#editTopicDescInput").focus();
        
                }    
            }
        });
    },
    updateDescOnEnter: function(e){
        if(e.which == 13){
            this.$("#editTopicDescInput").hide();
            this.$("#topicDesc").show();
            this.saveDesc();
        }
    },
    saveDesc: function(){
        var value = this.$("#editTopicDescInput").val().trim();
        if(value){
            this.model.set({desc: value});
            this.model.save();
        }
        this.render();
    },
    topicEdit: function(){
        self = this;
        username = localStorage.getItem("username");
        users.fetch({
            success: function(request, xhr, others){
                var g = users.where({username:username,id:self.model.toJSON()['owner']});
                if(g.length == 0){
                    self.count = self.count + 1;
                    if(self.count % 2 == 1)
                        $("#topicEditError").show();
                    else
                        $("#topicEditError").hide();
                }
                else{
                    this.$("#editTopicName").hide();
                    this.$("#editTopicNameInput").show();
                    this.$("#editTopicNameInput").focus();
                }    
            }
        });
    },
    updateTopicOnEnter: function(e){
        if(e.which == 13){
            console.log("Pressed Enter");
            this.$("#editTopicNameInput").hide();
            this.$("#editTopicName").show();
            this.saveTopicName();
        }
    },
    saveTopicName: function(){
        var value = this.$("#editTopicNameInput").val().trim();
        if(value){
            this.model.set({name: value});
            this.model.save();
        }
        this.render();
    },
    openPosts: function(){
        router.navigate(Backbone.history.getFragment() + '/posts/' + this.model.get('id'), {trigger: true, replace:false});
    },
    validUser: function(){
        
    },
    topicDelete: function(){
        username = localStorage.getItem("username");
        var self = this;
        users.fetch({
            success: function(request, xhr, others){
                var g = users.where({username:username,id:self.model.toJSON()['owner']});
                if(g.length == 0){
                   	self.count = self.count + 1;
                    if(self.count % 2 == 1)
                        $("#topicDeleteError").show();
                    else
                        $("#topicDeleteError").hide();
                }
                else{
                    self.model.destroy({
                        success: function(){
                            window.location.reload();     
                        }
                    });
                }    
            }
        });
    },
    render: function(){
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});

var TopicsView = Backbone.View.extend({
    el: $('#topicitems'),
    initialize: function(option){
        username = localStorage.getItem("username");
        this.gamesid = option.id;
        topics.setParent(this.gamesid);
        var self = this;
        topics.fetch({
            success: function(response, xhr, options){
                games.fetch({
                    success: function(respones, xhr, options){
                        self.render();
                    }
                });     
            }
        });
    },
    render: function(g){
        var g = games.where({id:parseInt(this.gamesid)})[0];
        this.$el.html("<tr><td colspan='3' style=\"padding:20\" align='center'>"
                      + "<div class='row'> <div class='col-lg-5' align='center'> " 
                      + "<a href='" + g.get('poster') + "' data-lightbox='image2' data-title='" 
                      + g.get('name')
                      + "'> <img src='" + g.get('poster') + "' style='display:block;width:340;height:182'> </a> </div>"
                      + "<div class='col-lg-7'> <h2>" + g.get('name') + "</h2>" 
                      + "<h4>" + g.get('category') + "</h4>" 
                      + "<label> Game Information: </label><p>" + g.get('info') + "</p>"
                      + "</div></div> <hr> <font color='grey'> <h2> ------------TOPICS------------ </h2> </font> </td></tr>");
        topics.each(function(model){
            var list = new TopicView({
                model: model
            });
            this.$el.append(list.render().el);
        }.bind(this));
        if(username != "")
            this.$el.append("<tr><td colspan='3' style='padding:20' align=\"center\">" +
                            "<button class=\"btn btn-info btn-block\" data-toggle='modal' data-target='#topicModal'>Create New Topic</button>" +
                            "</td></tr>");
        this.$el.append("<tr><td colspan='3' style='padding:20' align=\"center\">" +
                            "<button id='topicBack' class=\"btn btn-info btn-block\">Back</button>" +
                            "</td></tr>");
    },
    events: {
    	'click #topicBack': 'goBack'
    },
    goBack: function(){
    	window.history.back();
    }
});

var PostView = Backbone.View.extend({
    tagName: 'tr',
    template: _.template($('#postitems-template').html()),
    initialize: function(){
        this.count = 0;
        this.render();
    },
    events:{
        'click .deletePost': 'postDelete',
        'click .editPostTitle': 'titleEdit',
        'keypress #editPostTitleInput': 'updateTitleOnEnter',
        'blur #editPostTitleInput': 'savePostTitle',
        'dblclick #editPost': 'postEdit',
        'keypress #editPostInput': 'updatePostOnEnter',
        'blur #editPostInput': 'savePost'
    },
    postEdit: function(){
        username = localStorage.getItem("username");
        var self = this;
        users.fetch({
            success: function(request, xhr, others){
                var g = users.where({username:username,id:self.model.toJSON()['owner']});
                if(g.length == 0){
                    return;    
                }
                else{
                    this.$("#editPost").hide();
                    this.$("#editPostInput").show();
                    this.$("#editPostInput").focus();
                }    
            }
        });
    },
    updatePostOnEnter: function(e){
        if(e.which == 13){
            this.$("#editPostInput").hide();
            this.$("#editPost").show();
            this.savePost();
        }
    },
    savePost: function(){
        var value = this.$("#editPostInput").val().trim();
        if(value){
            this.model.set({post: value});
            this.model.save();
        }
        this.render();
    },
    titleEdit: function(){
        username = localStorage.getItem("username");
        var self = this;
        users.fetch({
            success: function(request, xhr, others){
                var g = users.where({username:username,id:self.model.toJSON()['owner']});
                if(g.length == 0){
                    self.count = self.count + 1;
                    if(self.count % 2 == 1)
                        $("#postEditError").show();
                    else
                        $("#postEditError").hide();
                }
                else{
                    this.$("#title").hide();
                    this.$("#editPostTitleInput").show();
                    this.$("#editPostTitleInput").focus();
                }    
            }
        });
    },
    updateTitleOnEnter: function(e){
        if(e.which == 13){
            console.log("Pressed Enter");
            this.$("#editPostTitleInput").hide();
            this.$("#title").show();
            this.savePostTitle();
        }
    },
    savePostTitle: function(){
        var value = this.$("#editPostTitleInput").val().trim();
        if(value){
            this.model.set({title: value});
            this.model.save();
        }
        this.render();
    },
    postDelete: function(){
        username = localStorage.getItem("username");
        var self = this;
        users.fetch({
            success: function(request, xhr, others){
                var g = users.where({username:username,id:self.model.toJSON()['owner']});
                if(g.length == 0){
                    self.count = self.count + 1;
                    if(self.count % 2 == 1)
                        $("#postDeleteError").show();
                    else
                        $("#postDeleteError").hide();
                }
                else{
                    self.model.destroy({
                        success: function(){
                            window.location.reload();     
                        }
                    });
                }    
            }
        });
    },
    render: function(){
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});

var PostsView = Backbone.View.extend({
    el: $('#postitems'),
    initialize: function(option){
        username = localStorage.getItem("username");
        this.topicsid = option.tid;
        this.gamesid = option.gid;
        posts.setParent(this.topicsid, this.gamesid);
        topics.setParent(this.gamesid);
        var self = this;
        posts.fetch({
            success: function(response, xhr, options){
                topics.fetch({
                    success: function(respones, xhr, options){
                        games.fetch({
                            success: function(responses, xhr, options){
                                self.render();    
                            }
                        });
                    }
                });     
            }
        });
    },
    render: function(){
        var t = topics.where({id:parseInt(this.topicsid)})[0];
        var g = games.where({id:t.get('game_id')})[0];
        this.$el.html("<tr><td colspan='3' style=\"padding:20\" align='center'>"
                      + "<div class='row'> <div class='col-lg-5'> " 
                      + "<a href='" + g.get('poster') + "' data-lightbox='image' data-title='" 
                      + g.get('name')
                      + "'> <img src='" + g.get('poster') + "' style='display:block;width:340;height:182'> </a> </div>"
                      + "<div class='col-lg-7'> <h2>" + g.get('name') + "</h2>"
                      + "<h4>" + g.get('category') + "</h4>" 
                      + "<label> Game Information: </label><p>" + g.get('info') + "</p>"
                      + "</div></div></td></tr>");
        this.$el.append("<tr>" 
                        + "<td colspan='3' style='padding:20' align='center'>"
                        + "<h1> Topic: <font color='grey' size='6'> " + t.get('name') + " </font> </h1>"
                        + " <hr> <font color='grey'> <h2> ------------POSTS------------ </h2> </font> "
                        + "</td>"
                        + "</tr>")
        posts.each(function(model){
            var list = new PostView({
                model: model
            });
            this.$el.append(list.render().el);
        }.bind(this));
        if(username != "")
            this.$el.append("<tr><td colspan='3' style='padding:20' align=\"center\">" +
                            "<button class=\"btn btn-info btn-block\" data-toggle='modal' data-target='#postModal'>Create New Post</button>" +
                            "</td></tr>");
        this.$el.append("<tr><td colspan='3' style='padding:20' align=\"center\">" +
                            "<button id='postBack' class=\"btn btn-info btn-block\">Back</button>" +
                            "</td></tr>");
    },
    events: {
    	'click #postBack': 'goBack'
    },
    goBack: function(){
    	window.history.back();
    }
});

var TopicCreateView = Backbone.View.extend({
    el: $('#topicform'),
    initialize: function(option){
        username = localStorage.getItem('username');
        this.game_id = option.id;
        users.fetch({
            succes: function(req, xhr, c){
                self.render();
            }
        });
    },
    events: {
        'click #createTopic': 'createTopicFunction',
    },
    render: function(){
        return this;
    },
    createTopicFunction: function(event){
        topics.create(this.newAttributes(),{ 
            success: function(){
                window.location.reload();
            }
        });
    },
    newAttributes: function(){
        this.topicName = this.$('#topicname');
        this.topicDesc = this.$('#topicdesc');
        var u = users.where({username:username})[0].toJSON();
        return{
            name: this.topicName.val(),
            desc: this.topicDesc.val(),
            game_id: this.game_id,
            owner: u.id
        }
    }
});

var PostCreateView = Backbone.View.extend({
    el: $('#postform'),
    initialize: function(option){
        username = localStorage.getItem('username');
        this.game_id = option.gid;
        this.topic_id = option.tid;
        users.fetch({
            succes: function(req, xhr, c){
                topics.fetch({
                   succes: function(req, xhr, other){
                        self.render();    
                   } 
                });
            }
        });
    },
    events: {
        'click #createPost': 'createPostFunction',
    },
    render: function(){
        return this;
    },
    createPostFunction: function(event){
        posts.create(this.newAttributes(),{ 
            success: function(){
                window.location.reload();
            }
        });
    },
    newAttributes: function(){
        this.postTitle = this.$('#posttitle');
        this.postPost = this.$('#postpost');
        var u = users.where({username:username})[0].toJSON();
        return{
            topic_id: this.topic_id,
            game_id: this.game_id,
            title: this.postTitle.val(),
            post: this.postPost.val(),
            likes: 0,
            dislikes: 0,
            owner: u.id
        }
    }
});