var CalorieTracker = artifacts.require("./CalorieTracker.sol");
contract('CalorieTracker', function(accounts) {

    it("...should add settings.", async () => {
        const instance = await CalorieTracker.deployed();
        require('truffle-test-utils').init();
        const calorieMax = 5000;
        const result = await instance.addSettings(calorieMax);
        assert.web3Event(result, {
            event: 'CalorieSettingsSet',
            args: {
                goalCalories: calorieMax,
            }
        }, 'The event is emitted');

        const settings = await instance.settings.call(accounts[0]);
        assert.equal(settings, calorieMax, 'max calories should be set');
    });

    it("...should add an activity.", async () => {
        const instance = await CalorieTracker.deployed();
        const name = "Running";
        const time = 0;
        const caloriesBurned = 500;
        await instance.addActivity(name, time, caloriesBurned);
        const dailyActivites = await instance.fetchDailyActivity(0);
        assert.equal(dailyActivites[0], name, 'activity name should be set');
        assert.equal(dailyActivites[1], time, 'time should be set');
        assert.equal(dailyActivites[2], caloriesBurned, 'carlories should be set');
    });

    it("... cannot fetch an activity when no were added", async () => {
        const instance = await CalorieTracker.deployed();
        let exception = null;
        try {
            await instance.fetchDailyActivity(3);
        } catch (e) {
            exception = e
        }

        assert.ok(exception instanceof Error)
    });

    it("...should add a meals.", async () => {
        const instance = await CalorieTracker.deployed();
        let name = "chicken";
        let mealType = 0;
        let calories = 120;
        await instance.addMeal(name, calories, mealType);
        let food = await instance.fetchDailyMeal(0, mealType);
        assert.equal(food[0], name, 'food name should be set');
        assert.equal(food[1], calories, 'calories of food should be set');

        name = "beef";
        mealType = 1;
        calories = 300;
        await instance.addMeal(name, calories, mealType);
        food = await instance.fetchDailyMeal(0, mealType);
        assert.equal(food[0], name, 'food name should be set');
        assert.equal(food[1], calories, 'calories of food should be set');

        name = "cake";
        mealType = 2;
        calories = 700;
        await instance.addMeal(name, calories, mealType);
        food = await instance.fetchDailyMeal(0, mealType);
        assert.equal(food[0], name, 'food name should be set');
        assert.equal(food[1], calories, 'calories of food should be set');
    });

    it("...should add multiple meals for the same meal type.", async () => {
        const instance = await CalorieTracker.deployed();
        let name = "cookies";
        let mealType = 3;
        let calories = 120;
        await instance.addMeal(name, calories, mealType);

        name = "coffee";
        mealType = 3;
        calories = 10;
        await instance.addMeal(name, calories, mealType);
        const total = await instance.getTotalDailyMeals(mealType);
        assert.equal(2, total, "meals should be 2")
    });

    it("... cannot fetch an meal when no were added", async () => {
        const instance = await CalorieTracker.deployed();
        const mealType = 3;
        let exception = null;
        try {
            await instance.fetchDailyMeal(3,mealType );
        } catch (e) {
            exception = e
        }

        assert.ok(exception instanceof Error)
    });
});