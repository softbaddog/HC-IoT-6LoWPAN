var app = require('../../server');
var	request = require('supertest');
var	should = require('should');
var	mongoose = require('mongoose');
var	User = mongoose.model('User');
var	Node = mongoose.model('Node');

var user, node;

describe('Nodes Controller Uint Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			email: 'test@test.com',
			password: 'password'
		});

		user.save(function() {
			node = new Node({
				name: 'A1',
				status: 0,
				groupId: 0,
				parent: 'roots',
				level: 0,
				switch: 0,
				user: user
			});

			node.save(function(err) {
				done();
			});
		});
	});

	describe('Testing the GET methods', function() {
		it('Should be able to get the list of nodes', function(done) {
			request(app).get('/api/nodes/')
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200)
				.end(function(err, res) {
					res.body.should.be.an.Array.and.have.lengthOf(1);
					res.body[0].should.have.property('name', node.name);
					res.body[0].should.have.property('status', node.status);

					done();
				});
		});

		it('Should be able to get the specific node', function(done) {
			request(app).get('/api/nodes/' + node.id)
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200)
				.end(function(err, res) {
					res.body.should.be.an.Object.and.have.property('name', node.name);
					res.body.should.have.property('status', node.status);

					done();
				});
		});
	});

	afterEach(function(done) {
		Node.remove().exec();
		User.remove().exec();
		done();
	});
});