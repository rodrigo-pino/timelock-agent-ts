import BigNumber from "bignumber.js";
import {
  Finding,
  HandleTransaction,
  TransactionEvent,
  FindingSeverity,
  FindingType,
} from "forta-agent";
import {
  MIN_DELAY_CHANGED_EVENT_SIG,
  CALL_EXECUTED_EVENT_SIG,
  CALL_SCHEDULED_EVENT_SIG,
} from "./constants";

const handleTransaction: HandleTransaction = async (
  txEvent: TransactionEvent
) => {
  const findings: Finding[] = [];

  const events = txEvent.filterLog([
    MIN_DELAY_CHANGED_EVENT_SIG,
    CALL_EXECUTED_EVENT_SIG,
    CALL_SCHEDULED_EVENT_SIG,
  ]);

  let delayChangedToZero = false;
  const idExecuted = new Set();
  events.some((event) => {
    // Comapere events by signature, instead of only the name to
    // guarantee it'll have the right arguments
    if (event.signature === MIN_DELAY_CHANGED_EVENT_SIG) {
      const newDuration = new BigNumber(event.args.newDuration.toString());
      if (newDuration.eq("0")) {
        delayChangedToZero = true;
      }
    } else if (
      event.signature === CALL_EXECUTED_EVENT_SIG &&
      delayChangedToZero
    ) {
      // All executions after delay sets to Zero are suspcius
      idExecuted.add(event.args.id);
    } else if (
      event.signature === CALL_SCHEDULED_EVENT_SIG &&
      idExecuted.has(event.args.id)
    ) {
      // If there is a match then an execution was done without being scheduled and
      // this contract has suffered a from a strange behavior.
      // The attacker may as well become the owner of the contract.
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
      // Stopl scanning events and signal alert
      return true;
    }
  });

  return findings;
};

export default {
  handleTransaction,
};
