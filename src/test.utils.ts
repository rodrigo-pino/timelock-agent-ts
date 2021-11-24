import { createTransactionEvent, LogDescription } from "forta-agent";

const createTxEvent = () =>
  createTransactionEvent({
    transaction: {} as any,
    receipt: {} as any,
    block: {} as any,
  });

const createLogEvent = (
  signature: string,
  result: Array<any> & { [key: string]: any }
): LogDescription => ({
  eventFragment: {} as any,
  name: {} as any,
  signature: signature,
  topic: {} as any,
  args: result,
  address: "",
});

const zip = (lists: any[][]) =>
  lists[0].map((_, c) => lists.map((row) => row[c]));

export const createEventWithLogs = (signatures: string[], logs: any[]) => {
  const txEvent = createTxEvent();

  const eventDescription: LogDescription[] = [];
  zip([signatures, logs]).forEach((result) =>
    eventDescription.push(createLogEvent(result[0], result[1]))
  );
  txEvent.filterLog = () => eventDescription;

  return txEvent;
};
