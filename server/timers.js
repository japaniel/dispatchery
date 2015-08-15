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
  _Techs.find().forEach(function(tech){
    console.log(tech.lunch, "lunch check");
  if (tech.lunch) {
    SyncedCron.add({
      name: tech.name + ' Lunch time ' + tech.LunchClockOut,
      schedule: function(parser) {
        return parser.recur().on(tech.LunchClockOut).time()
      },
      job: function() {
        _Techs.update({
          _id: tech._id
        }, {
          $set: {
            status: "Working",
            lunch: false
          }
        });
        removeLunch(tech);
      }
    });
  } else {
    var d = new Date();
    var hourPlusOne = d.getHours() + 1
    if (hourPlusOne == 24) {
      hourPlusOne = 00
    };
    var min = d.getMinutes().toString().length == 1 ? '0' + d.getMinutes() : d.getMinutes();
    console.log(hourPlusOne + ":" + min);
    SyncedCron.add({
      name: tech.name + ' Lunch time ' + hourPlusOne + ":" + min,
      schedule: function(parser) {
        return parser.recur().on(hourPlusOne + ":" + min).time()
      },
      job: function() {
        _Techs.update({
          _id: tech._id
        }, {
          $set: {
            status: "Working",
            lunch: false
          }
        });
        removeLunch(tech);
      }
    });
    _Techs.update({_id: tech._id}, {$set: {LunchClockOut: hourPlusOne + ":" + min, lunch: true}});
    }
  })
},
  removeLunch: function(tech) {
    SyncedCron.remove(tech.name + ' Lunch time ' + tech.LunchClockOut);
    _Techs.update({_id: tech._id}, {$set: {LunchClockOut: "", lunch: false}});
  },
  updateMeeting: function(tech) {
    _Techs.find().forEach(function(tech){
      console.log(tech.meeting, "meeting check");
    if (tech.meeting) {
      SyncedCron.add({
        name: tech.name + ' Meeting time ' + tech.MeetingClockOut,
        schedule: function(parser) {
          return parser.recur().on(tech.MeetingClockOut).time()
        },
        job: function() {
          _Techs.update({
            _id: tech._id
          }, {
            $set: {
              status: "Working",
              meeting: false
            }
          });
          removeMeeting(tech);
        }
      });
    } else {
      var d = new Date();
      var hourPlusOne = d.getHours() + 1
      if (hourPlusOne == 24) {
        hourPlusOne = 00
      };
      var min = d.getMinutes().toString().length == 1 ? '0' + d.getMinutes() : d.getMinutes();
      console.log(hourPlusOne + ":" + min);
      SyncedCron.add({
        name: tech.name + ' Meeting time ' + hourPlusOne + ":" + min,
        schedule: function(parser) {
          return parser.recur().on(hourPlusOne + ":" + min).time()
        },
        job: function() {
          _Techs.update({
            _id: tech._id
          }, {
            $set: {
              status: "Working",
              meeting: false
            }
          });
          removeMeeting(tech);
        }
      });
      _Techs.update({_id: tech._id}, {$set: {MeetingClockOut: hourPlusOne + ":" + min, meeting: true}});
      }
    })
  },
    removeMeeting: function(tech) {
      SyncedCron.remove(tech.name + ' Meeting time ' + tech.MeetingClockOut);
      _Techs.update({_id: tech._id}, {$set: {MeetingClockOut: "", meeting: false}});
    },
    updateTraining: function(tech) {
      _Techs.find().forEach(function(tech){
        console.log(tech.training, "training check");
      if (tech.training) {
        SyncedCron.add({
          name: tech.name + ' Training time ' + tech.TrainingClockOut,
          schedule: function(parser) {
            return parser.recur().on(tech.TrainingClockOut).time()
          },
          job: function() {
            _Techs.update({
              _id: tech._id
            }, {
              $set: {
                status: "Working",
                training: false
              }
            });
            removeTraining(tech);
          }
        });
      } else {
        var d = new Date();
        var hourPlusOne = d.getHours() + 2
        if (hourPlusOne == 24) {
          hourPlusOne = 00
        };
        var min = d.getMinutes().toString().length == 1 ? '0' + d.getMinutes() : d.getMinutes();
        console.log(hourPlusOne + ":" + min);
        SyncedCron.add({
          name: tech.name + ' Training time ' + hourPlusOne + ":" + min,
          schedule: function(parser) {
            return parser.recur().on(hourPlusOne + ":" + min).time()
          },
          job: function() {
            _Techs.update({
              _id: tech._id
            }, {
              $set: {
                status: "Working",
                training: false
              }
            });
            removeTraining(tech);
          }
        });
        _Techs.update({_id: tech._id}, {$set: {TrainingClockOut: hourPlusOne + ":" + min, training: true}});
        }
      })
    },
      removeTraining: function(tech) {
        SyncedCron.remove(tech.name + ' Training time ' + tech.TrainingClockOut);
        _Techs.update({_id: tech._id}, {$set: {TrainingClockOut: "", training: false}});
      }

});

Meteor.startup(function() {
  SyncedCron.start();
  Meteor.call("updateCron");
  Meteor.call("updateLunch");
//  Meteor.call("updateMeeting");
//  Meteor.call("updateTraining");
});
