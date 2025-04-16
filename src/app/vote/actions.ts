'use server'

import { redirect } from 'next/navigation';

export async function submitToken(formData: FormData) {
  const token = formData.get('token') as string;
  if (token) {
    redirect(`/vote/${encodeURIComponent(token)}`);
  }
} 