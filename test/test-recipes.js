const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');
const expect = chai.expect;

chai.use(chaiHttp);

describe('making get requests', function() {
    it('should return all items when making a get request', function() {
        return chai.request(app)
            .get('/recipes')
            .then(function(res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.be.at.least(1);

                const expectedKeys = ['id', 'name', 'ingredients'];
                res.body.forEach(function(item) {
                    expect(item).to.be.a('object');
                    expect(item).to.include.keys(expectedKeys);
                }) 
            });
    });
});

describe('making post requests', function() {
    it('should post an item', function() {
        const newItem = {name: 'bread', ingredients: ['water', 'dough']};
        return chai.request(app)
            .post('/recipes')
            .send(newItem)
            .then(function(res) {
                expect(res).to.have.status(201);
                expect(res).to.be.json;
                expect(res).to.be.a('object');
                expect(res.body).to.include.keys('id', 'name', 'ingredients');
                expect(res.body.id).to.not.be.equal(null);
                expect(res.body).to.deep.equal(Object.assign(newItem, {id: res.body.id}));
            });
    });
});

describe('making put requests', function() {
    it('should update items', function() {
        const updateData = {name: 'bread', ingredients: ['water', 'dough']};

        return chai.request(app)
            .get('/recipes')
            .then(function(res) {
                updateData.id = res.body[0].id;
                return chai.request(app)
                    .put(`/recipes/${updateData.id}`)
                    .send(updateData)
            })
            .then(function(res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.a('object');
                expect(res.body).to.deep.equal(updateData);
            });
    });
});

describe('making a delete request', function() {
    it('should delete an item from the fake db', function() {
        return chai.request(app)
            .get('/shopping-list')
            .then(function(res) {
                return chai.request(app)
                    .delete(`/recipes/${res.body[0].id}`)
            })
            .then(function(res) {
                expect(res).to.have.status(204);
            });
    });
});