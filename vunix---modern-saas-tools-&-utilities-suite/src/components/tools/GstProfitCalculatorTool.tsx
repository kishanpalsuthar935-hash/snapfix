import React, { useState } from 'react';
import { Calculator, Percent, TrendingUp, AlertCircle, ArrowRight, DollarSign } from 'lucide-react';

export const GstProfitCalculatorTool: React.FC = () => {
  // Inputs load blank by default
  const [costPrice, setCostPrice] = useState<string>('');
  const [sellingPrice, setSellingPrice] = useState<string>('');
  const [gstRate, setGstRate] = useState<number>(18);
  const [overhead, setOverhead] = useState<string>('');
  const [taxInclusive, setTaxInclusive] = useState<boolean>(true);

  const cp = parseFloat(costPrice) || 0;
  const sp = parseFloat(sellingPrice) || 0;
  const oh = parseFloat(overhead) || 0;

  // Calculations
  let netSellingPrice = sp;
  let gstAmount = 0;

  if (taxInclusive && sp > 0) {
    // SP includes GST: netSP = SP / (1 + gstRate/100)
    netSellingPrice = sp / (1 + gstRate / 100);
    gstAmount = sp - netSellingPrice;
  } else if (!taxInclusive && sp > 0) {
    // SP excludes GST:
    netSellingPrice = sp;
    gstAmount = (sp * gstRate) / 100;
  }

  const totalCost = cp + oh;
  const netProfit = sp > 0 ? netSellingPrice - totalCost : 0;
  const marginPercent = sp > 0 ? (netProfit / (taxInclusive ? sp : sp + gstAmount)) * 100 : 0;
  const markupPercent = totalCost > 0 ? (netProfit / totalCost) * 100 : 0;

  // Percentage breakdown for visual stacked bar
  const totalRevenue = taxInclusive ? sp : sp + gstAmount;
  const costPct = totalRevenue > 0 ? Math.min(100, Math.max(0, (totalCost / totalRevenue) * 100)) : 0;
  const gstPct = totalRevenue > 0 ? Math.min(100, Math.max(0, (gstAmount / totalRevenue) * 100)) : 0;
  const profitPct = totalRevenue > 0 ? Math.max(0, (netProfit / totalRevenue) * 100) : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Inputs Form */}
      <div className="lg:col-span-7 space-y-6">
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-neutral-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#451A03]">
              Financial Inputs
            </h3>
            <label className="flex items-center gap-2 text-xs font-semibold text-neutral-700 cursor-pointer">
              <input
                type="checkbox"
                checked={taxInclusive}
                onChange={(e) => setTaxInclusive(e.target.checked)}
                className="rounded text-[#451A03] focus:ring-[#451A03]"
              />
              <span>Selling Price includes GST</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1">
                Cost of Goods / Purchase Price
              </label>
              <input
                type="number"
                min="0"
                step="any"
                value={costPrice}
                onChange={(e) => setCostPrice(e.target.value)}
                placeholder="e.g. 500"
                className="w-full px-4 py-2.5 rounded-2xl border border-neutral-200 text-sm font-mono focus:ring-2 focus:ring-[#451A03] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1">
                Selling Price (Retail / Quote)
              </label>
              <input
                type="number"
                min="0"
                step="any"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(e.target.value)}
                placeholder="e.g. 1200"
                className="w-full px-4 py-2.5 rounded-2xl border border-neutral-200 text-sm font-mono focus:ring-2 focus:ring-[#451A03] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1">
                Shipping, Packaging & Overheads
              </label>
              <input
                type="number"
                min="0"
                step="any"
                value={overhead}
                onChange={(e) => setOverhead(e.target.value)}
                placeholder="e.g. 80"
                className="w-full px-4 py-2.5 rounded-2xl border border-neutral-200 text-sm font-mono focus:ring-2 focus:ring-[#451A03] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1">
                Applicable GST Slab
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {[0, 5, 12, 18, 28].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => setGstRate(rate)}
                    className={`py-2 rounded-xl text-xs font-bold transition ${
                      gstRate === rate
                        ? 'bg-[#451A03] text-white'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    {rate}%
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Results Dashboard */}
      <div className="lg:col-span-5 space-y-4">
        <div className="p-6 sm:p-8 rounded-3xl bg-[#EDE9FE] border border-[#DDD6FE] shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#451A03]">
              Profitability Breakdown
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                netProfit > 0
                  ? 'bg-emerald-100 text-emerald-800'
                  : netProfit < 0
                  ? 'bg-rose-100 text-rose-800'
                  : 'bg-neutral-200 text-neutral-700'
              }`}
            >
              {netProfit > 0 ? 'Profitable' : netProfit < 0 ? 'Operating Loss' : 'Awaiting Data'}
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-neutral-600">Net Take-Home Profit:</span>
              <span className="text-2xl font-black text-[#451A03] font-mono">
                ₹{netProfit.toFixed(2)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#DDD6FE]">
              <div className="p-3 bg-white rounded-2xl border border-neutral-200">
                <span className="text-[10px] font-bold text-neutral-400 uppercase block">Profit Margin</span>
                <span className="text-lg font-bold text-neutral-900 font-mono">
                  {marginPercent.toFixed(1)}%
                </span>
              </div>
              <div className="p-3 bg-white rounded-2xl border border-neutral-200">
                <span className="text-[10px] font-bold text-neutral-400 uppercase block">Markup on Cost</span>
                <span className="text-lg font-bold text-neutral-900 font-mono">
                  {markupPercent.toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-neutral-700 pt-2 font-mono">
              <div className="flex justify-between">
                <span>Total Costs (CP + Overhead):</span>
                <span>₹{totalCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST Tax Liability:</span>
                <span>₹{gstAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-neutral-900 pt-1 border-t border-[#DDD6FE]">
                <span>Total Customer Invoiced:</span>
                <span>₹{totalRevenue.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Stacked Visual Bar */}
          {totalRevenue > 0 && (
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-neutral-600">Revenue Distribution</span>
              <div className="h-4 rounded-full overflow-hidden flex bg-neutral-200">
                <div style={{ width: `${costPct}%` }} className="bg-neutral-400" title={`Cost ${costPct.toFixed(0)}%`} />
                <div style={{ width: `${gstPct}%` }} className="bg-amber-400" title={`GST ${gstPct.toFixed(0)}%`} />
                <div style={{ width: `${profitPct}%` }} className="bg-[#451A03]" title={`Profit ${profitPct.toFixed(0)}%`} />
              </div>
              <div className="flex justify-between text-[10px] text-neutral-500 font-medium">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-neutral-400 inline-block" /> Cost</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block" /> GST Tax</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#451A03] inline-block" /> Net Profit</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
