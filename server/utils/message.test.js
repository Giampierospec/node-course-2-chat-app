var expect = require('expect');
var {generateMessage} = require('./message');
describe('generateMessage',()=>{
        it('should generate correct message object',()=>{
            var res = generateMessage("Giampiero","Hello from the other side");
            expect(res.from).toBe("Giampiero");
            expect(res.text).toBe("Hello from the other side");
            expect(res.createdAt).toBeA('number');
        });
});