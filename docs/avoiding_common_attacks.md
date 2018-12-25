# Avoiding Common Attacks
These are the actions I have taken to avoid common attacks and any security concerns. 

The scan for the code was done using Smartcheck any security and vulnerabilities that could potentially happen: 

https://tool.smartdec.net/scan/97fa11d6fdc84628a295df1b2353720d

## Timestamp Dependence
To avoid timestamp dependency by using "block.timestamp" where miners can affect this value, timestamps come directly from the user.

## Integer Overflow & Underflow
Security analysis indicated underflow or overflows cannot occur.

## Logic Bugs
Unit tests for various scenarios to make sure logic is working correctly.

## Fallbacks for any critical bugs 
In the code I implemented the emergency stop/circuit breaker pattern just in case if a potential issue occurs, we can freeze the contract minimizing any issues if they were to occur.

