

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
        Accounts.createUser({
            email: email,
            password: password,
        });
        document.getElementById("email").value = "";
        document.getElementById("pass").value = "";
        updateUser(role, email);
      }
});

Template.Login.helpers({

});


updateUser: function updateUser (role, email){
  var user = Meteor.users.findOne(email);
  console.log(user);
  Meteor.users.update({ _id: user._id}, {$set: {'profile.Role': role}})
};
