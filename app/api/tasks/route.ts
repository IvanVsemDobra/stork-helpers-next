import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import { isAxiosError } from "axios";
import { api } from "../client";

export async function GET() {
    try {
        const cookieStore = await cookies();

        const res = await api.get("/tasks", {
            headers: {
                Cookie: cookieStore.toString(),
            },
        });

        return NextResponse.json(res.data, { status: res.status });
    } catch (error) {
        if (isAxiosError(error)) {
            console.error("API error:", error.response?.data);
            return NextResponse.json(
                { error: error.response?.data },
                { status: error.response?.status || 500 }
            );
        }

        console.error("Unknown error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const body = await request.json();

        const res = await api.post("/tasks", body, {
            headers: {
                Cookie: cookieStore.toString(),
            },
        });

        return NextResponse.json(res.data, { status: res.status });
    } catch (error) {
        if (isAxiosError(error)) {
            console.error("API error:", error.response?.data);
            return NextResponse.json(
                { error: error.response?.data },
                { status: error.response?.status || 500 }
            );
        }

        console.error("Unknown error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}