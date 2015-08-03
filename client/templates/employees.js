Session.setDefault('ShowProjectDialog', false);
Session.setDefault('SelectedTech', null);
Session.setDefault('ShowDeleteBox', false);

Session.set('techInQ', false);
var d = new Date();
var hours = d.getHours().toString().length == 1 ? '0' + d.getHours() : d.getHours();
var min = d.getMinutes().toString().length == 1 ? '0' + d.getMinutes() : d.getMinutes();
var newTime = hours + ':' + min;
var weekday = new Array(7);
weekday[0] = "Sunday";
weekday[1] = "Monday";
weekday[2] = "Tuesday";
weekday[3] = "Wednesday";
weekday[4] = "Thursday";
weekday[5] = "Friday";
weekday[6] = "Saturday";

var n = weekday[d.getDay()];
var today = n;

Template.employees.helpers({

  showProjectDialog: function showProjectDialog() {
    return Session.get('ShowProjectDialog');
  },
  ShowDeleteBox: function ShowDeleteBox() {
    return Session.get('ShowDeleteBox');

  }
});

Template.employees.events = {
  "click .addUser": function openForm(event, template) {
    event.preventDefault();
    Session.set('ShowProjectDialog', true);
  }
};
//add User Form
Template.addUserForm.events = {
  "click .close": function closeForm(event, template) {
    event.preventDefault();
    Session.set('ShowProjectDialog', false);
    Session.set('SelectedTech', null);
  },
  'click .clockpicker': function() {
    $('.clockpicker').clockpicker();
  },
  'click .submit': function submitForm(event, template) {
    event.preventDefault();
    var name = template.find('.inputName').value;
    var Monday = template.find('.day1').checked;
    var Tuesday = template.find('.day2').checked;
    var Wednesday = template.find('.day3').checked;
    var Thursday = template.find('.day4').checked;
    var Friday = template.find('.day5').checked;
    var Saturday = template.find('.day6').checked;
    var Sunday = template.find('.day7').checked;
    var startT = template.find('.startT').value;
    var endT = template.find('.endT').value;
    if (Session.get('SelectedTech')) {
      updateProject(name, startT, endT, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday);
    } else {
      addUser(name, startT, endT, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday);
    }
    Meteor.call("updateCron");
    Session.set('ShowProjectDialog', false);
    Session.set('SelectedTech', null);
  }
};

Template.addUserForm.helpers({

  tech: function tech() {
    return _Techs.findOne({
      _id: Session.get('SelectedTech')
    });
  },
  checking: function checking(day) {
    var dayinfo = _Techs.findOne(Session.get('SelectedTech'))
    if (dayinfo[day]) {
      return {
        checked: ""
      };
    }
    return {};
  }
});

var addUser = function addUser(name, startT, endT, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday) {
  _Techs.insert({
    name: name,
    StartTime: startT,
    EndTime: endT,
    Monday: Monday,
    Tuesday: Tuesday,
    Wednesday: Wednesday,
    Thursday: Thursday,
    Friday: Friday,
    Saturday: Saturday,
    Sunday: Sunday,
    queue: false,
    status: "Working",
    weight: 1,
    OOTO: false,
    Lunch: false
  });
  Meteor.call("updateCron");
};

var updateProject = function updateProject(name, startT, endT, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday) {
  _Techs.update(Session.get('SelectedTech'), {
    $set: {
      name: name,
      StartTime: startT,
      EndTime: endT,
      Monday: Monday,
      Tuesday: Tuesday,
      Wednesday: Wednesday,
      Thursday: Thursday,
      Friday: Friday,
      Saturday: Saturday,
      Sunday: Sunday,
      queue: false,
      status: "Working",
      weight: 1,
      OOTO: false,
      Lunch: false
    }
  });
  Meteor.call("updateCron");
};

Template.schedule.helpers({

  disabled: function disabled() {
    if (_Techs.findOne({
        _id: this._id,
        queue: true
      })) {
      return {
        disabled: ""
      };
    }
    return {};
  },
  checking: function checking(day) {
    if (this[day]) {
      return {
        checked: ""
      };
    }
    return {};
  },
   colorChecked: function colorChecked(day){
     if (this[day]) {
     return {style: "color: blue"};
   };
   return {};
   }
});
Template.schedule.events({
  "click .sendToWork": function addTechToQ(event, template) {
    event.preventDefault();
    _Techs.update({
      _id: this._id
    }, {
      $set: {
        queue: true,
        totaltickets: 0,
        dispatched: false,
        status: "Working"
      }
    });
  },
  "dblclick .schedule": function editTech(event, tmpl) {
    event.preventDefault();
    Session.set('SelectedTech', this._id);
    Session.set('ShowProjectDialog', true);
  },
  "click .removetech": function removeFromQButton(event, tmpl) {
    event.preventDefault();
    if (_Techs.findOne({
        _id: this._id,
        queue: true
      })) {
      _Techs.update({
        _id: this._id
      }, {
        $set: {
          queue: false
        }
      });

    } else if (_Techs.findOne({
        _id: this._id,
        queue: false
      })) {
      event.preventDefault();
      Session.set('SelectedTech', this._id);
      Session.set('ShowDeleteBox', true);

    }
  }
});

Template.techs.helpers({
  techs: function findTechs() {
    return _Techs.find();
  }
});

Template.techs.events({});

Template.registerHelper("prettifyDate", function timer(timestamp) {
  return moment(new Date(timestamp)).fromNow();
});

function deleteTech(techId) {
  _Techs.remove({
    _id: techId._id
  });
}


Template.deleteUser.helpers({

  tech: function tech() {
    return _Techs.findOne({
      _id: Session.get('SelectedTech')
    });
  },
  checking: function checking(day) {
    var dayinfo = _Techs.findOne(Session.get('SelectedTech'))
    if (dayinfo[day]) {
      return {
        checked: ""
      };
    }
    return {};
  }
});

Template.deleteUser.events = {
  "click .closeddelete": function closeForm(event, template) {
    event.preventDefault();
    Session.set('SelectedTech', null);
    Session.set('ShowDeleteBox', false);
  },
  "click .submitdelete": function() {
    event.preventDefault();
    var techinfo = _Techs.findOne(Session.get('SelectedTech'));
    deleteTech(techinfo);
    Session.set('ShowDeleteBox', false);
  }
};
