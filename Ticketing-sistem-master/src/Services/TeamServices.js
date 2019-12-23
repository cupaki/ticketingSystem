(function(angular) {
    var app = angular.module('app');

    app.factory('TeamData', function($resource, $log, $q, $state) {
        return {
            getTeams: function(callback) {
                var Team = $resource('/api/team');
                var teams = Team.query();
                teams.$promise.then(function(result) {
                  callback(result);
                });
                return teams;
            },
            getTeamById: function(teamdId, callback) {
                var Team = $resource('/api/team/:id', {
                    id: '@id'
                });
                var team = Team.get({
                    id: teamdId
                }, function(result) {
                  callback(result);
                });
                return team;
            },
            insertTeam: function(team, callback) {
                var Team = $resource('/api/team');
                var newTeam = new Team(team);

                var nest = newTeam.$save(callback());



            },
            getTeamResource: function() {
                return $resource('/api/team');
            },
            getUsersOnTeam: function(teamdId) {
                var Team = $resource('/api/team/:id', {
                    id: '@id'
                });
                var team = Team.get({
                    id: teamdId
                });
                return team.users; //ovde kad se pristupa team.users vraca undefined, kad samo return team odradimo, onda je sve ok, a naknado pristupimo userima
            },
            removeTeam: function(team, callback) {
                var Team = $resource('/api/team/:id', {
                    id: '@id'
                });
                console.log(team._id + ' -id tima');
                Team.delete({
                    id: team._id
                }, function(data) {
                    callback();
                });
            },
            removeTeamFromProject: function(idTeam, idProject) {

                var Project = $resource('/api/project/:id1/team/:id2', {
                    id1: '@id',
                    id2: idTeam
                });
                Project.delete({
                    id1: idProject
                });
                console.log('Obrisan tim - services');
            },
            getTeamsNotOnProject: function(projectId, callback) {
                var Team = $resource('/api/team/noOnproject/:id', {
                    id: projectId
                });
                var teams = Team.query();
                teams.$promise.then(function(result) {
                    callback(result);
                });
            },
            addTeamsOnProject: function(teamNames, projectId) {
                var Project = $resource('/api/project/:id/:teams', {
                    id: '@id',
                    teams: teamNames
                });
                Project.save({
                    id: projectId
                });

            },
            removeUserFromTeam: function(teamForUpdate, userId) {
                //iz usera izbacujemo Project-e, jer kad se user izbrise iz teama, onda se brise i projekat na kom je radio u tom timu

                console.log(teamForUpdate.name + ' team services');
                console.log(userId + ' user services');
                var Team = $resource('/api/team/:id/:idUser', {
                    id: '@_id',
                    idUser: userId
                }, {
                    update: {
                        method: 'PUT'
                    }
                });

                var team = new Team(teamForUpdate);
                team.$update();

            },

            removeUserFromTeam2: function(teamForUpdate, userId) {
                //izbacujemo usera iz teama
                var Team2 = $resource('/api/team/:id2/user/:idUser2', {
                    id2: '@_id',
                    idUser2: userId
                }, {
                    update: {
                        method: 'PUT'
                    }
                });

                var team2 = new Team2(teamForUpdate);
                team2.$update();

            },

            addUsersInTeam: function(userNames, teamId, callback) {
                var Team = $resource('/api/team/:id/:users', {
                    id: '@id',
                    users: userNames
                });
                Team.save({
                    id: teamId
                }, callback);
            },
            addProjectsInTeam: function(projectNames, teamId) {
                var Team = $resource('/api/team/:id/project/:projects', {
                    id: '@id',
                    projects: projectNames
                });
                Team.save({
                    id: teamId
                });

            }
        };
    });
})(angular);
