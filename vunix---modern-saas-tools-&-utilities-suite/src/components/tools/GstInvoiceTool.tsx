import React, { useState } from 'react';
import { Plus, Trash2, Printer, Download, Receipt, FileText } from 'lucide-react';

interface InvoiceItem {
  id: string;
  description: string;
  hsn: string;
  quantity: number;
  rate: number;
  gstRate: number; // 0, 5, 12, 18, 28
}

export const GstInvoiceTool: React.FC = () => {
  // All fields load blank by default
  const [sellerName, setSellerName] = useState('');
  const [sellerGst, setSellerGst] = useState('');
  const [sellerAddress, setSellerAddress] = useState('');
  const [sellerPhone, setSellerPhone] = useState('');

  const [buyerName, setBuyerName] = useState('');
  const [buyerGst, setBuyerGst] = useState('');
  const [buyerAddress, setBuyerAddress] = useState('');

  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoiceDate, setInvoiceDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isInterState, setIsInterState] = useState(false); // IGST vs CGST/SGST

  const [items, setItems] = useState<InvoiceItem[]>([]);

  const addItem = () => {
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        description: '',
        hsn: '',
        quantity: 1,
        rate: 0,
        gstRate: 18,
      },
    ]);
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);

  const totalTax = items.reduce((sum, item) => {
    const taxable = item.quantity * item.rate;
    return sum + (taxable * item.gstRate) / 100;
  }, 0);

  const grandTotal = subtotal + totalTax;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Editor Controls */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-neutral-200 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-neutral-900">Commercial GST Invoice Generator</h3>
            <p className="text-xs text-neutral-500">Fill in company & billing details to generate a tax-compliant invoice</p>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs font-semibold text-neutral-700 cursor-pointer bg-neutral-100 px-3 py-1.5 rounded-full">
              <input
                type="checkbox"
                checked={isInterState}
                onChange={(e) => setIsInterState(e.target.checked)}
                className="rounded text-[#451A03] focus:ring-[#451A03]"
              />
              <span>Inter-State Supply (Apply IGST)</span>
            </label>
            <button
              onClick={handlePrint}
              disabled={items.length === 0}
              className="px-5 py-2 rounded-full bg-black text-white text-xs font-semibold uppercase tracking-wider hover:opacity-90 disabled:opacity-40 transition flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" /> Print / PDF
            </button>
          </div>
        </div>

        {/* 2-Column Seller / Buyer Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Seller / Supplier */}
          <div className="p-5 rounded-2xl bg-[#EDE9FE]/40 border border-[#DDD6FE] space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#451A03]">
              Seller / Supplier Details
            </span>
            <input
              type="text"
              value={sellerName}
              onChange={(e) => setSellerName(e.target.value)}
              placeholder="Your Business / Firm Name"
              className="w-full px-3.5 py-2 rounded-xl bg-white border border-neutral-200 text-xs focus:ring-2 focus:ring-[#451A03] focus:outline-none"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={sellerGst}
                onChange={(e) => setSellerGst(e.target.value.toUpperCase())}
                placeholder="GSTIN (e.g. 27AAAAA0000A1Z5)"
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-neutral-200 text-xs font-mono focus:ring-2 focus:ring-[#451A03] focus:outline-none"
              />
              <input
                type="text"
                value={sellerPhone}
                onChange={(e) => setSellerPhone(e.target.value)}
                placeholder="Contact Phone / Email"
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-neutral-200 text-xs focus:ring-2 focus:ring-[#451A03] focus:outline-none"
              />
            </div>
            <textarea
              rows={2}
              value={sellerAddress}
              onChange={(e) => setSellerAddress(e.target.value)}
              placeholder="Full Address & State"
              className="w-full px-3.5 py-2 rounded-xl bg-white border border-neutral-200 text-xs focus:ring-2 focus:ring-[#451A03] focus:outline-none"
            />
          </div>

          {/* Buyer / Client */}
          <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-700">
              Billed To (Buyer / Client)
            </span>
            <input
              type="text"
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
              placeholder="Client / Company Name"
              className="w-full px-3.5 py-2 rounded-xl bg-white border border-neutral-200 text-xs focus:ring-2 focus:ring-[#451A03] focus:outline-none"
            />
            <input
              type="text"
              value={buyerGst}
              onChange={(e) => setBuyerGst(e.target.value.toUpperCase())}
              placeholder="Buyer GSTIN (Optional)"
              className="w-full px-3.5 py-2 rounded-xl bg-white border border-neutral-200 text-xs font-mono focus:ring-2 focus:ring-[#451A03] focus:outline-none"
            />
            <textarea
              rows={2}
              value={buyerAddress}
              onChange={(e) => setBuyerAddress(e.target.value)}
              placeholder="Client Address & Place of Supply"
              className="w-full px-3.5 py-2 rounded-xl bg-white border border-neutral-200 text-xs focus:ring-2 focus:ring-[#451A03] focus:outline-none"
            />
          </div>
        </div>

        {/* Invoice Meta */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-neutral-500 mb-1">Invoice Number</label>
            <input
              type="text"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              placeholder="INV-2026-001"
              className="w-full px-3.5 py-2 rounded-xl bg-white border border-neutral-200 text-xs font-mono focus:ring-2 focus:ring-[#451A03]"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-neutral-500 mb-1">Invoice Date</label>
            <input
              type="date"
              value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-white border border-neutral-200 text-xs focus:ring-2 focus:ring-[#451A03]"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-neutral-500 mb-1">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-white border border-neutral-200 text-xs focus:ring-2 focus:ring-[#451A03]"
            />
          </div>
        </div>

        {/* Line Items Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-700">Line Items & Services</span>
            <button
              onClick={addItem}
              className="px-3.5 py-1.5 rounded-full bg-[#EDE9FE] text-[#451A03] text-xs font-semibold hover:bg-[#DDD6FE] transition flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Item
            </button>
          </div>

          {items.length === 0 ? (
            <div className="p-8 border border-dashed border-neutral-200 rounded-2xl text-center text-neutral-400">
              <FileText className="w-6 h-6 mx-auto mb-1 opacity-40" />
              <p className="text-xs">No items added yet. Click &quot;Add Item&quot; to add goods or services.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {items.map((item, index) => {
                const itemTotal = item.quantity * item.rate;
                const itemTax = (itemTotal * item.gstRate) / 100;
                return (
                  <div key={item.id} className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200 grid grid-cols-12 gap-2 items-center">
                    <span className="col-span-1 text-xs font-bold text-neutral-400 text-center">#{index + 1}</span>
                    <div className="col-span-4">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        placeholder="Item Description"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-neutral-200 text-xs focus:ring-2 focus:ring-[#451A03]"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="text"
                        value={item.hsn}
                        onChange={(e) => updateItem(item.id, 'hsn', e.target.value)}
                        placeholder="HSN/SAC"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-neutral-200 text-xs font-mono focus:ring-2 focus:ring-[#451A03]"
                      />
                    </div>
                    <div className="col-span-1">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                        placeholder="Qty"
                        className="w-full px-2 py-1.5 rounded-lg bg-white border border-neutral-200 text-xs text-center focus:ring-2 focus:ring-[#451A03]"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        min="0"
                        value={item.rate === 0 ? '' : item.rate}
                        onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                        placeholder="Rate ₹"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-neutral-200 text-xs text-right focus:ring-2 focus:ring-[#451A03]"
                      />
                    </div>
                    <div className="col-span-1">
                      <select
                        value={item.gstRate}
                        onChange={(e) => updateItem(item.id, 'gstRate', parseInt(e.target.value))}
                        className="w-full px-1 py-1.5 rounded-lg bg-white border border-neutral-200 text-[11px] font-semibold text-center"
                      >
                        <option value="0">0%</option>
                        <option value="5">5%</option>
                        <option value="12">12%</option>
                        <option value="18">18%</option>
                        <option value="28">28%</option>
                      </select>
                    </div>
                    <div className="col-span-1 flex justify-center">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1 rounded text-neutral-400 hover:text-red-600 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Totals Summary */}
        <div className="flex justify-end pt-4 border-t border-neutral-200">
          <div className="w-72 space-y-2 text-xs">
            <div className="flex justify-between text-neutral-600">
              <span>Taxable Value:</span>
              <span className="font-mono font-semibold">₹{subtotal.toFixed(2)}</span>
            </div>
            {isInterState ? (
              <div className="flex justify-between text-neutral-600">
                <span>Integrated GST (IGST):</span>
                <span className="font-mono font-semibold">₹{totalTax.toFixed(2)}</span>
              </div>
            ) : (
              <>
                <div className="flex justify-between text-neutral-600">
                  <span>Central GST (CGST):</span>
                  <span className="font-mono font-semibold">₹{(totalTax / 2).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>State GST (SGST):</span>
                  <span className="font-mono font-semibold">₹{(totalTax / 2).toFixed(2)}</span>
                </div>
              </>
            )}
            <div className="flex justify-between text-sm font-bold text-[#451A03] pt-2 border-t border-neutral-200">
              <span>Grand Total:</span>
              <span className="font-mono">₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Printable Invoice Sheet Preview */}
      <div id="vunix-invoice-printable" className="p-10 rounded-3xl bg-white border border-neutral-300 shadow-md max-w-3xl mx-auto space-y-8 font-sans">
        <div className="flex justify-between items-start border-b-2 border-[#451A03] pb-6">
          <div>
            <span className="text-2xl font-black tracking-tight text-[#451A03]">
              {sellerName || 'YOUR BUSINESS NAME'}
            </span>
            <p className="text-xs text-neutral-600 mt-1 whitespace-pre-line">{sellerAddress || 'Seller Address & City'}</p>
            <p className="text-xs text-neutral-600 font-mono mt-0.5">GSTIN: {sellerGst || 'NOT PROVIDED'}</p>
            {sellerPhone && <p className="text-xs text-neutral-600">Contact: {sellerPhone}</p>}
          </div>
          <div className="text-right">
            <span className="inline-block px-3 py-1 rounded bg-[#EDE9FE] text-[#451A03] font-bold text-xs uppercase tracking-widest mb-2">
              TAX INVOICE
            </span>
            <div className="text-xs space-y-0.5 font-mono">
              <p><span className="text-neutral-500">Invoice:</span> <strong>{invoiceNumber || 'INV-0001'}</strong></p>
              <p><span className="text-neutral-500">Date:</span> {invoiceDate || new Date().toISOString().split('T')[0]}</p>
              {dueDate && <p><span className="text-neutral-500">Due:</span> {dueDate}</p>}
            </div>
          </div>
        </div>

        {/* Bill to */}
        <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
            BILLED TO:
          </span>
          <div className="text-xs text-neutral-800">
            <p className="font-bold text-sm text-neutral-900">{buyerName || 'Client / Customer Name'}</p>
            <p className="whitespace-pre-line text-neutral-600 mt-0.5">{buyerAddress || 'Client Billing Address'}</p>
            {buyerGst && <p className="font-mono mt-1 text-neutral-700">Buyer GSTIN: {buyerGst}</p>}
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="border-b border-neutral-300 text-neutral-600 font-bold uppercase text-[10px] tracking-wider">
              <th className="py-2">#</th>
              <th className="py-2">Description</th>
              <th className="py-2">HSN</th>
              <th className="py-2 text-center">Qty</th>
              <th className="py-2 text-right">Rate</th>
              <th className="py-2 text-center">GST %</th>
              <th className="py-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {items.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-6 text-center text-neutral-400 italic">
                  No line items added
                </td>
              </tr>
            ) : (
              items.map((it, idx) => {
                const total = it.quantity * it.rate;
                return (
                  <tr key={it.id}>
                    <td className="py-2.5 font-mono text-neutral-400">{idx + 1}</td>
                    <td className="py-2.5 font-medium text-neutral-900">{it.description || 'Service/Product'}</td>
                    <td className="py-2.5 font-mono text-neutral-600">{it.hsn || '-'}</td>
                    <td className="py-2.5 text-center">{it.quantity}</td>
                    <td className="py-2.5 text-right font-mono">₹{it.rate.toFixed(2)}</td>
                    <td className="py-2.5 text-center font-mono">{it.gstRate}%</td>
                    <td className="py-2.5 text-right font-mono font-semibold">₹{total.toFixed(2)}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Footer Summary */}
        <div className="flex justify-between items-end pt-4 border-t border-neutral-300">
          <div className="text-[11px] text-neutral-500 max-w-sm">
            <p className="font-semibold text-neutral-700">Declaration & Terms:</p>
            <p>Certified that all particulars are true and correct. Subject to local jurisdiction.</p>
          </div>
          <div className="w-64 space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-neutral-600">Taxable Subtotal:</span>
              <span className="font-mono font-medium">₹{subtotal.toFixed(2)}</span>
            </div>
            {isInterState ? (
              <div className="flex justify-between">
                <span className="text-neutral-600">IGST:</span>
                <span className="font-mono font-medium">₹{totalTax.toFixed(2)}</span>
              </div>
            ) : (
              <>
                <div className="flex justify-between">
                  <span className="text-neutral-600">CGST:</span>
                  <span className="font-mono font-medium">₹{(totalTax / 2).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">SGST:</span>
                  <span className="font-mono font-medium">₹{(totalTax / 2).toFixed(2)}</span>
                </div>
              </>
            )}
            <div className="flex justify-between font-bold text-sm text-[#451A03] pt-2 border-t-2 border-[#451A03]">
              <span>Invoice Total:</span>
              <span className="font-mono">₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
