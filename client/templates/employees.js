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
    }
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
    _Techs.insert({name : name,
    Monday : MondayForm,
    Tuesday : TuesdayForm,
    Wedensday : WedensdayForm,
    Thursday : ThursdayForm,
    Friday : FridayForm,
    Saturday : SaturdayForm,
    Sunday : SundayForm})
};

var MondayForm = function(){
  document.getElementById("Monday").checked
};
var TuesdayForm = function(){
  document.getElementById("Tuesday").checked
};
var WedensdayForm = function(){
  document.getElementById("Wedensday").checked
};
var ThursdayForm = function(){
  document.getElementById("Thursday").checked
};
var FridayForm = function(){
  document.getElementById("Friday").checked
};
var SaturdayForm = function(){
  document.getElementById("Saturday").checked
};
var SundayForm = function(){
  document.getElementById("Sunday").checked
};


var updateProject = function(name){
    _Techs.update(Session.get('SelectedTech'), {$set :{name : name}});
    Meteor.call('updateWorking', Session.get('SelectedTech'));
};



Template.schedule.helpers({

    disabled : function(){

        if(_Queue.findOne({_id : this._id}))
        {
        return {disabled : ""};
        }
        return {};
    }
});

Template.schedule.events({
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
    },"dblclick .schedule" : function(event, tmpl){
        event.preventDefault();
        Session.set('SelectedTech', this._id);
        Session.set('ShowProjectDialog', true);
    },
    "click .removetech" :  function(event, tmpl){
      if(_Queue.findOne({_id : this._id}))
      {
      _Queue.remove({
          _id : this._id})
           }
           else {
             _Techs.remove({
             _id : this._id});
           }
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
