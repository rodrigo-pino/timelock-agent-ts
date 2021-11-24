import { ethers } from "forta-agent";

export const CALL_SCHEDULED_EVENT_SIG =
  "event CallScheduled(bytes32 indexed id, uint256 indexed index, address target, uint256 value, bytes data, bytes32 predecessor, uint256 delay)";
export const CALL_EXECUTED_EVENT_SIG =
  "event CallExecuted(bytes32 indexed id, uint256 indexed index, address target, uint256 value, bytes data)";
export const MIN_DELAY_CHANGED_EVENT_SIG =
  "event MinDelayChange(uint256 oldDuration, uint256 newDuration)";

export const ROLE_ADMIN_CHANGED_EVENT_SIG =
  "event RoleAdminChanged(bytes32 indexed role, bytes32 indexed previousAdminRole, bytes32 indexed newAdminRole)";
export const ROLE_GRANTED_EVENT_SIG =
  "event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender)";
export const HAS_ROLE_FUNC_SIG =
  "function hasRole(bytes32 role, address account) external view returns (bool)";
