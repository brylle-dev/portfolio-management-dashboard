import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useInstrument } from "../hooks/useInstrument";
import { useInstrumentStore } from "../store/instrument.store";

export function InstrumentList() {
  const [open, setOpen] = useState(false);
  const { data: instrumentList = [] } = useInstrument();
  const { selectedInstrumentId, setSelectedInstrumentId } =
    useInstrumentStore();

  const selectedInstrument = instrumentList.find(
    (i) => i.id === selectedInstrumentId
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedInstrument
            ? selectedInstrument.symbol
            : "Select instrument..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search instrument..." className="h-9" />
          <CommandList>
            <CommandEmpty>No instrument found.</CommandEmpty>
            <CommandGroup>
              {instrumentList.map((inst) => (
                <CommandItem
                  key={inst.id}
                  value={inst.id}
                  onSelect={(currentValue) => {
                    setSelectedInstrumentId(
                      currentValue === selectedInstrumentId ? "" : currentValue
                    );
                    setOpen(false);
                  }}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{inst.symbol}</span>
                    <span className="text-xs text-muted-foreground">
                      {inst.name} ({inst.assetClass})
                    </span>
                  </div>
                  <Check
                    className={cn(
                      "ml-auto",
                      selectedInstrumentId === inst.id
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
