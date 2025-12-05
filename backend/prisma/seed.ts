import { PrismaClient, AssetClass, TxnType } from "@prisma/client";
import bcrypt from "bcrypt";

import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({
  adapter,
  log: ["query", "info", "warn", "error"],
});

type PricePoint = { priceDate: string; closePrice: string; source?: string };

const iso = (d: Date) => d.toISOString().slice(0, 10);
const today = new Date();
const d = (offsetDays: number) => {
  const t = new Date(today);
  t.setDate(t.getDate() - offsetDays);
  return iso(t);
};

async function seedInstruments() {
  // STOCKS
  const stocks = [
    { symbol: "AAPL", name: "Apple Inc.", currency: "USD", exchange: "NASDAQ" },
    {
      symbol: "MSFT",
      name: "Microsoft Corporation",
      currency: "USD",
      exchange: "NASDAQ",
    },
    { symbol: "TSLA", name: "Tesla Inc.", currency: "USD", exchange: "NASDAQ" },
  ];
  /**
   * BONDS
   * use coupon and "par-like" price behavior in the close prices
   */
  const bonds = [
    {
      symbol: "UST-10Y-2035",
      name: "U.S. Treasury 10Y (2035 Maturity)",
      currency: "USD",
      exchange: "OTC",
      isin: "USG000000001",
    },
    {
      symbol: "CORP-IBM-2029",
      name: "IBM Corp Bond 3.50% (2029)",
      currency: "USD",
      exchange: "OTC",
      isin: "US45292000001",
    },
  ];

  // MUTUAL FUNDS
  const mutualFunds = [
    {
      symbol: "VFIAX",
      name: "Vanguard 500 Index Fund Admiral Shares",
      currency: "USD",
      exchange: "NASDAQ",
      isin: "US9229087466",
    },
    {
      symbol: "SWTSX",
      name: "Schwab Total Stock Market Index Fund",
      currency: "USD",
      exchange: "NYSE",
      isin: "US8085097557",
    },
  ];

  const createInstruments = (
    base: {
      symbol: string;
      name: string;
      currency: string;
      exchange?: string;
      isin?: string;
      cusip?: string;
    },
    assetClass: AssetClass
  ) =>
    prisma.instrument.upsert({
      where: { symbol: base.symbol },
      update: {},
      create: {
        ...base,
        assetClass,
        active: true,
      },
    });

  const createdStocks = await Promise.all(
    stocks.map((stock) => createInstruments(stock, AssetClass.stock))
  );
  const createdBonds = await Promise.all(
    bonds.map((bond) => createInstruments(bond, AssetClass.bond))
  );
  const createdFunds = await Promise.all(
    mutualFunds.map((fund) => createInstruments(fund, AssetClass.mutual_fund))
  );

  return {
    createdStocks,
    createdBonds,
    createdFunds,
  };
}

function samplePricesFor(base: number): PricePoint[] {
  // Generate 5 days of synthetic prices around base base +- small random
  return [
    { priceDate: d(4), closePrice: (base * 0.98).toFixed(2), source: "seed" },
    { priceDate: d(3), closePrice: (base * 0.99).toFixed(2), source: "seed" },
    { priceDate: d(2), closePrice: (base * 1.01).toFixed(2), source: "seed" },
    { priceDate: d(1), closePrice: (base * 1.02).toFixed(2), source: "seed" },
    { priceDate: d(0), closePrice: (base * 1.03).toFixed(2), source: "seed" },
  ];
}

async function seedPrices(instrumentId: string, points: PricePoint[]) {
  for (const p of points) {
    await prisma.instrumentPrice.upsert({
      where: {
        instrumentId_priceDate: {
          instrumentId,
          priceDate: new Date(p.priceDate),
        },
      },
      update: { closePrice: p.closePrice, source: p.source },
      create: {
        instrumentId,
        priceDate: new Date(p.priceDate),
        closePrice: p.closePrice,
        source: p.source,
      },
    });
  }
}

async function seedUserAndPortfolio() {
  const user = await prisma.user.upsert({
    where: { email: "investor@example.com" },
    update: {},
    create: {
      email: "investor@example.com",
      passwordHash: await bcrypt.hash("Str0ngP@ss!", 12),
      fullName: "Demo Investor",
      status: "active",
    },
  });

  // Create a portfolio for the user
  const portfolio = await prisma.portfolio.create({
    data: {
      userId: user.id,
      name: "Core Portfolio",
      baseCurrency: "USD",
    },
  });

  return {
    user,
    portfolio,
  };
}

async function seedTransations(
  portfolioId: string,
  instruments: Record<string, string>
) {
  // Buy AAPL
  await prisma.transaction.create({
    data: {
      portfolioId,
      instrumentId: instruments["AAPL"],
      txnType: TxnType.buy,
      quantity: "15.00000000",
      unitPrice: "150.000000",
      fees: "2.500000",
      tradeDate: new Date(d(7)),
      settlementDare: new Date(d(5)),
      notes: "Initial AAPL buy",
    },
  });

  // Buy VFIAX mutual fund
  await prisma.transaction.create({
    data: {
      portfolioId,
      instrumentId: instruments["VFIAX"],
      txnType: TxnType.buy,
      quantity: "100.00000000",
      unitPrice: "420.000000",
      fees: "0.000000",
      tradeDate: new Date(d(6)),
      settlementDare: new Date(d(4)),
      notes: "Dollar-cost averaging",
    },
  });

  // Buy UST 10y bond
  await prisma.transaction.create({
    data: {
      portfolioId,
      instrumentId: instruments["UST-10Y-2035"],
      txnType: TxnType.buy,
      quantity: "5.00000000",
      unitPrice: "990.000000",
      fees: "5.000000",
      tradeDate: new Date(d(5)),
      settlementDare: new Date(d(3)),
      notes: "Treasury ladder",
    },
  });

  // Partial sell AAPL
  await prisma.transaction.create({
    data: {
      portfolioId,
      instrumentId: instruments["AAPL"],
      txnType: TxnType.sell,
      quantity: "5.00000000",
      unitPrice: "165.000000",
      fees: "1.500000",
      tradeDate: new Date(d(2)),
      settlementDare: new Date(d(1)),
      notes: "Trim position",
    },
  });
}

async function reconcilePositions(
  portfolioId: string,
  mapIdBySymbol: Record<string, string>
) {
  for (const instrumentId of Object.values(mapIdBySymbol)) {
    const txns = await prisma.transaction.findMany({
      where: {
        portfolioId,
        instrumentId,
      },
    });

    const qty = txns.reduce((acc, t) => {
      const q = Number(t.quantity);
      return acc + (t.txnType === "buy" ? q : -q);
    }, 0);

    const totalBuyQty = txns
      .filter((t) => t.txnType === "buy")
      .reduce((acc, t) => acc + Number(t.quantity), 0);
    const totalBuyCost = txns
      .filter((t) => t.txnType === "buy")
      .reduce(
        (acc, t) =>
          acc +
          Number(t.quantity) *
            (Number(t.unitPrice) +
              Number(t.fees) / Math.max(Number(t.quantity), 1e-9)),
        0
      );

    const avgCost = totalBuyQty > 0 ? totalBuyCost / totalBuyQty : 0;

    const latestPrice = await prisma.instrumentPrice.findFirst({
      where: { instrumentId },
      orderBy: { priceDate: "desc" },
    });

    const lastMarkPrice = latestPrice ? latestPrice.closePrice : null;
    const marketValue = lastMarkPrice
      ? (qty * Number(lastMarkPrice)).toFixed(2)
      : null;

    await prisma.position.upsert({
      where: {
        portfolioId_instrumentId: {
          portfolioId,
          instrumentId,
        },
      },
      update: {
        quantity: qty.toFixed(8),
        avgCost: avgCost.toFixed(6),
        lastMarkPrice: lastMarkPrice ?? undefined,
        marketValue: marketValue ?? undefined,
        updatedAt: new Date(),
      },
      create: {
        portfolioId,
        instrumentId,
        quantity: qty.toFixed(8),
        avgCost: avgCost.toFixed(6),
        lastMarkPrice: lastMarkPrice ?? undefined,
        marketValue: marketValue ?? undefined,
      },
    });
  }
}

async function main() {
  console.log("Seeding: instruments...");
  const { createdStocks, createdBonds, createdFunds } = await seedInstruments();

  const mapIdBySymbol: Record<string, string> = {};
  [...createdStocks, ...createdBonds, ...createdFunds].forEach((i) => {
    mapIdBySymbol[i.symbol] = i.id;
  });

  console.log("Seeding: prices...");
  await seedPrices(mapIdBySymbol["AAPL"], samplePricesFor(155));
  await seedPrices(mapIdBySymbol["MSFT"], samplePricesFor(330));
  await seedPrices(mapIdBySymbol["TSLA"], samplePricesFor(240));
  await seedPrices(mapIdBySymbol["UST-10Y-2035"], samplePricesFor(99.5));
  await seedPrices(mapIdBySymbol["CORP-IBM-2029"], samplePricesFor(101.2));
  await seedPrices(mapIdBySymbol["VFIAX"], samplePricesFor(420));
  await seedPrices(mapIdBySymbol["SWTSX"], samplePricesFor(75));

  console.log("Seeding: user & portfolio...");
  const { portfolio } = await seedUserAndPortfolio();

  console.log("Seeding: transactions...");
  await seedTransations(portfolio.id, mapIdBySymbol);

  console.log("Reconciling positions...");
  await reconcilePositions(portfolio.id, mapIdBySymbol);

  console.log("Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
