import BigNumber from "bignumber.js";
import { EVENTS } from "./constants";
import {
  Finding,
  HandleTransaction,
  TransactionEvent,
  FindingSeverity,
  FindingType,
} from "forta-agent";

const handleTransaction: HandleTransaction = async (
  txEvent: TransactionEvent
) => {
  const findings: Finding[] = [];
  const events = txEvent.filterLog([
    EVENTS.executedEvent.signature,
    EVENTS.scheduledEvent.signature,
    EVENTS.minDelayEvent.signature,
  ]);

  let delayChangedToZero = false;
  const idExecuted = new Set();
  events.some((event) => {
    if (event.name === EVENTS.minDelayEvent.name) {
      const newDuration = new BigNumber(event.args.newDuration.toString());
      if (newDuration.eq("0")) {
        delayChangedToZero = true;
      }
    } else if (event.name === EVENTS.executedEvent.name && delayChangedToZero) {
      // All executions after delay sets to Zero are suspcius
      idExecuted.add(event.args.id);
    } else if (
      event.name === EVENTS.scheduledEvent.name &&
      idExecuted.has(event.args.id)
    ) {
      // If there is a match then this contract has suffered a re-entreancy
      // attack, and the attacker may well become the owner of the contract
      findings.push(
        Finding.fromObject({
          name: "Re entreancy Attack",
          description:
            "An executor has made a re entrancy attack and changed minimum delay to 0",
          alertId: "TIMELOCK-REENTRANCY-ALERT",
          severity: FindingSeverity.Critical,
          type: FindingType.Exploit,
        })
      );
      return true;
    }
  });

  return findings;
};

export default {
  handleTransaction,
};
