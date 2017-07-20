'use strict';

var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;


describe("Container", function() {
    const Container = require('../lib/Container');
    let container = new Container();
    let rawdata = container.__data__;

    it("should be instance of Container", function() {
        expect(container).to.be.instanceof(Container);
    })

    describe("#set", function() {
        it("should set varible to state object", function() {
            container.set('var1', 'Hello');
            expect(rawdata.var1).to.be.eq('Hello');
        })

        it("should emit eventSet", function() {
            let spy = sinon.spy();
            container.on(container.eventSet, spy);
            container.set('var3', 'something');
            expect(spy.called).to.be.true;
        })

        it("should throw error if setting data using property setter", function() {
            expect(() => { container.var0 = 'something'}).to.throw();
        })
    })

    describe("#get", function() {
        it("should be able to read variables from state object", function() {
            // continue from the previous test
            expect(container.get('var1')).to.be.eq('Hello');
        })

        it("should emit eventGet", function() {
            let spy = sinon.spy();
            container.on(container.eventGet, spy);
            container.get('var3');
            expect(spy.called).to.be.true;
        })

        it("should return default value when not found", function() {
            expect(container.get('non-existance', 'foo')).to.be.equal('foo');
        })

        it("can access state variable directy using property access", function() {
            container.set('var4', 'value 4');
            expect(container.var4).to.be.equal('value 4');
        })
    })

    describe("#has", function() {
        it("should check if variable exists or not", function() {
            container.set('var5', 'value 5');
            expect(container.has('var5')).to.be.true;
            expect(container.has('non-existance')).to.be.false;
        })
    })
    
})