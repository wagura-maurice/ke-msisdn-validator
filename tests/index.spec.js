const { checkOperator, FormatNumbers, isMpesaCompatible, isStkCompatible } = require('../src/index')
const chai = require('chai');
const expect = chai.expect

describe("Test Formatting", function(){
    it("Test Format Phone Numbers", function(){
        expect(FormatNumbers('0111123123')).to.be.equal('254111123123')
    })
    it("Test Format 01xx Phone Numbers", function(){
        expect(FormatNumbers('0118123123')).to.be.equal('254118123123')
    })
    it("Test Format 0140 Phone Numbers", function(){
        expect(FormatNumbers('0140123123')).to.be.equal('254140123123')
    })
    it("Test Format 0182 Phone Numbers", function(){
        expect(FormatNumbers('0182123123')).to.be.equal('254182123123')
    })
    it("Test Format with +254", function(){
        expect(FormatNumbers('+254 711 123 123')).to.be.equal('254711123123')
    })
    it("Test Invalid Format Phone Numbers", function(){
        expect(FormatNumbers('1111123123')).to.be.equal('Invalid Phone Number 1111123123')
    })
})

describe("Test ISP/MVNO", function(){
    it("Test Safaricom", function(){
        expect(checkOperator(FormatNumbers('0711123123'))).to.be.equal('Safaricom')
    })
    it("Test Safaricom 0110", function(){
        expect(checkOperator(FormatNumbers('0110123123'))).to.be.equal('Safaricom')
    })
    it("Test Safaricom 0118", function(){
        expect(checkOperator(FormatNumbers('0118123123'))).to.be.equal('Safaricom')
    })
    it("Test Safaricom 0140", function(){
        expect(checkOperator(FormatNumbers('0140123123'))).to.be.equal('Safaricom')
    })
    it("Test Safaricom 0182", function(){
        expect(checkOperator(FormatNumbers('0182123123'))).to.be.equal('Safaricom')
    })
    it("Test Airtel", function(){
        expect(checkOperator(FormatNumbers('0735123123'))).to.be.equal('Airtel')
    })
    it("Test Airtel 0101", function(){
        expect(checkOperator(FormatNumbers('0101123123'))).to.be.equal('Airtel')
    })
    it("Test Telkom", function(){
        expect(checkOperator(FormatNumbers('0773123123'))).to.be.equal('Telkom')
    })
    it("Test Equitel", function(){
        expect(checkOperator(FormatNumbers('0763123123'))).to.be.equal('Equitel')
    })
    it("Test Faiba4g", function(){
        expect(checkOperator(FormatNumbers('0747123123'))).to.be.equal('Faiba4g')
    })
})

describe("Test M-PESA compatibility", function(){
    it("Test legacy 07xx number", function(){
        expect(isMpesaCompatible('0700123123')).to.be.equal(true)
    })
    it("Test 0110 number", function(){
        expect(isMpesaCompatible('0110123123')).to.be.equal(true)
    })
    it("Test 0118 number", function(){
        expect(isMpesaCompatible('0118123123')).to.be.equal(true)
    })
    it("Test 0140 number", function(){
        expect(isMpesaCompatible('0140123123')).to.be.equal(true)
    })
    it("Test 0182 number", function(){
        expect(isMpesaCompatible('0182123123')).to.be.equal(true)
    })
    it("Test international format", function(){
        expect(isMpesaCompatible('+254118123123')).to.be.equal(true)
    })
    it("Test E.164 format", function(){
        expect(isMpesaCompatible('254118123123')).to.be.equal(true)
    })
    it("Test invalid number", function(){
        expect(isMpesaCompatible('5111123123')).to.be.equal(false)
    })
    it("Test non-07x/01x prefix", function(){
        expect(isMpesaCompatible('0211123123')).to.be.equal(false)
    })
    it("Test isStkCompatible alias", function(){
        expect(isStkCompatible('0118123123')).to.be.equal(true)
    })
})

describe("Test Failing Phone Formatting", function(){
    it("Test Failing on Invalid Format Phone Numbers", function(){
        expect(FormatNumbers('1111123123')).to.be.equal('Invalid Phone Number 1111123123')
    })
})

describe("Failing ISP/MVNO", function(){
    it("Test Invalid Safaricom Phone Numbers", function(){
        expect(FormatNumbers('5111123123')).to.be.equal('Invalid Phone Number 5111123123')
    })
    it("TestInvalid Telkom Phone Numbers", function(){
        expect(FormatNumbers('1773123123')).to.be.equal('Invalid Phone Number 1773123123')
    })
    it("Test Invalid Airtel Phone Numbers", function(){
        expect(FormatNumbers('1733123123')).to.be.equal('Invalid Phone Number 1733123123')
    })
    it("Test Invalid Equitel Phone Numbers", function(){
        expect(FormatNumbers('1763123123')).to.be.equal('Invalid Phone Number 1763123123')
    })
    it("Test Invalid Faiba4g Phone Numbers", function(){
        expect(FormatNumbers('2747111123123')).to.be.equal('Invalid Phone Number 2747111123123')
    })
})
