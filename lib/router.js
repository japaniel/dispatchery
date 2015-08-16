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
  this.route('Input', {
    path: '/Input'
  });


  this.route('Status', {
    path: '/Status'
  });

});
