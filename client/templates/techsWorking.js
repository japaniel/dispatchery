//tech working
Template.techsWorking.helpers({
  techsWorking: function() {
    return _Techs.find({
      queue: true
    }, {
      sort: {
        weight: -1,
        timesincelast: 1
      }
    });
  },
  preWorking: function(tech) {
setInterval(prequeueCheck, 20000);
    return _Techs.find({
      prequeue: true
    }, {
      sort: {
        status: -1,
        weight: -1
      }
    });
  }
});

function Now() {
  return TimeSync.serverTime(null, 20000);
};

Template.pretechWorking.helpers({
  color: function() {
    if (this.status == "Working"){
      var techshift = _Techs.findOne({_id: this._id}).Shift
      return shiftColor(techshift);
    }else if (Session.get('statuses_loaded')) {
      return _Statuses.findOne({
        statusName: this.status
      }).color;
    };
  },
  timeStamp: function(){
    if (this.status == "Meeting") {
      return moment(this.timesincelast).add(1, 'hours').fromNow(Now());
    }else if (this.status == "Training") {
      return moment(this.timesincelast).add(2, 'hours').fromNow(Now());
    }else if (this.status == "Lunch") {
      return moment(this.timesincelast).add(1, 'hours').fromNow(Now());
    }else {
    return moment(this.timesincelast).fromNow(Now());
  }

},
preStartTime: function preStartTime() {
  if (this.queue) {
    _Techs.update({
      _id: tech._id
    }, {
      $set: {
        prequeue: false,
        weight: 0
      }
    });
  };
  return moment(this.preQueueEnterTime).add(30, 'm').fromNow(Now());
}
});

var d = new Date();
var hours = d.getHours().toString().length == 1 ? '0' + d.getHours() : d.getHours();
var min = d.getMinutes().toString().length == 1 ? '0' + d.getMinutes() : d.getMinutes();
var newTime = hours + ':' + min;

Template.techsWorking.rendered = function() {};

Meteor.startup(function() {});

function shiftColor(shift){
  if (shift == "1st") {
    return "#87CEEB"  //SkyBlue
  };
  if (shift == "2nd") {
    return "#4DFFFC"
};
if (shift == "3rd") {
  return "#00CED1" //Olive
}
};

//techWorking
Template.techWorking.helpers({
  color: function() {
    if (this.status == "Working"){
      var techshift = _Techs.findOne({_id: this._id}).Shift
      return shiftColor(techshift);
    }else if (Session.get('statuses_loaded')) {
      return _Statuses.findOne({
        statusName: this.status
      }).color;
    }
  },
  timeStamp: function(){
    if (this.status == "Meeting") {
      return moment(this.timesincelast).add(1, 'hours').fromNow(Now());
    }else if (this.status == "Training") {
      return moment(this.timesincelast).add(2, 'hours').fromNow(Now());
    }else if (this.status == "Lunch") {
      return moment(this.timesincelast).add(1, 'hours').fromNow(Now());
    }else {
    return moment(this.timesincelast).fromNow(Now());
}
},
techManager: function(){
  return this.manager
},
dayCheck: function(day){
  if (this[day]) {
    return "Working"
  }else{
  return "Not"
}
},
queueWeight: function(){
  if (this.status == "Working") {
  var start = parseInt(this.WorkQueueEnter);
  var now = parseInt(TimeSync.serverTime(null, 2000));
  var tickets = parseInt(this.totaltickets) * 5000;
  var math = (Math.round((now - start)));
  math = Math.floor(math / tickets);
  var lowtickets = (Math.round((now - start - 5000)));
  var lowesttickets = (Math.round((now - start)));
  _Techs.update({_id: this._id}, {$set: {weight: math}})
  return math

}if (this.status == "Lunch"){
  lunch
  return this.weight
}else if (this.status == "Meeting") {
  meeting
  return this.weight
}else if (this.status == "Training") {
  training
  return this.weight
}
},
todaysTickets: function(){
  var tickets = parseInt(this.totaltickets);
  return tickets
}
});

function saveLastTicketTime (techinfo){
  return techinfo.timesincelast
};

function getLastTicketTime (techinfo){
  return techinfo.timesincelastTicket
}

Template.techWorking.events({
  'click .plus-one': function plusOne() {
    _Techs.update({
      _id: this._id
    }, {
      $set: {
        timesincelastTicket: saveLastTicketTime(this),
        timesincelast: new Date()
      },
      $inc: {
        totaltickets: 1,
      }
    });
  },
  'click .minus-one': function minusOne() {
    if (this.totaltickets == 0) {
      return {}
    };
    _Techs.update({
      _id: this._id
    }, {
      $set: {
        timesincelast: getLastTicketTime(this)
      },
      $inc: {
        totaltickets: -1,
      }
    });
  }
});

function lunch(slectedstatus, techthis) {
  if (slectedstatus != "Lunch") {
    Meteor.call('removeLunch', techthis);
  } else if (slectedstatus == "Lunch") {
    _Techs.update({_id: techthis._id}, {$set: {timesincelast: new Date(), weight: 2}});
    Meteor.call('updateLunch', techthis);
  }
};

function meeting(slectedstatus, techthis) {
  if (slectedstatus != "Meeting") {
    Meteor.call('removeMeeting', techthis);
  } else if (slectedstatus == "Meeting") {
    _Techs.update({_id: techthis._id}, {$set: {timesincelast: new Date(), weight: 1}});
    Meteor.call('updateMeeting', techthis);
  }
};

function training(slectedstatus, techthis) {
  if (slectedstatus != "Training") {
    Meteor.call('removeTraining', techthis);
  } else if (slectedstatus == "Training") {
    _Techs.update({_id: techthis._id}, {$set: {timesincelast: new Date(), weight: 3}});
    Meteor.call('updateTraining', techthis);
  }
};

function prequeueCheck(tech) {
    _Techs.find({prequeue: true}).forEach(function(tech){
      var d = new Date();
      var hours = d.getHours().toString().length == 1 ? '0' + d.getHours() : d.getHours();
      var min = d.getMinutes().toString().length == 1 ? '0' + d.getMinutes() : d.getMinutes();
      var newTime = hours + ':' + min;
    var today = d.getDay();
    console.log(newTime, "server time", tech.WorkQueueStart, 'tech time');
    if (tech.queue) {
      console.log(tech.queue, tech.name);
      _Techs.update({
        _id: tech._id
      }, {
        $set: {
          prequeue: false,
          queue: true,
          totaltickets: 0,
          WorkQueueEnter: TimeSync.serverTime(),
          weight: 0
        }
      });
    }else if (newTime >= tech.WorkQueueStart) {
      _Techs.update({
        _id: tech._id
      }, {
        $set: {
          prequeue: false,
          queue: true,
          totaltickets: 0,
          WorkQueueEnter: TimeSync.serverTime(),
          weight: 0
        }
      });
    }
})
  };

  Template.options.helpers({
    statuses: function() {
      return _Statuses.find();
    }
  });

  Template.options.events({
    'click li': function(evt, template) {
      // var slectedstatus = _Statuses.findOne({statusName: this.status});
      var techthis = _Techs.findOne({
        _id: this._id
      });
      var status = $(evt.target).text();
      var parent = Template.parentData(0);
      Meteor.call('updateStatus', parent._id, status);
      lunch(status, parent);
      meeting(status, parent);
      training(status, parent);
      // console.log(parent);
      var start = parseInt(parent.WorkQueueEnter);
      var now = parseInt(Now());
      var tickets = parseInt(parent.totaltickets);
      console.log(parent);

    }
  });
