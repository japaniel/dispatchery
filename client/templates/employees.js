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
    'click .clockpicker' : function () {
    $('.clockpicker').clockpicker();
},
    'click .submit' :  function submitForm(event,template){
        event.preventDefault();
        var name = template.find('.inputName').value;
        var Monday = template.find('.day1').checked;
        var Tuesday = template.find('.day2').checked;
        var Wednesday = template.find('.day3').checked;
        var Thursday = template.find('.day4').checked;
        var Friday = template.find('.day5').checked;
        var Saturday = template.find('.day6').checked;
        var Sunday = template.find('.day7').checked;
        if(Session.get('SelectedTech'))
        {
            updateProject(name,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday);
        }
        else{
            addUser(name,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday);
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

var addUser = function addUser(name,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday){
    _Techs.insert({
      name : name,
      Monday : Monday,
      Tuesday : Tuesday,
      Wednesday  : Wednesday,
      Thursday : Thursday,
      Friday : Friday,
      Saturday : Saturday,
      Sunday : Sunday
    });
};

var updateProject = function updateProject(name,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday){
    _Techs.update(Session.get('SelectedTech'), {$set :{
      name : name,
      Monday : Monday,
      Tuesday : Tuesday,
      Wednesday  : Wednesday,
      Thursday : Thursday,
      Friday : Friday,
      Saturday : Saturday,
      Sunday : Sunday
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
