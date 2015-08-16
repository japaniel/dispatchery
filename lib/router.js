Router.configure({
  layoutTemplate: 'layout'
});

Router.map(function () {
  this.route('techsWorking', {
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

});
