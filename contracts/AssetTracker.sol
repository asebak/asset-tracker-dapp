pragma solidity 0.4.24;

import "openzeppelin-solidity/contracts/lifecycle/Pausable.sol";

pragma experimental ABIEncoderV2;


/**
 * @title AssetTracker
 */
contract AssetTracker is Pausable {

    /**
     * @dev Event types that can be created.
     */
    enum EventTypes {CREATED, LOCATION, QUALITY, TEMPERATURE, HUMIDITY, ACCELEROMETER, CUSTOM}
    /**
     * @dev Mapping of user's assets.
     */
    mapping(address => Asset[]) private assets;
    /**
     * @dev Mapping of a Mapping of Events for an asset id.
     */
    mapping(address => mapping(bytes32 => AssetEvent)) private assetEvents;

    struct AssetEvent {
        bytes32 id;
        uint eventType;
        string name;
        bytes32[] data;
        uint256 timestamp;
    }

    struct Asset {
        uint256 created;
        string name;
        bytes32 id;
        bytes32[] assetEventIds;
    }

    /**
     * @dev Event for when an asset is created.
     */
    event AssetCreated (
        bytes32 id
    );

    /**
     * @dev Event for when an asset's event is created.
     */
    event AssetEventCreated (
        bytes32 id
    );

    /**
     * @dev The AssetTracker constructor sets  `owner` of the contract to the sender
     * account.
     */
    constructor() public {
        owner = msg.sender;
    }

    /**
     * @dev Gets all the senders Asset Ids.
     * @return bytes32[] The list of asset Ids.
     */
    function getAssetIds() public view returns (bytes32[]) {
        bytes32[] memory assetIds = new bytes32[](assets[msg.sender].length);
        uint arrayLength = assets[msg.sender].length;
        for (uint i = 0; i < arrayLength; i++) {
            assetIds[i] = assets[msg.sender][i].id;
        }
        return assetIds;
    }

    /**
     * @dev Registers an asset which can only be called when contract is not paused.
     * @param date Timestamp of when the asset was registered.
     * @param name The name of the asset being registered.
     * @param id The id of the Asset being registered.
     */
    function registerAsset (uint256 date, string name, bytes32 id) whenNotPaused public {
        require(date != 0);
        require(bytes(name).length > 0);
        require(id.length > 0);
        Asset asset;
        asset.created = date;
        asset.id = id;
        asset.name = name;
        delete asset.assetEventIds;
        asset.assetEventIds.push(id);
        createEvent(msg.sender, id, "Created", uint(EventTypes.CREATED), new bytes32[](0), date);
        assets[msg.sender].push(asset);
        emit AssetCreated(id);
    }

    /**
     * @dev Creates an event for an asset.
     * @param creator The address of the creator of the event.
     * @param eventId The id for the event being created.
     * @param name The name of the event.
     * @param eventType The type of the event.
     * @param data The custom data of the event.
     * @param date The timestamp of the event.
     */
    function createEvent(address creator, bytes32 eventId, string name, uint eventType, bytes32[] data, uint256 date) internal {
        require(date != 0);
        require(bytes(name).length > 0);
        require(eventId.length > 0);
        AssetEvent storage assetEvent = assetEvents[creator][eventId];
        assetEvent.id = eventId;
        assetEvent.name = name;
        assetEvent.eventType = eventType;
        assetEvent.data = data;
        assetEvent.timestamp = date;
    }

    /**
     * @dev Gets the data for an asset.
     * @param id The id of the asset.
     * @return string The name of the asset.
     * @return bytes32 The id of the asset.
     * @return uint256 The timestamp of the asset.
     * @return bytes32 The event ids of the asset.
     */
    function fetchAsset(bytes32 id) public view returns (string, bytes32, uint256, bytes32[])  {
        uint arrayLength = assets[msg.sender].length;
        for(uint i = 0; i < arrayLength; i++){
            if(equal(assets[msg.sender][i].id, id)) {
                return (assets[msg.sender][i].name, assets[msg.sender][i].id, assets[msg.sender][i].created, assets[msg.sender][i].assetEventIds);
            }
        }
    }

    /**
     * @dev Gets the data for an event.
     * @param eventId The id of the event.
     * @return string The name of the event.
     * @return bytes32 The type of event.
     * @return uint256 The custom data of the event.
     * @return bytes32 The timestamp of the event.
     */
    function fetchEvent(bytes32 eventId) public view returns (string, uint, bytes32[], uint256) {
        AssetEvent assetEvent = assetEvents[msg.sender][eventId];
        return(assetEvent.name, assetEvent.eventType, assetEvent.data, assetEvent.timestamp);
    }

    /**
     * @dev Determines if two bytes are equal to each other.
     * @param a The first bytes32 variable.
     * @param b The second bytes32 variable.
     * @return bool The two bytes32 are equal
     */
    function equal(bytes32 a, bytes32 b) internal returns (bool) {
        return keccak256(a) == keccak256(b);
    }

    /**
     * @dev Creates an event for an asset and can only be used when the contact is not paused.
     * @param assetId The asset Id
     * @param eventId The id for the event being created.
     * @param name The name of the event.
     * @param eventType The type of the event.
     * @param data The custom data of the event.
     * @param timestamp The timestamp of the event.
     */
    function addEvent(bytes32 assetId, bytes32 eventId, string name, uint eventType, bytes32[] data, uint256 timestamp) whenNotPaused public {
        require(timestamp != 0);
        require(bytes(name).length > 0);
        require(assetId.length > 0);
        require(eventId.length > 0);
        uint arrayLength = assets[msg.sender].length;
        for (uint i = 0; i < arrayLength; i++) {
            if (equal(assets[msg.sender][i].id, assetId)) {
                assets[msg.sender][i].assetEventIds.push(eventId);
                createEvent(msg.sender, eventId, name, eventType, data, timestamp);
                emit AssetEventCreated(eventId);
            }
        }
    }

    /**
     * @dev Destroys the contact invoked by the owner of the contract.
     */
    function destroyContract() onlyOwner public {
        selfdestruct(msg.sender);
    }
}