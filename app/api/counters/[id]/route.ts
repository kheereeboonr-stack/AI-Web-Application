import { pool } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
    try {
        const result = await pool.query(
            `SELECT id, title, count_value, note, created_at
 FROM counters
 ORDER BY created_at DESC`
        );

        return Response.json({
            counters: result.rows,
        });
    } catch (error) {
        console.error(error);
        return Response.json(
            { error: "Cannot load records" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body: unknown = await request.json();

        if (!body || typeof body !== "object") {
            return Response.json(
                { error: "Invalid body" },
                { status: 400 }
            );
        }

        const data = body as Record<string, unknown>;

        if (
            typeof data.title !== "string" ||
            typeof data.countValue !== "number" ||
            (
                data.note !== undefined &&
                typeof data.note !== "string"
            )
        ) {
            return Response.json(
                { error: "Invalid fields" },
                { status: 400 }
            );
        }

        const title = data.title.trim();
        const countValue = data.countValue;
        const note =
            typeof data.note === "string"
                ? data.note.trim()
                : "";

        if (
            !title ||
            title.length > 200 ||
            note.length > 100 ||
            !Number.isSafeInteger(countValue) ||
            countValue < 0
        ) {
            return Response.json(
                { error: "Check title and count" },
                { status: 400 }
            );
        }

        const result = await pool.query(
            `INSERT INTO counters (title, count_value, note)
 VALUES ($1, $2, $3)
 RETURNING *`,
            [title, countValue, note]
        );

        return Response.json(
            { counter: result.rows[0] },
            { status: 201 }
        );
    } catch (error) {
        console.error(error);
        return Response.json(
            { error: "Cannot save record" },
            { status: 500 }
        );
    }
}