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
        timeToStop: function timeToStop(tech) {
            var end = tech.EndTime;
            var h = parseInt(end);
            var m30 = parseInt(end.slice(3)) - 29;
            var m = parseInt(end.slice(3));
            var h1 = parseInt(end) - 1;
            if (m30 < 0) {
              var subm = m30 + 60;

            if (subm.toString().length == 1){
              var subm = ('0' + subm).toString()
            };
            return h1 + ":" + subm;
          }else {
            if (m30.toString().length == 1) {
              var m30 = ('0' + m30).toString()
              return h + ":" + m30;
            };
            return h + ":" + m30;
          }

        };
        console.log(timeToStop);

        timeToWork: function timeToWork() {
          var d = new Date();
          var min30 = d.getMinutes() + 30;
          var addhour = d.getHours() + 1;
          addhour = (d.getHours() + 1).toString().length == 1 ? '0' + addhour : addhour;
          var hours = d.getHours().toString().length == 1 ? '0' + d.getHours() : d.getHours();
          var min = d.getMinutes().toString().length == 1 ? '0' + d.getMinutes() : d.getMinutes();
          min30 = min30.toString().length == 1 ? '0' + min30 : min30;
          if (min30 > 59) {
            var extramin = min30 - 60
            if (extramin.toString().length == 1) {
              extramin = ('0' + extramin).toString();
              return addhour + ':' + extramin;
            }
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
              _Techs.update({
                _id: tech._id
              }, {
                $set: {
                  totaltickets: 1,
                  status: "Working",
                  prequeue: true,
                  preQueueEnterTime: new Date(),
                  WorkQueueStart: timeToWork(),
                  WorkQueueExit: timeToStop(tech)
                }
              });
            }
          });
        };

        if (tech.StartTime >= "16:00" && tech[day]) {

          if (tech.EndTime != "") {
            SyncedCron.add({
              name: tech.name + ' Work End Time for ' + day,
              schedule: function(parser) {
                return parser.recur().on(tech.WorkQueueExit).time().on(nextDayNum(day)).dayOfWeek();
              },
              job: function() {
                _Techs.update({
                  _id: tech._id
                }, {
                  $set: {
                    prequeue: false,
                    queue: false,
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
                return parser.recur().on(tech.WorkQueueExit).time().on(dayNum(day)).dayOfWeek();
              },
              job: function() {
                _Techs.update({
                  _id: tech._id
                }, {
                  $set: {
                    prequeue: false,
                    queue: false,
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
  }
});
