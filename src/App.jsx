import React from 'react';
import InvoiceForm from './components/InvoiceForm';

const App = () => (
  <main className="p-6 max-w-4xl mx-auto">
    <h1 className="text-3xl font-bold mb-4">Invoice Generator</h1>
    <InvoiceForm />
  </main>
);

export default App;