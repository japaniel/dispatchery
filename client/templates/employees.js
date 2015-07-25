Session.setDefault('ShowProjectDialog', false);
Session.setDefault('SelectedTech', null);
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

var newDay = n;

Template.employees.helpers({

  showProjectDialog: function showProjectDialog() {
    return Session.get('ShowProjectDialog');
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

    Session.set('ShowProjectDialog', false);
    Session.set('SelectedTech', null);
  }
};

Template.addUserForm.helpers({

  tech: function tech() {
    return _Techs.findOne({
      _id: Session.get('SelectedTech')
    });
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
    Sunday: Sunday
  });
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
      Sunday: Sunday
    }
  });
  Meteor.call('updateWorking', Session.get('SelectedTech'));
};

Template.schedule.helpers({

  disabled: function disabled() {
    if (_Queue.findOne({
        _id: this._id
      })) {
      return {
        disabled: ""
      };
    }
    return {};
  },
  checking: function checking(day) {
    if (day == "Monday") {
      if (this.Monday) {
        return {
          checked: ""
        };
      }
    } else if (day == "Tuesday") {
      if (this.Tuesday) {
        return {
          checked: ""
        };
      }
    } else if (day == "Tuesday") {
      if (this.Tuesday) {
        return {
          checked: ""
        };
      }
    } else if (day == "Wednesday") {
      if (this.Wednesday) {
        return {
          checked: ""
        };
      }
    } else if (day == "Thursday") {
      if (this.Thursday) {
        return {
          checked: ""
        };
      }
    } else if (day == "Friday") {
      if (this.Friday) {
        return {
          checked: ""
        };
      }
    } else if (day == "Saturday") {
      if (this.Saturday) {
        return {
          checked: ""
        };
      }
    } else if (day == "Sunday") {
      if (this.Sunday) {
        return {
          checked: ""
        };
      }
    }
    return {};
  },
  qCheck: function qCheck() {
    var techId = _Techs.findOne(this._id);
    timecheck(techId);
  },
  checkAll: function checkAll() {
    _Techs.find({},{_id: ""}).forEach(timecheck);
    console.log("fun");
  }
});
// Meteor.startup(checkAll);



function timecheck(techId) {
  if (techId.StartTime < newTime && techId.EndTime > newTime) {
    if (_Queue.findOne({
        _id: techId._id
      })) {
      return "";
    } else {
      _Queue.insert({
        name: techId.name,
        _id: techId._id,
        totaltickets: 0,
        dispatched: false,
        timesincelast: new Date(),
        status: "working"
      });
    }
  } else {
    _Queue.remove({
      _id: techId._id
    })
  };
};


Template.schedule.events({
  "click .sendToWork": function addTechToQ(event, template) {
    event.preventDefault();
    _Queue.insert({
      name: this.name,
      _id: this._id,
      totaltickets: 0,
      dispatched: false,
      timesincelast: new Date(),
      status: "working"
    })
  },
  "dblclick .schedule": function editTech(event, tmpl) {
    event.preventDefault();
    Session.set('SelectedTech', this._id);
    Session.set('ShowProjectDialog', true);
  },
  "click .removetech": function removeFromQButton(event, tmpl) {
    event.preventDefault();
    if (_Queue.findOne({
        _id: this._id
      })) {
      _Queue.remove({
        _id: this._id
      })

    } else {
      _Techs.remove({
        _id: this._id
      });
    }
  }
});

Template.techs.helpers({
  techs: function findTechs() {
    return _Techs.find();
  },

});

Template.techs.events({

});

Template.registerHelper("prettifyDate", function timer(timestamp) {
  return moment(new Date(timestamp)).fromNow();
});
