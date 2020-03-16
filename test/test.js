const {assert} = require('chai');
const dashboard = require('./dashboard/main');
const deletes = require('./delete/main');
const download = require('./download/main');
const upload = require('./upload/main');
const view = require('./view/main');

//setup
before(async function () {

});
//test
//Run all tests
describe('Dashboard tests', () => dashboard.default());
describe('Dashboard tests', () => deletes.default());
describe('Dashboard tests', () => download.default());
describe('Dashboard tests', () => upload.default());
describe('Dashboard tests', () => view.default());

describe('testing test function', function () {
    it('should not fail', function () {
        assert.equal(true, true);
    });
});
