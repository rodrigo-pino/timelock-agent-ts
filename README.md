# Timelock Controller Agent

## Description

The agent detects privilege escalation in TimelockController contracts.

## Supported Chains

- Ethereum

## Alerts

- TIMELOCK-PRIV-ESCALATION-1
  - Fired when TimelockController minimum delay is set to zero and a call scheduling occurs after a  call execution
  - Severity is always set to "critical"
  - Type is always set to "exploit".
