import asyncio, asyncpg

async def main():
    try:
        conn = await asyncpg.connect(user='postgres', password='postgres123', database='db', host='localhost', port=5432)
        print("Connected", conn)
        await conn.close()
    except Exception as e:
        print("Error:", e)

asyncio.run(main())
