var _users = Meteor.users;

Template.Login.events({
    "click .loginbutton":  function(event, template){
        event.preventDefault();
        var email = $('[name=email]').val();
        var password = $('[name=password]').val();
        Meteor.loginWithPassword(email, password);
      },
      "click .createUser": function(event, template){
        var role = document.getElementsByName("role")[0].value;
        var email = $('[name=email]').val();
        var password = $('[name=password]').val();
        // Meteor.call('makeUser', email, password, role)
        document.getElementById("email").value = "";
        document.getElementById("pass").value = "";
      //   Accounts.createUser({
      //     email: email,
      //     password: password,
      //     profile: {
      //       Role: role,
      //       Email: email
      //     }
      // });
      }
});

Template.Login.helpers({
});

Accounts.onLogin(function(){
  Router.go('techsWorking')
})

Tracker.autorun(function () {
    Meteor.subscribe("userList");
    Meteor.subscribe("allUserData");
});


Template.users.helpers({
  users: function users(){
  return Meteor.subscribe('userList') 
}

})
