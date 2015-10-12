Router.configure({
  layoutTemplate: 'layout'
});

Router.map(function () {
  this.route('Login', {
    path: '/'
  });

  this.route('Schedule', {
    path: '/Schedule'
  });
  this.route('Feedback', {
    path: '/Feedback'
  });


  this.route('Status', {
    path: '/Status'
  });

    this.route('techsWorking', {
      path: '/techsWorking'
    });

    this.route('createUser', {
      path: '/createUser'
    });

});
