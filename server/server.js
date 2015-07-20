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
    updateWorking : function(id) {
        var temp = _Techs.findOne({_id: id});
        _Queue.update({_id: id}, {$set: {name : temp.name}});
    },
    updateStatus : function(id, status){
        _Queue.update({_id : id}, {$set: {status : status}});
    }


});
