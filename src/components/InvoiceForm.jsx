import React, { useState, useRef } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const InvoiceForm = () => {
  const [cashierName, setCashierName] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [items, setItems] = useState([{ description: '', quantity: 1, price: 0 }]);
  const [taxRate, setTaxRate] = useState(0);
  const [logo, setLogo] = useState(null);
  const previewRef = useRef(null);

  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const invoiceNumber = `INV-${today.getFullYear()}${(today.getMonth() + 1)
    .toString()
    .padStart(2, '0')}${today.getDate().toString().padStart(2, '0')}-001`;

  const handleAddItem = () => {
    setItems([...items, { description: '', quantity: 1, price: 0 }]);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = field === 'description' ? value : parseFloat(value);
    setItems(newItems);
  };

  const handleDeleteItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) setLogo(URL.createObjectURL(file));
  };

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;

  const handleDownload = async () => {
    const input = previewRef.current;
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);
    pdf.save(`${invoiceNumber}.pdf`);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-yellow-100 via-amber-100 to-orange-100 flex items-start justify-center py-10 px-4 md:px-6">
      <div className="w-full max-w-5xl space-y-8 text-sm">
        <div className="bg-white shadow-md rounded-lg p-6 md:p-8 space-y-6 border">
          <h1 className="text-2xl font-bold text-gray-800">🧾 Bill Forage - Invoice Generator</h1>

          {/* Logo Upload */}
          <div>
            <label className="block font-medium text-gray-600 mb-2">Upload Logo</label>
            <input type="file" onChange={handleLogoUpload} className="mb-2" />
          </div>

          {/* Cashier / Client Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-gray-600 mb-1">Cashier Name</label>
              <input
                className="w-full p-2 border rounded"
                placeholder="Enter cashier name"
                value={cashierName}
                onChange={(e) => setCashierName(e.target.value)}
              />
            </div>

            <div>
              <label className="block font-medium text-gray-600 mb-1">Client Name</label>
              <input
                className="w-full p-2 border rounded"
                placeholder="Enter client name"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-medium text-gray-600 mb-1">Client Address</label>
              <textarea
                className="w-full p-2 border rounded"
                rows="2"
                placeholder="Enter full client address"
                value={clientAddress}
                onChange={(e) => setClientAddress(e.target.value)}
              />
            </div>
          </div>

          {/* Invoice Items */}
          <div>
            <label className="block font-semibold mb-2 text-gray-700">📦 Invoice Items</label>
            <div className="hidden md:grid grid-cols-4 gap-2 font-medium text-gray-600 mb-1">
              <div>Description</div>
              <div>Quantity</div>
              <div>Price (INR)</div>
              <div>Action</div>
            </div>

            {items.map((item, i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2">
                <input
                  className="border p-2 rounded"
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) => handleItemChange(i, 'description', e.target.value)}
                />
                <input
                  type="number"
                  className="border p-2 rounded"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(i, 'quantity', e.target.value)}
                />
                <input
                  type="number"
                  className="border p-2 rounded"
                  placeholder="Price"
                  value={item.price}
                  onChange={(e) => handleItemChange(i, 'price', e.target.value)}
                />
                <button
  onClick={() => handleDeleteItem(i)}
  className="bg-white text-red-600 border border-red-500 rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-100"
  title="Delete Item"
>
  ❌
</button>

              </div>
            ))}
            <button
              onClick={handleAddItem}
              className="text-blue-600 font-semibold hover:underline mt-1"
            >
              ➕ Add Item
            </button>
          </div>

          {/* Tax */}
          <div className="pt-2">
            <label className="block font-medium text-gray-600 mb-1">Tax Rate (%)</label>
            <input
              type="number"
              className="border p-2 rounded w-full md:w-32"
              placeholder="e.g. 18"
              value={taxRate}
              onChange={(e) => setTaxRate(parseFloat(e.target.value))}
            />
          </div>
        </div>

        {/* Invoice Preview */}
        <div
          id="invoice-preview"
          ref={previewRef}
          className="bg-white p-6 rounded-lg shadow space-y-4 border"
        >
          {logo && <img src={logo} alt="Logo" className="h-16 object-contain mb-2" />}
          <div className="flex flex-col sm:flex-row sm:justify-between text-sm">
            <p><strong>Invoice No:</strong> {invoiceNumber}</p>
            <p><strong>Date:</strong> {formattedDate}</p>
          </div>
          <p><strong>Cashier:</strong> {cashierName}</p>
          <p><strong>Client:</strong> {clientName}</p>
          <p className="text-gray-700">{clientAddress}</p>

          <ul className="space-y-1 text-gray-800">
            {items.map((item, i) => (
              <li key={i}>
                {item.description} — {item.quantity} × ₹{item.price.toFixed(2)} = ₹
                {(item.quantity * item.price).toFixed(2)}
              </li>
            ))}
          </ul>

          <div className="pt-4 space-y-1 text-gray-800">
            <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
            <p>Tax ({taxRate}%): ₹{taxAmount.toFixed(2)}</p>
            <p className="text-lg font-bold text-green-700">Total: ₹{total.toFixed(2)}</p>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={handleDownload}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded shadow mt-4"
          >
            📥 Download Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceForm;
