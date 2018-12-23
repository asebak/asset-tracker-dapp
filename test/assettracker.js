var AssetTracker = artifacts.require("./AssetTracker.sol");

contract('AssetTracker', function(accounts) {

    it("...should add an asset.", async () => {
        const instance = await AssetTracker.deployed();
        require('truffle-test-utils').init();
        const name = "IoTGateway";
        const time = 1;
        const id = "0x4d20000000000000000000000000000000000000000000000000000000000000";
        //creating an asset
        const result = await instance.registerAsset(time, name, id);
        //asserting that the event is called
        assert.web3Event(result, {
            event: 'AssetCreated',
            args: {
                id: id, //32 bytes length
            }
        }, 'The event is emitted');
        //fetching the asset to verify it was created.
        const asset = await instance.fetchAsset(id);
        assert.strictEqual(asset[0], name, 'asset name should be set');
    });

    it("...get all my asset ids", async () => {
        const instance = await AssetTracker.deployed();
        const name = "NFCChip";
        const time = 1;
        const id = "0x9d20000000000000000000000000000000000000000000000000000000000000";
        await instance.registerAsset(time, name, id);
        const assetIds = await instance.getAssetIds();
        var containsAssetId = false;
        for(var i = 0; i < assetIds.length; i++){
            if(assetIds[i] === id){
                containsAssetId = true;
                break;
            }
        }
        assert.strictEqual(containsAssetId, true, 'asset id should be returned after creating it');
    });


    it("...adding a new asset should created a initial create event", async () => {
        const instance = await AssetTracker.deployed();
        const name = "RFID Tag 3";
        const time = 1;
        const id = "0x4d73670000000000000000000000000000000000000000000000000000000000";
        await instance.registerAsset(time, name, id, {from: accounts[0]});
        //after registering an asset a default create event is added to the asset
        const assetEvent = await instance.fetchEvent.call(id);
        const intialEvent = "created";
        //verifying that the event was created with this asset.
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
        const time = 1;
        const id = "0x8d73650000000000000000000000000000000000000000000000000000000000";
        const eventId = "0x4d73650000000000000000000000000000000000000000000000000000000000";
        const eventName = "Sensor Reading";
        const eventType = "1"; //location
        const data = ["testing data"];
        await instance.registerAsset(time, name, id, {from: accounts[0]});
        //adding a new event to the asset
        const result = await instance.addEvent(id, eventId,  eventName, eventType, data.map((arg) => web3.toHex(arg)), time, {from: accounts[0]});
        //verifying an event was triggered for adding a new asset event.
        assert.web3Event(result, {
            event: 'AssetEventCreated',
            args: {
                id: eventId, //32 bytes length
            }
        }, 'The event is emitted');

        const assetEvent = await instance.fetchEvent.call(eventId);
        assert.strictEqual(assetEvent[0], eventName, 'event name should be set');
        assert.strictEqual(assetEvent[1].valueOf(), eventType, 'event type should be set');
        assert.strictEqual(data.length, assetEvent[2].length, 'event data should be present');
    });


    it("...can pause a contract as an admin", async () => {
        const instance = await AssetTracker.new();
        //pausing the contract
        await instance.pause();
        var isPaused = await instance.paused();
        assert.strictEqual(isPaused, true, 'contract is paused');

    });

    it("...can destroy a contract as the admin", async () => {
        //when we destroy the contract that code is 0x0 bytes when we get the code.
        const instance = await AssetTracker.new();
        await instance.pause();
        //get original code from the contract
        var result = web3.eth.getCode(instance.address);
        await instance.destroyContract();
        //get code after contract is destroyed.
        var result2 = web3.eth.getCode(instance.address);
        assert.notStrictEqual(result, result2, 'contract was destroyed');
    });

});