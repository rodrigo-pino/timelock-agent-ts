import BigNumber from "bignumber.js";
import {
  FindingType,
  FindingSeverity,
  Finding,
  HandleTransaction,
} from "forta-agent";
import { createEventWithLogs } from "./utils";
import { EVENTS } from "./constants";
import agent from "./agent";

describe("nasty executor", () => {
  let handleTransaction: HandleTransaction;

  beforeAll(() => {
    handleTransaction = agent.handleTransaction;
  });

  const scheduledEvent = EVENTS.scheduledEvent;
  const executedEvent = EVENTS.executedEvent;
  const delayEvent = EVENTS.minDelayEvent;

  it("no events", async () => {
    const txEvent = createEventWithLogs([], []);
    txEvent.filterLog = () => [];
    console.log(txEvent);

    const findings = await handleTransaction(txEvent);

    expect(findings).toStrictEqual([]);
  });

  it("reentrancy attack", async () => {
    const delayChangedArgs: Array<any> & { [key: string]: any } = [];
    delayChangedArgs["newDuration"] = 0;

    const id = "0xabcdef";
    const executedArgs: Array<any> & { [key: string]: any } = [];
    executedArgs["id"] = id;

    const scheduledArgs: Array<any> & { [key: string]: any } = [];
    scheduledArgs["id"] = id;

    const txEvent = createEventWithLogs(
      [delayEvent, executedEvent, scheduledEvent],
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
