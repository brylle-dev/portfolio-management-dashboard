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
import type { TxnType } from "../types/transaction.types";
import { EditIcon } from "lucide-react";

interface TransactionDialogProps {
  portfolioId: string;
  defaultInstrument?: {
    id: string;
    symbol: string;
    name: string;
  };
  defaultTxnType?: "buy" | "sell" | "adjust";
  triggerLabel?: string;
  onSuccess?: () => void;
}

export function TransactionDialog({
  portfolioId,
  defaultInstrument,
  defaultTxnType = "buy",
  triggerLabel = "Add Transaction",
  onSuccess,
}: TransactionDialogProps) {
  const createTxn = useCreateTransaction();
  const { selectedInstrumentId, setSelectedInstrumentId } =
    useInstrumentStore();
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    instrumentId: "",
    txnType: defaultTxnType,
    quantity: "",
    unitPrice: "",
    fees: "0",
    tradeDate: "",
  });

  // Prefill when editing a holding
  useEffect(() => {
    if (defaultInstrument) {
      setForm((prev) => ({
        ...prev,
        instrumentId: defaultInstrument.id,
      }));
      setSelectedInstrumentId(defaultInstrument.id);
    }
  }, [defaultInstrument, setSelectedInstrumentId]);

  // Reset and close after success
  useEffect(() => {
    if (createTxn.isSuccess) {
      setOpen(false);
      setForm({
        instrumentId: "",
        txnType: defaultTxnType,
        quantity: "",
        unitPrice: "",
        fees: "0",
        tradeDate: "",
      });
      onSuccess?.();
    }
  }, [createTxn.isSuccess, defaultTxnType, onSuccess]);

  const submit = () => {
    createTxn.mutate({
      portfolioId,
      ...form,
      instrumentId: defaultInstrument?.id || selectedInstrumentId || "",
      txnType: form.txnType as TxnType,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={defaultInstrument ? "ghost" : "default"}>
          {defaultInstrument ? <EditIcon /> : triggerLabel}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {defaultInstrument
              ? `Record ${form.txnType.toUpperCase()} for ${defaultInstrument.symbol}`
              : "New Transaction"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-3">
          {/* Instrument selection (hidden if editing) */}
          {!defaultInstrument && <InstrumentList />}

          <Select
            value={form.txnType}
            onValueChange={(val) =>
              setForm({ ...form, txnType: val as TxnType })
            }
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
            type="number"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          />
          <Input
            placeholder="Unit Price"
            type="number"
            value={form.unitPrice}
            onChange={(e) => setForm({ ...form, unitPrice: e.target.value })}
          />
          <Input
            placeholder="Fees"
            type="number"
            value={form.fees}
            onChange={(e) => setForm({ ...form, fees: e.target.value })}
          />
          <Input
            type="date"
            value={form.tradeDate}
            onChange={(e) => setForm({ ...form, tradeDate: e.target.value })}
          />

          <Button onClick={submit} disabled={createTxn.isPending}>
            {createTxn.isPending ? "Saving..." : form.txnType.toUpperCase()}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
