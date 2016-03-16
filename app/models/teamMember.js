var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var teamMemberSchema = new Schema({
  user: { type: Schema.ObjectId, ref: 'User' },
  team: { type: Schema.ObjectId, ref: 'Team' },
});

teamMemberSchema.index({ user: 1 });
teamMemberSchema.index({ team: 1 });

teamMemberSchema.statics = {

  findAllByTeam: function(team, done) {
    return TeamMember.find({ team: team._id }, done);
  },

  findAllByUserId: function(userId, done) {
    return TeamMember.find({ user: userId }, done);
  },

  findAllByUser: function(user, done) {
    return TeamMember.findAllByUserId(user._id, done);
  },

  findOrCreate: function(teamId, userId) {
    var data = {
      team: teamId,
      user: userId
    };

    // Currently assuming it's successful
    return TeamMember
      .findOne(data)
      .then(function(teamMember) {
        if (teamMember)
          return teamMember;
        var newTeamMember = new TeamMember(data);
        return newTeamMember.save();
      });
  }

};

var TeamMember = module.exports = mongoose.model('TeamMember', teamMemberSchema);
