# Design Decisions
These are the design patterns that I used in my contract.

## Circuit Breaker
whenNotPaused
I used a library for the circuit breaker design pattern.  All the public read functions won't be disabled when the admin pauses the contract, since there's no harm in allowing people to read the data.  Only the functions that create transactions will be paused as to not interfere with the contract.

## Fail early and fail hard
In all the functions that create transactions I placed require statements for the required parameters to reduce unnecessary code from being executed.

## Mortal
There's a method in the code that can only be called by the deployer to destroy the contract in order to remove it from the blockchain.