import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateTransaction } from "../hooks/useTransaction";
import { InstrumentList } from "@/features/instrument/components/InstrumentList";
import { useInstrumentStore } from "@/features/instrument/store/instrument.store";

export function TransactionDialog({ portfolioId }: { portfolioId: string }) {
  const createTxn = useCreateTransaction();
  const { selectedInstrumentId } = useInstrumentStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    instrumentId: "",
    txnType: "buy",
    quantity: "",
    unitPrice: "",
    fees: "0",
    tradeDate: "",
  });

  // ✅ close dialog automatically on success
  useEffect(() => {
    if (createTxn.isSuccess) {
      setOpen(false);
      // optional: reset form for next time
      setForm({
        instrumentId: "",
        txnType: "buy",
        quantity: "",
        unitPrice: "",
        fees: "0",
        tradeDate: "",
      });
    }
  }, [createTxn.isSuccess]);

  const submit = () => {
    createTxn.mutate({
      portfolioId,
      ...form,

      instrumentId: selectedInstrumentId || "",
      txnType: form.txnType as "buy" | "sell",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Transaction</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Transaction</DialogTitle>
        </DialogHeader>

        <div className="grid gap-3">
          {/* <Input
            placeholder="Instrument ID"
            value={form.instrumentId}
            onChange={(e) => setForm({ ...form, instrumentId: e.target.value })}
          /> */}

          <InstrumentList />

          <Select
            value={form.txnType}
            onValueChange={(v) => setForm({ ...form, txnType: v })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a transaction" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Transaction Type</SelectLabel>
                <SelectItem value="buy">Buy</SelectItem>
                <SelectItem value="sell">Sell</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Input
            placeholder="Quantity"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          />
          <Input
            placeholder="Unit Price"
            value={form.unitPrice}
            onChange={(e) => setForm({ ...form, unitPrice: e.target.value })}
          />
          <Input
            placeholder="Fees"
            value={form.fees}
            onChange={(e) => setForm({ ...form, fees: e.target.value })}
          />
          <Input
            type="date"
            value={form.tradeDate}
            onChange={(e) => setForm({ ...form, tradeDate: e.target.value })}
          />

          <Button onClick={submit} disabled={createTxn.isPending}>
            {form.txnType.toUpperCase()}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
