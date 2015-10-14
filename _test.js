
chai.use(require('chai-as-promised'))
chai.should();

window.expect = chai.expect;

var testsContext = require.context("./test", true, /\.(js$|jsx$)/);

testsContext.keys().forEach(testsContext);
