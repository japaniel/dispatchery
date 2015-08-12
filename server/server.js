Meteor.methods({
  updateStatus: function(tech, status) {
    _Statuses.update(tech._id, {
      "status": status
    });
  },
  addTask: function(text) {
    // Make sure the user is logged in before inserting a task
    _Tasks.insert({
      text: text,
      createdAt: new Date()
    });
  },
  deleteTask: function(taskId) {
    var task = _Tasks.findOne(taskId);
    if (task.private && task.owner !== Meteor.userId()) {
      // If the task is private, make sure only the owner can delete it
      throw new Meteor.Error("not-authorized");
    }
    _Tasks.remove(taskId);
  },
  setChecked: function(taskId, setChecked) {
    var task = _Tasks.findOne(taskId);
    if (task.private && task.owner !== Meteor.userId()) {
      // If the task is private, make sure only the owner can check it off
      throw new Meteor.Error("not-authorized");
    }

    _Tasks.update(taskId, {
      $set: {
        checked: setChecked
      }
    });
  },
  setPrivate: function(taskId, setToPrivate) {
    var task = _Tasks.findOne(taskId);

    // Make sure only the task owner can make a task private
    if (task.owner !== Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    _Tasks.update(taskId, {
      $set: {
        private: setToPrivate
      }
    });
  },
  removeChat: function(id) {
    _Chat.remove({
      owner: id
    });
  },
  updateStatus: function(id, status) {
    _Techs.update({
      _id: id
    }, {
      $set: {
        status: status
      }
    });
  },
  TechsInQ: function() {
    _Techs.find({});
  },
  updateCron: function() {
    SyncedCron.stop();
    var temp = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday"
    ];

    dayNum: function dayNum(day){
      if (day == "Monday") {
        return 2;
      }else if (day == "Tuesday") {
        return 3;
      }else if (day == "Wednesday") {
        return 4;
      }else if (day == "Thursday") {
        return 5;
      }else if (day == "Friday") {
        return 6;
      }else if (day == "Saturday") {
        return 7;
      }else{
        return 1;
      };
    };
    nextDayNum: function nextDayNum(day){
      if (day == "Monday") {
        return 3;
      }else if (day == "Tuesday") {
        return 4;
      }else if (day == "Wednesday") {
        return 5;
      }else if (day == "Thursday") {
        return 6;
      }else if (day == "Friday") {
        return 7;
      }else if (day == "Saturday") {
        return 1;
      }else{
        return 2;
      };
    };

    temp.forEach(function(day) {
      var temp = {};

      _Techs.find(temp).forEach(function(tech) {
        if (tech.StartTime != "" && tech[day]) {
          SyncedCron.add({name: tech.name + " Work Start " + day,
          schedule: function(parser) {return parser.recur().on(tech.StartTime).time().on(dayNum(day)).dayOfWeek();},
            job: function() {_Techs.update({_id: tech._id}, {$set: {
                  queue: true,
                  totaltickets: 0,
                  status: "Working"
                }
              });
              return "Worked";
            }
          });
        };
        if (tech.StartTime >= "16:00" && tech[day]) {

          if (tech.EndTime != "") {
            SyncedCron.add({
              name: tech.name + ' Work End Time for ' + day,
              schedule: function(parser) {
                return parser.recur().on(tech.EndTime).time().on(nextDayNum(day)).dayOfWeek();
              },
              job: function() {
                _Techs.update({
                  _id: tech._id
                }, {
                  $set: {
                    queue: false,
                    totaltickets: 0,
                    timesincelast: new Date(),
                    status: "Working"
                  }
                });
                return "Worked";
              }
            });
        };
      }else if (tech.StartTime < "16:00") {


        if (tech.EndTime != "" && tech[day]) {
          SyncedCron.add({
            name: tech.name + ' Work End Time for ' + day,
            schedule: function(parser) {
              return parser.recur().on(tech.EndTime).time().on(dayNum(day)).dayOfWeek();
            },
            job: function() {
              _Techs.update({
                _id: tech._id
              }, {
                $set: {
                  queue: false,
                  totaltickets: 0,
                  dispatched: false,
                  timesincelast: new Date(),
                  status: "Working"
                }
              });
              return "Worked";
            }
          });
      };
    };
      });
    });
    SyncedCron.start();
},
updateLunch: function(tech) {
    var d = new Date();
    var hourPlusOne = d.getHours() + 1
    if (hourPlusOne == 24) {
      hourPlusOne = 00
    };
    min = d.getMinutes() + 1
    //var min = d.getMinutes().toString().length == 1 ? '0' + d.getMinutes() : d.getMinutes();
    console.log(d.getHours() + ":" + min);
    SyncedCron.add({
      name: tech.name + ' Lunch time ' + d.getHours() + ":" + min,
      schedule: function(parser) {
        return parser.recur().on(d.getHours() + ":" + min).time()
      },
      job: function() {
        _Techs.update({
          _id: tech._id
        }, {
          $set: {
            status: "Working"
          }
        });
        removeLunch(tech);
      }
    });
    _Techs.update({_id: tech._id}, {$set: {LunchClockOut: hourPlusOne + ":" + min}});
  },
  removeLunch: function(tech) {
    console.log(tech.name + ' Lunch time ' + tech.LunchClockOut);
    SyncedCron.remove(tech.name + ' Lunch time ' + tech.LunchClockOut)
  }
});

Meteor.startup(function() {
  SyncedCron.start();
  Meteor.call("updateCron");
});

Meteor.startup(function() {
    SSLProxy({
       port: 443, //or 443 (normal port/requires sudo)
       ssl : {
            key: Assets.getText("serverkey.pem"),
            cert: Assets.getText("servercrt.pem"),

            //Optional CA
           //Assets.getText("ca.pem")
       }
    });
});
