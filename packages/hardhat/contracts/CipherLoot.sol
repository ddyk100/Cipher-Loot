// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import {FHE, ebool, euint16} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/**
 * @title CipherLoot
 * @notice FHE-powered loot box where draws, rarities, and prize selections remain encrypted on-chain.
 * @dev Rarity roll is computed entirely within the FHEVM coprocessor. Players can decrypt their own
 *      results through the official relayer flow using the ciphertext handles emitted by the contract.
 */
contract CipherLoot is ZamaEthereumConfig {
    enum Rarity {
        R,
        SR,
        SSR
    }

    uint16 private constant ROLL_PRECISION = 10_000;
    uint16 private constant SSR_THRESHOLD = 100; // 1%
    uint16 private constant SR_THRESHOLD = 1_000; // 9% -> cumulative 10%
    uint16 private constant PRIZE_VARIANTS = 3;

    struct DrawResult {
        euint16 rarityCode;
        euint16 variantCode;
        uint64 timestamp;
    }

    mapping(address => DrawResult[]) private _playerDraws;
    uint256 public totalDraws;

    event LootDrawn(
        address indexed player,
        uint256 indexed drawId,
        bytes32 rarityHandle,
        bytes32 variantHandle,
        uint64 timestamp
    );

    error InvalidDrawId();

    /**
     * @notice Executes an encrypted loot-box draw for the caller.
     * @return drawId 1-based index of the stored draw for the player.
     */
    function draw() external returns (uint256 drawId) {
        DrawResult storage result = _playerDraws[msg.sender].push();
        drawId = _playerDraws[msg.sender].length;
        totalDraws += 1;
        result.timestamp = uint64(block.timestamp);

        euint16 roll = FHE.rem(FHE.randEuint16(), ROLL_PRECISION);
        ebool isSSR = FHE.lt(roll, SSR_THRESHOLD);
        ebool isSR = FHE.lt(roll, SR_THRESHOLD);

        euint16 rarity = FHE.asEuint16(uint16(Rarity.R));
        rarity = FHE.select(isSR, FHE.asEuint16(uint16(Rarity.SR)), rarity);
        rarity = FHE.select(isSSR, FHE.asEuint16(uint16(Rarity.SSR)), rarity);

        euint16 variant = FHE.rem(roll, PRIZE_VARIANTS);

        result.rarityCode = rarity;
        result.variantCode = variant;

        // Keep values usable in future computations and decryptable by the player.
        FHE.allowThis(result.rarityCode);
        FHE.allowThis(result.variantCode);
        FHE.allow(result.rarityCode, msg.sender);
        FHE.allow(result.variantCode, msg.sender);

        bytes32 rarityHandle = FHE.toBytes32(result.rarityCode);
        bytes32 variantHandle = FHE.toBytes32(result.variantCode);

        emit LootDrawn(msg.sender, drawId, rarityHandle, variantHandle, result.timestamp);
    }

    /**
     * @notice Returns the number of draws stored for a wallet.
     */
    function getDrawCount(address player) external view returns (uint256) {
        return _playerDraws[player].length;
    }

    /**
     * @notice Returns the encrypted rarity & prize handles plus timestamp for a specific draw.
     * @param player Wallet owner of the draw.
     * @param drawId 1-based draw identifier.
     */
    function getEncryptedResult(
        address player,
        uint256 drawId
    ) public view returns (bytes32 rarity, bytes32 variant, uint64 timestamp) {
        DrawResult storage result = _getDraw(player, drawId);
        rarity = FHE.toBytes32(result.rarityCode);
        variant = FHE.toBytes32(result.variantCode);
        timestamp = result.timestamp;
    }

    /**
     * @notice Convenience helper for fetching the most recent draw of a wallet.
     */
    function getLatestEncryptedResult(
        address player
    ) external view returns (bytes32 rarity, bytes32 variant, uint64 timestamp, uint256 drawId) {
        uint256 length = _playerDraws[player].length;
        require(length > 0, "No draws");
        drawId = length;
        (rarity, variant, timestamp) = getEncryptedResult(player, drawId);
    }

    /**
     * @notice Streams encrypted history for pagination-ready UIs.
     * @param player Target wallet.
     * @param offset Zero-based offset in ascending order (0 = first draw).
     * @param limit Maximum number of entries to return.
     */
    function getEncryptedHistory(
        address player,
        uint256 offset,
        uint256 limit
    )
        external
        view
        returns (bytes32[] memory rarities, bytes32[] memory variants, uint64[] memory timestamps)
    {
        uint256 total = _playerDraws[player].length;
        if (offset >= total) {
            return (new bytes32[](0), new bytes32[](0), new uint64[](0));
        }

        uint256 count = limit;
        if (count == 0 || offset + count > total) {
            count = total - offset;
        }

        rarities = new bytes32[](count);
        variants = new bytes32[](count);
        timestamps = new uint64[](count);

        for (uint256 i = 0; i < count; i++) {
            DrawResult storage result = _playerDraws[player][offset + i];
            rarities[i] = FHE.toBytes32(result.rarityCode);
            variants[i] = FHE.toBytes32(result.variantCode);
            timestamps[i] = result.timestamp;
        }
    }

    /**
     * @notice Probability constants exposed for UI + auditing.
     */
    function getProbabilityConfig() external pure returns (uint16 precision, uint16 srCutoff, uint16 ssrCutoff) {
        return (ROLL_PRECISION, SR_THRESHOLD, SSR_THRESHOLD);
    }

    function _getDraw(address player, uint256 drawId) private view returns (DrawResult storage) {
        if (drawId == 0 || drawId > _playerDraws[player].length) {
            revert InvalidDrawId();
        }
        return _playerDraws[player][drawId - 1];
    }
}


