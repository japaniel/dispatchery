Meteor.methods({
    updateStatus: function(tech, status) {
        _Statuses.update(tech._id, {"status": status});
    },
    addTask: function (text) {
        // Make sure the user is logged in before inserting a task
        _Tasks.insert({
            text: text,
            createdAt: new Date()
        });
    },
    deleteTask: function (taskId) {
        var task = _Tasks.findOne(taskId);
        if (task.private && task.owner !== Meteor.userId()) {
            // If the task is private, make sure only the owner can delete it
            throw new Meteor.Error("not-authorized");
        }
        _Tasks.remove(taskId);
    },
    setChecked: function (taskId, setChecked) {
        var task = _Tasks.findOne(taskId);
        if (task.private && task.owner !== Meteor.userId()) {
            // If the task is private, make sure only the owner can check it off
            throw new Meteor.Error("not-authorized");
        }

        _Tasks.update(taskId, { $set: { checked: setChecked} });
    },
    setPrivate: function (taskId, setToPrivate) {
        var task = _Tasks.findOne(taskId);

        // Make sure only the task owner can make a task private
        if (task.owner !== Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        _Tasks.update(taskId, { $set: { private: setToPrivate } });
    },
    removeChat : function(id){
        _Chat.remove({ owner : id });
    },
    updateStatus : function(id, status){
        _Queue.update({_id : id}, {$set: {status : status}});
    },
    TechsInQ : function(){
      _Queue.find({});
    },
    updateCron : function(){
        SyncedCron.stop();
        console.log("");
        console.log("");
        console.log("");
        console.log("");
        console.log("");
        console.log("");
        console.log("");
        console.log("");
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
            temp[day] = true;

            _Techs.find(temp).forEach(function (tech){
                var startTimeTemp = 'at ' + tech.StartTime + " every "+ day;
                var endTimeTemp = 'at ' + tech.EndTime + " every "+ day;

                if(tech.startTime != "")
                {
                    console.log(startTimeTemp);
                    SyncedCron.add(
                        {
                            name: tech.name + " " + day,
                            schedule: function(parser) {
                                // parser is a later.parse object
                                //return parser.text('every '+day+' at '+ tech.StartTime);
                                return parser.text(startTimeTemp);
                            },
                            job: function() {
                                _Techs.update({ _id : tech._id },
                                    {
                                        $set : {queue : true}
                                    });
                                console.log(tech.name + " Entered Queue");
                                return "Worked";
                            }
                        }
                    );
                }

                if(tech.endTime != "") {
                    console.log(endTimeTemp);
                    SyncedCron.add(
                        {
                            name: tech.name + ' hour End Time for ' + day,
                            schedule: function (parser) {
                                // parser is a later.parse object
                                //return parser.text('every '+day+' at '+ tech.StartTime);
                                return parser.text(endTimeTemp);
                            },
                            job: function () {
                                _Techs.update({_id: tech._id},
                                    {
                                        $set: {queue: true}
                                    });
                                console.log(tech.name + " Left Queue");
                                return "Worked";
                            }
                        }
                    );
                }
            });
        });
        SyncedCron.start();
    }


});




Meteor.startup(function() {
    SyncedCron.start();
    Meteor.call("updateCron");
});
