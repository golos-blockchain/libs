var golos = require('../lib');

golos.api.getAccountCount(function(err, result) {
	console.log(err, result);
});

golos.api.getAccounts(['dan'], function(err, result) {
	console.log(err, result);
	var reputation = golos.formatter.reputation(result[0].reputation);
	console.log(reputation);
});

golos.api.getState('trending/golos', function(err, result) {
	console.log(err, result);
});

golos.api.getFollowing('ned', 0, 'blog', 10, function(err, result) {
	console.log(err, result);
});

golos.api.getFollowers('dan', 0, 'blog', 10, function(err, result) {
	console.log(err, result);
});

golos.api.streamOperations(function(err, result) {
	console.log(err, result);
});

golos.api.getDiscussionsByActive({
  limit: 10,
  start_author: 'thecastle',
  start_permlink: 'this-week-in-level-design-1-22-2017'
}, function(err, result) {
	console.log(err, result);
});
