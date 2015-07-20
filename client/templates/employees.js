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
    "click .close" :  function (event,template){
        event.preventDefault();
        Session.set('ShowProjectDialog', false);
        Session.set('SelectedTech', null);
    },
    'click .submit' :  function(event,template){
        event.preventDefault();
        var workingDays = new array();
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
},

};

Template.addUserForm.helpers({

    tech : function(){
        return _Techs.findOne({_id : Session.get('SelectedTech')});
    }
});

var addUser = function(name){
    _Techs.insert({
      name : name,
      workingDays : workingDays
    });
};

function getCheckedFromForm(dayGroup)
{
    var elements = document.getElementsByName(dayGroup);
    for (var i = 0, l = elements.length; i < l; i++)
    {
        if (elements[i].checked)
        {
          workingDays.push({day : checked});
        }
        workingDays.push({day : "null"});
    }
};

var updateProject = function(name){
    _Techs.update(Session.get('SelectedTech'), {$set :{
      name : name,
      workingDays : workingDays
    }
  });
    Meteor.call('updateWorking', Session.get('SelectedTech'));
};

Template.schedule.helpers({

    disabled : function disabled (){

        if(_Queue.findOne({_id : this._id}))
        {
        return {disabled : ""};
        }
        return {};
    }
    // today : function today(){
    //   var day = document.getElementById(this.id).value
    //  if(_Techs.find(day))
    // {
    //   return {checked : ""};
    // }
    // return {};
    // }

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
    },"dblclick .schedule" : function editTech (event, tmpl){
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
