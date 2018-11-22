pragma solidity ^0.4.0;
pragma experimental ABIEncoderV2;

import "oraclize-api/usingOraclize.sol";


contract CalorieTracker is usingOraclize {

    event CalorieSettingsSet(
        uint goalCalories
    );

    struct CaloriesSetting {
        uint goalCalories;
    }

    struct Meal {
        string foodName;
        uint calorieCount;
    }

    struct Activity {
        string name;
        uint time;
        uint caloriesBurned;
    }

    struct DailyCalorieIntake {
        Meal[] breakfast;
        Meal[] lunch;
        Meal[] dinner;
        Meal[] snacks;
        Activity[] activities;
        uint256 date;
    }

    enum MealType {BREAKFAST, LUNCH, DINNER, SNACK}

    mapping(address => CaloriesSetting) public settings;

    mapping(address => DailyCalorieIntake) public daily;

    mapping(address => mapping(uint256 => DailyCalorieIntake)) public overall;

    function CalorieTracker() {
       // oraclize_query(1*day, "URL", "");
    }

    function addSettings (uint _goalCalories) public {
        CaloriesSetting memory setting = CaloriesSetting({goalCalories: _goalCalories});
        settings[msg.sender] = setting;
        emit CalorieSettingsSet(_goalCalories);
    }

    function addActivity(string _name, uint _time, uint _caloriesBurned) public {
        Activity memory activity = Activity( _name, _time, _caloriesBurned);
        daily[msg.sender].activities.push(activity);
        //todo emit event
    }

    function addMeal(string _name, uint _calories, MealType _type) public {
        //todo check if next day and add it to that
        Meal memory meal = Meal(_name, _calories);
        if(_type == MealType.BREAKFAST){
            daily[msg.sender].breakfast.push(meal);
        } else if(_type == MealType.LUNCH) {
            daily[msg.sender].lunch.push(meal);
        }
        else if(_type == MealType.DINNER) {
            daily[msg.sender].dinner.push(meal);
        }
        else if(_type == MealType.SNACK) {
            daily[msg.sender].snacks.push(meal);
        }
        //todo emit event
    }

    function getTotalDailyActivities()  public view returns (uint) {
        return daily[msg.sender].activities.length;
    }

    function fetchDailyActivity(uint _index)  public view returns (string, uint, uint) {
        Activity[] activities = daily[msg.sender].activities;
        require (_index < activities.length);
        return (activities[_index].name, activities[_index].time, activities[_index].caloriesBurned);
    }

    function getTotalDailyMeals(MealType _type) public view returns (uint) {
        Meal[] meals;
        if(_type == MealType.BREAKFAST){
            meals = daily[msg.sender].breakfast;
        } else if(_type == MealType.LUNCH) {
            meals = daily[msg.sender].lunch;
        }
        else if(_type == MealType.DINNER) {
            meals = daily[msg.sender].dinner;
        }
        else if(_type == MealType.SNACK) {
            meals = daily[msg.sender].snacks;
        }
        return meals.length;
    }

    function fetchDailyMeal(uint _index, MealType _type) public view returns (string, uint) {
        Meal[] meals;
        if(_type == MealType.BREAKFAST){
            meals = daily[msg.sender].breakfast;
        } else if(_type == MealType.LUNCH) {
            meals = daily[msg.sender].lunch;
        }
        else if(_type == MealType.DINNER) {
            meals = daily[msg.sender].dinner;
        }
        else if(_type == MealType.SNACK) {
            meals = daily[msg.sender].snacks;
        }
        else{
            return;
        }
        require (_index < meals.length);

        return (meals[_index].foodName, meals[_index].calorieCount);
    }

}