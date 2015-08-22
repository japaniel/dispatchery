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

Template.Schedule.helpers({

  showProjectDialog: function showProjectDialog() {
    return Session.get('ShowProjectDialog');
  },
  ShowDeleteBox: function ShowDeleteBox() {
    return Session.get('ShowDeleteBox');

  }
});

Template.Schedule.events = {
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
    var shift = template.find('.slect-dropdown').value;
    if (Session.get('SelectedTech')) {
      updateProject(name, startT, endT, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday, shift);
    } else {
      addUser(name, startT, endT, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday, shift);
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
},
firstCheck: function shiftCheck(shift) {
  var tech = _Techs.findOne(Session.get('SelectedTech'))
if (tech.Shift == '1st') {
  return {
    selected: ""
  }
}
},
secondCheck: function secondCheck(shift){
  var tech = _Techs.findOne(Session.get('SelectedTech'))
if (tech.Shift == '2nd') {
  return {
    selected: ""
  };
};
},
thirdCheck: function thirdCheck(shift){
  var tech = _Techs.findOne(Session.get('SelectedTech'))
if (tech.Shift == '3rd') {
  return {
    selected: ""
  };
};
}
});


var addUser = function addUser(name, startT, endT, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday, shift) {
  var startT30 = startT + 30;
  _Techs.insert({
    name: name,
    StartTime: startT,
    WorkQueueStart: null,
    EndTime: endT,
    WorkQueueExit: null,
    Monday: Monday,
    Tuesday: Tuesday,
    Wednesday: Wednesday,
    Thursday: Thursday,
    Friday: Friday,
    Saturday: Saturday,
    Sunday: Sunday,
    queue: false,
    prequeue: false,
    status: "Working",
    weight: 1,
    Shift: shift,
    lunch: false,
    meeting: false,
    training: false,
    timesincelastTicket: 0,
    preQueueEnterTime: 0
  });
  Meteor.call("updateCron");
};

var updateProject = function updateProject(name, startT, endT, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday, shift) {
  var startT30 = startT + 30;
  _Techs.update(Session.get('SelectedTech'), {
    $set: {
      name: name,
      StartTime: startT,
      WorkQueueStart: null,
      EndTime: endT,
      WorkQueueExit: null,
      Monday: Monday,
      Tuesday: Tuesday,
      Wednesday: Wednesday,
      Thursday: Thursday,
      Friday: Friday,
      Saturday: Saturday,
      Sunday: Sunday,
      queue: false,
      prequeue: false,
      status: "Working",
      weight: 1,
      Shift: shift,
      lunch: false,
      meeting: false,
      training: false,
      timesincelastTicket: 0
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
      return {disabled: ""};
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
     return {style: "color:#0daecd;font-size:120%;font-weight:bold"};
   };
   return {};
 },
 queueButtonColorCheck: function queueButtonColorCheck(){
   if (this.queue) {
     return {style: "background-color:#80FF95"};
   }else {
     return {style: "background-color:#FF8280"};
   }
 },
 queueCheck: function queueCheck(){
   if (this.queue) {
     return "Getting Pain ;)";
   }else {
     return "Send To Work";
   }
 },
 shiftColor: function shiftColor(shift){
   if (shift == "1st") {
     return "#EFEFEF"  //SkyBlue
   };
   if (shift == "2nd") {
     return "#DFDFDF"
 };
 if (shift == "3rd") {
   return "#CDCDCD" //Olive
 }
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
    return _Techs.find({}, {
      sort: {
        Shift: 1,
        name: 1
      }
    });
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
