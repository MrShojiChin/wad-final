// customer/[id]/page.js

'use client';

import React from 'react';

export default async function CustomerDetailPage({ params }) {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;

  const res = await fetch(`${API_BASE}/customer/${params.id}`, { cache: 'no-store' });
  const customer = await res.json();

  return (
    <div className="m-4">
      <h1>Customer Details</h1>
      <p className="font-bold text-xl text-blue-800">{customer.name}</p>
      <p>Date of Birth: {customer.dateOfBirth}</p>
      <p>Interests: {Array.isArray(customer.interests) ? customer.interests.join(', ') : customer.interests}</p>
    </div>
  );
}