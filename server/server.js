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

    temp.forEach(function(day) {
      var temp = {};
      // temp[day] = false;

      _Techs.find(temp).forEach(function(tech) {
        // console.log(tech.StartTime, thirdShiftEndDay);
        if (tech.StartTime != "" && tech[day]) {
          var startTimeTemp = "at " + tech.StartTime + " on " + day;
          SyncedCron.add({name: tech.name + " Work Start " + day,
          schedule: function(parser) {return parser.text(startTimeTemp);},
            job: function() {_Techs.update({_id: tech._id}, {$set: {
                  queue: true,
                  totaltickets: 0,
                  dispatched: false,
                  status: "Working"
                }
              });
              // console.log(tech.name + " Entered Queue");
              return "Worked";
            }
          });
        };
        if (tech.StartTime >= "16:00" && tech[day]) {
          if (day == "Monday") {
            day = "Tuesday"
          }else if (day == "Tuesday") {
            day = "Wednesday"
          }else if (day == "Wednesday") {
            day = "Thursday"
          }else if (day == "Thursday") {
            day = "Friday"
          }else if (day == "Friday") {
            day = "Saturday"
          }else if (day == "Saturday") {
            day = "Sunday"
          }else{
            day = "Monday"
          };
          console.log(tech[day], day);

          if (tech.EndTime != "") {
            var endTimeTemp = "at " + tech.EndTime + " on " + day;
            SyncedCron.add({
              name: tech.name + ' Work End Time for ' + day,
              schedule: function(parser) {
                return parser.text(endTimeTemp);
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
                // console.log(tech.name + " Left Queue");
                return "Worked";
              }
            });
        };
      }else if (tech.StartTime <= "16:00") {

        if (tech.EndTime != "" && tech[day]) {
          var endTimeTemp = "at " + tech.EndTime + " on " + day;
          SyncedCron.add({
            name: tech.name + ' Work End Time for ' + day,
            schedule: function(parser) {
              return parser.text(endTimeTemp);
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
              // console.log(tech.name + " Left Queue");
              return "Worked";
            }
          });
      };
    };
      });
    });
    SyncedCron.start();
  },
  updateLunch: function(tech,hour){
    console.log(hour + 1);

    SyncedCron.add({
      name: tech.name + ' Time For Lunch ' + hour,
      schedule: function(parser) {
        return parser.recur().on(hour).time();
      },
      job: function() {
        _Techs.update({
          _id: tech._id
        }, {
          $set: {
            status: "Working"
          }
        });
      }
    });
  }
});

Meteor.startup(function() {
  SyncedCron.start();
  Meteor.call("updateCron");
});
