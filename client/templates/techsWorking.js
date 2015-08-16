//tech working
Template.techsWorking.helpers({
  techsWorking: function() {
    return _Techs.find({
      queue: true
    }, {
      sort: {
        status: -1,
        timesincelast: 1
      }
    });
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
    return "#FFFACD" //LemonChiffon
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
      console.log(shiftColor(techshift), techshift);
    }else if (Session.get('statuses_loaded')) {
      return _Statuses.findOne({
        statusName: this.status
      }).color;
    }
  },
  timeStamp: function(){
    return moment(this.timesincelast).fromNow();
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
        weight: 1
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
        weight: -1
      }
    });
  }
});

function lunch(slectedstatus, techthis) {
  if (slectedstatus != "Lunch") {
    Meteor.call('removeLunch', techthis);
  } else if (slectedstatus == "Lunch") {
    _Techs.update({_id: techthis._id}, {$set: {timesincelast: new Date()}});
    Meteor.call('updateLunch', techthis);
  }
};

function meeting(slectedstatus, techthis) {
  if (slectedstatus != "Meeting") {
    Meteor.call('removeMeeting', techthis);
  } else if (slectedstatus == "Meeting") {
    _Techs.update({_id: techthis._id}, {$set: {timesincelast: new Date()}});
    Meteor.call('updateMeeting', techthis);
  }
};

function training(slectedstatus, techthis) {
  if (slectedstatus != "Training") {
    Meteor.call('removeTraining', techthis);
  } else if (slectedstatus == "Training") {
    _Techs.update({_id: techthis._id}, {$set: {timesincelast: new Date()}});
    Meteor.call('updateTraining', techthis);
  }
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
      console.log(parent);
    }
  });
