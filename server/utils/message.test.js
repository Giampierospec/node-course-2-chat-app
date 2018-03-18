var expect = require('expect');
var {generateMessage,generateLocationMessage} = require('./message');
describe('generateMessage',()=>{
        it('should generate correct message object',()=>{
            var res = generateMessage("Giampiero","Hello from the other side");
            expect(res.from).toBe("Giampiero");
            expect(res.text).toBe("Hello from the other side");
            expect(res.createdAt).toBeA('Number');
        });
});
describe('generateMessage',()=>{
    it('should generate correct message object',()=>{
        var res = generateLocationMessage('Giampiero',12,12);
        expect(res.from).toBe('Giampiero');
        expect(res).toInclude({ from: 'Giampiero', url:"https://www.google.com/maps?q=12,12"});
    });
});