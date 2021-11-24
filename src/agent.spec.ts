import BigNumber from "bignumber.js";
import {
  FindingType,
  FindingSeverity,
  Finding,
  HandleTransaction,
} from "forta-agent";
import { createEventWithLogs } from "./test.utils";
import agent from "./agent";
import {
  MIN_DELAY_CHANGED_EVENT_SIG,
  CALL_EXECUTED_EVENT_SIG,
  CALL_SCHEDULED_EVENT_SIG,
} from "./constants";

describe("Privilege Escalation", () => {
  let handleTransaction: HandleTransaction;

  beforeAll(() => {
    handleTransaction = agent.handleTransaction;
  });

  it("Scheduling and Execution", async () => {
    const executedArgs1: Array<any> & { [key: string]: any } = [];
    executedArgs1["id"] = "0xabcde";

    const executedArgs2: Array<any> & { [key: string]: any } = [];
    executedArgs2["id"] = "0x1234";

    const scheduledArgs: Array<any> & { [key: string]: any } = [];
    scheduledArgs["id"] = "0x5467";

    const executedArgs3: Array<any> & { [key: string]: any } = [];
    executedArgs2["id"] = "0x5467";

    const txEvent = createEventWithLogs(
      [
        CALL_EXECUTED_EVENT_SIG,
        CALL_EXECUTED_EVENT_SIG,
        CALL_SCHEDULED_EVENT_SIG,
        CALL_EXECUTED_EVENT_SIG,
      ],
      [executedArgs1, executedArgs2, scheduledArgs, executedArgs3]
    );

    const findings = await handleTransaction(txEvent);

    expect(findings).toStrictEqual([]);
  });

  it("Execution before scheduling", async () => {
    const delayChangedArgs: Array<any> & { [key: string]: any } = [];
    delayChangedArgs["newDuration"] = 0;

    const id = "0xabcdef";
    const executedArgs: Array<any> & { [key: string]: any } = [];
    executedArgs["id"] = id;

    const scheduledArgs: Array<any> & { [key: string]: any } = [];
    scheduledArgs["id"] = id;

    const txEvent = createEventWithLogs(
      [
        MIN_DELAY_CHANGED_EVENT_SIG,
        CALL_EXECUTED_EVENT_SIG,
        CALL_SCHEDULED_EVENT_SIG,
      ],
      [delayChangedArgs, executedArgs, scheduledArgs]
    );

    const findings = await handleTransaction(txEvent);

    expect(findings).toStrictEqual([
      Finding.fromObject({
        name: "Re entreancy Attack",
        description:
          "An executor has made a re entrancy attack and changed minimum delay to 0",
        alertId: "TIMELOCK-REENTRANCY-ALERT",
        severity: FindingSeverity.Critical,
        type: FindingType.Exploit,
      }),
    ]);
  });
});
