var AssetTracker = artifacts.require("./AssetTracker.sol");

contract('AssetTracker', function(accounts) {

    it("...should add an asset.", async () => {
        const instance = await AssetTracker.deployed();
        require('truffle-test-utils').init();
        const name = "IoTGateway";
        const time = 0;
        const id = "0x4d20000000000000000000000000000000000000000000000000000000000000";
        const result = await instance.registerAsset(time, name, id);
        assert.web3Event(result, {
            event: 'AssetCreated',
            args: {
                _id: id, //32 bytes length
            }
        }, 'The event is emitted');

        const asset = await instance.fetchAsset(id);
        //console.log(asset);
        assert.strictEqual(asset[0], name, 'asset name should be set');
    });


    it("...adding a new asset should created a initial create event", async () => {
        const instance = await AssetTracker.deployed();
        const name = "RFID Tag 3";
        const time = 0;
        const id = "0x4d73670000000000000000000000000000000000000000000000000000000000";
        await instance.registerAsset(time, name, id, {from: accounts[0]});
        const assetEvent = await instance.fetchEvent.call(id);
        const intialEvent = "created";
        //console.log(assetEvent);
        assert.strictEqual(assetEvent[0].toLowerCase(), intialEvent, 'event name should be set');
        assert.strictEqual(assetEvent[1].valueOf(), '0', 'event type should be set');
    });

    it("...an invalid id should return no asset.", async () => {
        const instance = await AssetTracker.deployed();
        const asset = await instance.fetchAsset("randomidhere");
        assert.strictEqual(asset[0], "", 'asset name should not be set');
    });


    it("...adding a new event to an asset", async () => {
        const instance = await AssetTracker.deployed();
        const name = "Mobile Device";
        const time = 0;
        const id = "0x8d73650000000000000000000000000000000000000000000000000000000000";
        const eventId = "0x4d73650000000000000000000000000000000000000000000000000000000000";
        const eventName = "Sensor Reading";
        const eventType = "1"; //location
        const data = ["testing data"];
        await instance.registerAsset(time, name, id, {from: accounts[0]});
        const result = await instance.addEvent(id, eventId,  eventName, eventType, data.map((arg) => web3.toHex(arg)), 0, {from: accounts[0]});
        assert.web3Event(result, {
            event: 'AssetEventCreated',
            args: {
                _id: eventId, //32 bytes length
            }
        }, 'The event is emitted');

        const assetEvent = await instance.fetchEvent.call(eventId);
        assert.strictEqual(assetEvent[0], eventName, 'event name should be set');
        assert.strictEqual(assetEvent[1].valueOf(), eventType, 'event type should be set');
        assert.strictEqual(data.length, assetEvent[2].length, 'event data should be present');


    });


});