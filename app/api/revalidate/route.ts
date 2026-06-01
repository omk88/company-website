import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { fetchAuthQuery } from "@/lib/auth-server";
import { api } from "@/convex/_generated/api";

export async function POST(request: NextRequest) {
  const user = await fetchAuthQuery(api.auth.getCurrentUser);
  const isCompanyUser = user?.email?.endsWith("@taqtiq.tech");

  if (!isCompanyUser) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    revalidateTag('blog', 'max'); 
    
    return NextResponse.json({ revalidated: true });
  } catch (err) {
    return NextResponse.json({ message: 'Error revalidating' }, { status: 500 });
  }
}