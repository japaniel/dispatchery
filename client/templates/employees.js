Session.setDefault('ShowProjectDialog', false);
Session.setDefault('SelectedTech', null);

Template.employees.helpers({

    showProjectDialog : function showProjectDialog(){
        return Session.get('ShowProjectDialog');
    }
});


Template.employees.events = {
    "click .addUser" :  function openForm(event,template){
       event.preventDefault();
       Session.set('ShowProjectDialog', true);
    }
};

//add User Form

Template.addUserForm.events = {
    "click .close" :  function closeForm(event,template){
        event.preventDefault();
        Session.set('ShowProjectDialog', false);
        Session.set('SelectedTech', null);
    },
    'click .submit' :  function submitForm(event,template){
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

    tech : function tech(){
        return _Techs.findOne({_id : Session.get('SelectedTech')});
    }
});

var addUser = function addUser(name){
    _Techs.insert({
      name : name,
      workingDays : getCheckedFromForm
    });
};

function getCheckedFromForm(dayGroup)
{
    var elements = document.getElementsByName(dayGroup);
    for (var i = 0, l = elements.length; i < l; i++)
    {
        if (elements[i].checked)
        {
          return {$push: {day : checked}};
        }
        return {$push: {day : "null"}};
    }
};

var updateProject = function updateProject(name){
    _Techs.update(Session.get('SelectedTech'), {$set :{
      name : name,
      workingDays : getCheckedFromForm
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
    },
    today : function today(){
      var val = document.getElementById(this.id)
      _Techs.findOne({_id : this._id}, {workingDays: {$slice: [val , 1] }})
    }

});

Template.schedule.events({
    "click .sendToWork" :  function addTechToQ(event,template){
        event.preventDefault();
        _Queue.insert({
            name : this.name,
            _id : this._id,
            totaltickets : 0,
            dispatched : false,
            timesincelast : new Date(),
            status : "working"
        })
    },"dblclick .schedule" : function editTech(event, tmpl){
        event.preventDefault();
        Session.set('SelectedTech', this._id);
        Session.set('ShowProjectDialog', true);
    },
    "click .removetech" :  function removetech(event, tmpl){
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
    techs: function findTech() {
        return _Techs.find();
    }
});

Template.techs.events({

});

Template.registerHelper("prettifyDate", function timer(timestamp) {
    return moment(new Date(timestamp)).fromNow();
});
