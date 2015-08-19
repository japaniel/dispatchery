Meteor.methods({
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
    dayNum: function dayNum(day) {
      if (day == "Monday") {
        return 2;
      } else if (day == "Tuesday") {
        return 3;
      } else if (day == "Wednesday") {
        return 4;
      } else if (day == "Thursday") {
        return 5;
      } else if (day == "Friday") {
        return 6;
      } else if (day == "Saturday") {
        return 7;
      } else {
        return 1;
      };
    };
    nextDayNum: function nextDayNum(day) {
      if (day == "Monday") {
        return 3;
      } else if (day == "Tuesday") {
        return 4;
      } else if (day == "Wednesday") {
        return 5;
      } else if (day == "Thursday") {
        return 6;
      } else if (day == "Friday") {
        return 7;
      } else if (day == "Saturday") {
        return 1;
      } else {
        return 2;
      };
    };

    temp.forEach(function(day) {
      var temp = {};

      _Techs.find(temp).forEach(function(tech) {
        if (tech.StartTime != "" && tech[day]) {
          SyncedCron.add({
            name: tech.name + " Prework Start " + day,
            schedule: function(parser) {
              return parser.recur().on(tech.StartTime).time().on(dayNum(day)).dayOfWeek();
            },
            job: function() {
              _Techs.update({
                _id: tech._id
              }, {
                $set: {
                  prequeue: true,
                  totaltickets: 0,
                  status: "Working",
                  timesincelastTicket: new Date()
                }
              });
              addToprequeue(tech, day);
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
                    prequeue: false,
                    queue: false,
                    totaltickets: 0,
                    timesincelast: new Date(),
                    status: "Working"
                  }
                });
                SyncedCron.remove(tech.name + " Prework Start " + day);
              }
            });
          };
        } else if (tech.StartTime < "16:00") {


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
                    prequeue: false,
                    queue: false,
                    totaltickets: 0,
                    dispatched: false,
                    timesincelast: new Date(),
                    status: "Working"
                  }
                });
                SyncedCron.remove(tech.name + " Prework Start " + day);
              }
            });
          };
        };
      });
    });
    SyncedCron.start();

  addToprequeue: function addToprequeue(tech, day) {
    var d = 
    SyncedCron.add({
      name: tech.name + " Work Start " + day,
      schedule: function(parser) {
        return parser.recur().on(tech.StartTime).time().on(dayNum(day)).dayOfWeek();
      },
      job: function() {
        _Techs.update({
          _id: tech._id
        }, {
          $set: {
            queue: true,
            totaltickets: 0,
            status: "Working",
          }
        });
      }
    });
  }
}
});
