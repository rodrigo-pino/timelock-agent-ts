const CALL_SCHEDULED_SIG =
  "event CallScheduled(bytes32 indexed id, uint256 indexed index, address target, uint256 value, bytes data, bytes32 predecessor, uint256 delay)";
const CALL_EXECUTED_SIG =
  "event CallExecuted(bytes32 indexed id, uint256 indexed index, address target, uint256 value, bytes data)";
const MIN_DELAY_CHANGED_SIG =
  "event MinDelayChange(uint256 oldDuration, uint256 newDuration)";

export const EVENTS = {
  scheduledEvent: {
    name: "CallScheduled",
    signature: CALL_SCHEDULED_SIG,
  },
  executedEvent: {
    name: "CallExecuted",
    signature: CALL_EXECUTED_SIG,
  },
  minDelayEvent: {
    name: "MinDelayChange",
    signature: MIN_DELAY_CHANGED_SIG,
  },
};
