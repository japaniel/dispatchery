Session.setDefault('appName', 'Project Manager');
Session.set('currentMenu', "workingMenu");

Template.menu.appName = function(){
    return Session.get('appName');
}

Template.menu.helpers({
    isCurrentPage: function(pageName){
        //alert(pageName);

        return Router.current().route.getName() == pageName
    },
    logincheck: function logincheck(){
      if (Meteor.userId() == null) {
        return Router.go('Login')
      }else {
      if (Meteor.userId().length > 1 || null) {
      return Router.go('techsWorking')
    }
  }
  }
})

Template.menu.events({
    'click li': function(event, template) {

        Session.set('currentMenu', $(event.currentTarget).attr("class"));

    },

    'click .logout': function(event){
        event.preventDefault();
        Meteor.logout();
        Router.go('Login')
    }
});
