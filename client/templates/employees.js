Session.setDefault('ShowProjectDialog', false);
Session.setDefault('SelectedTech', null);

Template.employees.helpers({

    showProjectDialog : function(){
        return Session.get('ShowProjectDialog');
    }
});


Template.employees.events = {
    "click .addUser" :  function(event,template){
       event.preventDefault();
       Session.set('ShowProjectDialog', true);
        //$("#" + $(event.target).attr("href")).modal("show");
    }
    //,
    //'click save' :  function(event,template){
    //    event.preventDefault();
    //    $("#" + $(event.target).attr("href")).modal("show");
    //
    //}
};

//add User Form

Template.addUserForm.events = {
    "click .close" :  function(event,template){
        event.preventDefault();
        Session.set('ShowProjectDialog', false);
        Session.set('SelectedTech', null);
    },
    'click .submit' :  function(event,template){
        event.preventDefault();
        var name = template.find('.inputName').value;
        if(Session.get('SelectedTech'))
        {
            updateProject(name);
        }
        else{
            addUser(name);
        }

        Session.set('ShowProjectDialog', false);
        Session.set('SelectedTech', null);
}
};

Template.addUserForm.helpers({

    tech : function(){
        return _Techs.findOne({_id : Session.get('SelectedTech')});
    }

});

var addUser = function(name){
    _Techs.insert({name:name})
};

var updateProject = function(name){
    _Techs.update(Session.get('SelectedTech'), {$set :{name : name}});
    Meteor.call('updateWorking', Session.get('SelectedTech'));
};



Template.tech.helpers({

    disabled : function(){

        if(_Queue.findOne({_id : this._id}))
        {
            return {disabled : ""};
        }
        return {};
    }


});

Template.tech.events({
    "click .sendToWork" :  function(event,template){
        event.preventDefault();
        _Queue.insert({
            name : this.name,
            _id : this._id,
            totaltickets : 0,
            dispatched : false,
            timesincelast : new Date(),
            status : "working"
        })
    },"dblclick .tech" : function(event, tmpl){
        event.preventDefault();
        Session.set('SelectedTech', this._id);
        Session.set('ShowProjectDialog', true);
    }
});



Template.techs.helpers({
    techs: function () {
        return _Techs.find();
    }
});

Template.techs.events({

});

Template.registerHelper("prettifyDate", function(timestamp) {
    return moment(new Date(timestamp)).fromNow();
});
