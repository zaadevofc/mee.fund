export { default } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

const secure = ["/search", '/activity'];

export async function middleware(req: NextRequest) {
  const redirect = (uri: any) => NextResponse.redirect(new URL(uri, req.url));
  const session = await req.cookies.get("meefund-passport.session-token")?.value;
  const pathname = req.nextUrl.pathname;
  const tab = req.nextUrl.searchParams.get('tab')

  const isSecure = secure.some(path => new RegExp(`^${path.replace(/\*/g, '.*')}$`).test(pathname));

  if (isSecure && !session) {
    return redirect('/');
  }

  return NextResponse.next();
}