pragma solidity ^0.4.24;

import "oraclize-api/usingOraclize.sol";
import "openzeppelin-solidity/contracts/lifecycle/Pausable.sol";

pragma experimental ABIEncoderV2;


contract AssetTracker is usingOraclize, Pausable {


    function AssetTracker() {

    }

    function __callback(bytes32 myid, string result) {
        //if (msg.sender != oraclize_cbAddress()) throw;
    }

    struct AssetEvent {
        bytes32 id;
        string eventType;
        string name;
        bytes32[] data;
        uint256 timestamp;
    }

    struct Asset {
        uint256 created;
        string name;
        bytes32 id;
        bytes32[] assetEventIds;
        //mapping(uint => AssetEvent) assetEvents;
    }

    event AssetCreated (
        bytes32 _id
    );

    event AssetEventCreated (
        bytes32 _id
    );

    mapping(address => Asset[]) private assets;

    mapping(address => mapping(bytes32 => AssetEvent)) private assetEvents;

    function registerAsset (uint256 _date, string _name, bytes32 _id) public {
        Asset asset;
        asset.created = _date;
        asset.id = _id;
        asset.name = _name;
        asset.assetEventIds.push(_id);
        createEvent(msg.sender, _id, "Created", "CREATED", new bytes32[](0), _date);
        assets[msg.sender].push(asset);
        emit AssetCreated(_id);
    }

    function createEvent(address _address, bytes32 _eventId, string _name, string _type, bytes32[] _data, uint256 _date) internal {
        AssetEvent storage assetEvent = assetEvents[_address][_eventId];
        assetEvent.id = _eventId;
        assetEvent.name = _name;
        assetEvent.eventType = _type;
        assetEvent.data = _data;
        assetEvent.timestamp = _date;
    }

    function fetchAsset(bytes32 _id) public view returns (string, bytes32, uint256, bytes32[]) {
        for(uint i = 0; i < assets[msg.sender].length; i++){
            if(equal(assets[msg.sender][i].id, _id)) {
                return (assets[msg.sender][i].name, assets[msg.sender][i].id, assets[msg.sender][i].created, assets[msg.sender][i].assetEventIds);
            }
        }
    }

    function fetchEvent(bytes32 _eventId) public view returns (string, string, bytes32[], uint256) {
        AssetEvent assetEvent = assetEvents[msg.sender][_eventId];
        return(assetEvent.name, assetEvent.eventType, assetEvent.data, assetEvent.timestamp);
    }

    function equal(bytes32 _a, bytes32 _b) internal returns (bool) {
        return keccak256(_a) == keccak256(_b);
    }

    function addEvent(bytes32 _assetId, bytes32 _eventId, string _name, string _type, bytes32[] _data, uint256 _timestamp) public {
        for (uint i = 0; i < assets[msg.sender].length; i++) {
            if (equal(assets[msg.sender][i].id, _assetId)) {
                assets[msg.sender][i].assetEventIds.push(_eventId);
                createEvent(msg.sender, _eventId, _name, _type, _data, _timestamp);
                emit AssetEventCreated(_eventId);
            }
        }
    }
}