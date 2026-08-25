import {NextResponse} from 'next/server'; import {clearUser} from '@/src/lib/auth';
export async function POST(){await clearUser();return NextResponse.redirect(new URL('/',process.env.NEXT_PUBLIC_APP_URL||'http://localhost:3000'));}
