Meteor.startup(function() {
    Session.set('working_loaded', false);
    Session.set('techs_loaded', false);
    Session.set('chat_loaded', false);
    Session.set('tasks_loaded', false);
    Session.set('statuses_loaded', false);
});
