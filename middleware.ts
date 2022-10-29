import { NextRequest, NextFetchEvent, userAgent } from "next/server";
import { NextResponse } from "next/server";
export function middleware(req: NextRequest, ev:NextFetchEvent){  
  const ua = userAgent(req);
  
  if(!req.url.includes("/api")){
    if(!req.url.includes("/enter") && !req.cookies.get("catservantsession")){
      console.log("catservantsession");
      return NextResponse.redirect("/enter")
    }
  }
}