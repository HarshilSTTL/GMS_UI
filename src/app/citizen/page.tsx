'use client';
import React from 'react';
import { redirect } from 'next/navigation';

export default function CitizenPage() {
  redirect('/citizen/dashboard');
  return null;
}
