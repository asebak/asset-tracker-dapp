# Avoiding Common Attacks
These are the actions I have taken to avoid common attacks and any security concerns. 

The scan for the code was done using Smartcheck any security or attacks were verified not to be present: 


## Timestamp Dependence
To avoid timestamp dependency by using "block.timestamp" where miners can affect this value, timestamps come directly from the user.

## Integer Overflow & Underflow
Security analysis indicated underflow or overflows cannot occur.

## Gas Limits
Taken steps to avoid looping with excessive gas consumption from bad actors adding too much data.

## Logic Bugs
Unit tests for various scenarios to make sure logic is working correctly.

