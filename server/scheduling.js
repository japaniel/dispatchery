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

        timeToWork: function timeToWork() {
          var d = new Date();
          var min30 = d.getMinutes() + 31;
          var addhour = d.getHours() + 1;
          var hours = d.getHours().toString().length == 1 ? '0' + d.getHours() : d.getHours();
          var min = d.getMinutes().toString().length == 1 ? '0' + d.getMinutes() : d.getMinutes();
          if (min30 > 59) {
            var extramin = min30 - 60
            return addhour + ':' + extramin;
          } else {
            return hours + ':' + min30;
          }
        };

        if (tech.StartTime != "" && tech[day]) {
          SyncedCron.add({
            name: tech.name + " Prework Start " + day,
            schedule: function(parser) {
              return parser.recur().on(tech.StartTime).time().on(dayNum(day)).dayOfWeek();
            },
            job: function() {
              console.log(timeToWork());
              _Techs.update({
                _id: tech._id
              }, {
                $set: {
                  totaltickets: 0,
                  status: "Working",
                  prequeue: true
                }
              });
              _Techs.update({
                _id: tech._id
              }, {
                $set: {
                  preQueueEnterTime: new Date(),
                  timesincelastTicket: timeToWork()
                }
              });
            }
          });
        };


        // timeToStopWork: function timeToStopWork() {
        //   var d = new Date();
        //   var min30 = d.getMinutes() - 29;
        //   var addhour = d.getHours() - 1;
        //   var hours = d.getHours().toString().length == 1 ? '0' + d.getHours() : d.getHours();
        //   var min = d.getMinutes().toString().length == 1 ? '0' + d.getMinutes() : d.getMinutes();
        //   if (min30 < 0) {
        //     var extramin = min30 + 60
        //     return addhour + ':' + extramin;
        //   } else {
        //     return hours + ':' + min30;
        //   }
        // };
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
                    timesincelast: new Date(),
                    status: "Working"
                  }
                });
              }
            });
          };
        };
      });
    });
    SyncedCron.start();
  },
  moveToWork: function(tech) {
    _Techs.find({prequeue: true}).forEach(function(tech){
      var d = new Date();
      var hours = d.getHours().toString().length == 1 ? '0' + d.getHours() : d.getHours();
      var min = d.getMinutes().toString().length == 1 ? '0' + d.getMinutes() : d.getMinutes();
      var newTime = hours + ':' + min;
    var today = d.getDay();
    console.log(newTime, "server time", tech.timesincelastTicket, 'tech time');
    if (newTime > tech.timesincelastTicket) {
      _Techs.update({
        _id: tech._id
      }, {
        $set: {
          prequeue: false,
          queue: true,
          totaltickets: 0
        }
      });
    }else {
    SyncedCron.add({
      name: tech.name + ' Work Start ' + tech.timesincelastTicket,
      schedule: function(parser) {
        return parser.recur().on(tech.timesincelastTicket).time().on(today).dayOfWeek();
      },
      job: function() {
        _Techs.update({
          _id: tech._id
        }, {
          $set: {
            prequeue: false,
            queue: true,
            totaltickets: 0
          }
        });
      }
    });
  }
})
  },
  removePreQueue: function(tech) {
    SyncedCron.remove(tech.name + ' Work Start ' + tech.timesincelastTicket);
    _Techs.update({
      _id: tech._id
    }, {
      $set: {
        prequeue: false,
        queue: true,
        totaltickets: 0
      }
    });
  }
});
