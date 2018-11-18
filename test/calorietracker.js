var CalorieTracker = artifacts.require("./CalorieTracker.sol");

contract('CalorieTracker', function(accounts) {

    it("...should add settings.", async () => {
        const instance = await CalorieTracker.deployed();
        const calorieMax = 5000;

        var eventEmitted = false;

        var event = instance.CalorieSettingsSet();

        await event.watch(() => {
            eventEmitted = true
        });

        await instance.addSettings(calorieMax);
        const settings = await instance.settings.call(accounts[0]);
        assert.equal(settings, calorieMax, 'max calories should be set');
        assert.equal(eventEmitted, true, 'adding a setting should trigger CalorieSettingsSet event')
    });

    it("...should add an activity.", async () => {
        const instance = await CalorieTracker.deployed();
        const name = "Running";
        const time = 0;
        const caloriesBurned = 500;
        await instance.addActivity(name, time, caloriesBurned);

  //      const dailyActivites = await instance.daily.call(accounts[0]);
//        console.log(dailyActivites);

    });

});