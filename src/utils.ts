import { createTransactionEvent, LogDescription } from "forta-agent";

const createTxEvent = () =>
  createTransactionEvent({
    transaction: {} as any,
    receipt: {} as any,
    block: {} as any,
  });

const createLogEvent = (
  event: { name: string; signature: string },
  result: Array<any> & { [key: string]: any }
): LogDescription => ({
  eventFragment: {} as any,
  name: event.name,
  signature: event.signature,
  topic: {} as any,
  args: result,
  address: "",
});

const zip = (lists: any[][]) =>
  lists[0].map((_, c) => lists.map((row) => row[c]));

export const createEventWithLogs = (
  names: { name: string; signature: string }[],
  logs: Array<any>
) => {
  const txEvent = createTxEvent();

  const eventDescription: LogDescription[] = [];
  zip([names, logs]).forEach((result) =>
    eventDescription.push(createLogEvent(result[0], result[1]))
  );
  txEvent.filterLog = () => eventDescription;

  return txEvent;
};
