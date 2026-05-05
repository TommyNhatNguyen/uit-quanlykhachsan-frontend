import { Card, Tabs, Typography } from 'antd';
import React from 'react';

const kStyle = { color: '#ec4899' };
const sStyle = { color: '#f59e0b' };
const cStyle = { color: '#6b7280', fontStyle: 'italic' };
const nStyle = { color: '#3b82f6' };

const pythonCode1 = `<span style="${Object.entries(cStyle).map(([k,v])=>`${k}:${v}`).join(';')}">
# requirements.txt</span>
fastapi==0.110
uvicorn[standard]==0.29
psycopg[binary]==3.1
pydantic==2.6`;

const pythonCode2 = `<span style="color:#ec4899">from</span> fastapi <span style="color:#ec4899">import</span> FastAPI
<span style="color:#ec4899">from</span> psycopg_pool <span style="color:#ec4899">import</span> AsyncConnectionPool

app = FastAPI()
pool = AsyncConnectionPool(<span style="color:#f59e0b">"postgresql://user:pass@localhost:5432/hotelbooking"</span>)

<span style="color:#ec4899">@app</span>.get(<span style="color:#f59e0b">"/api/bookings"</span>)
<span style="color:#ec4899">async def</span> list_bookings(status: str | None = <span style="color:#3b82f6">None</span>):
    sql = <span style="color:#f59e0b">"""
      SELECT b.booking_id, c.customer_name,
             b.checkin_datetime, b.checkout_datetime,
             b.status, COALESCE(SUM(bd.amount),0) AS total_amount
      FROM booking b
      JOIN customer c ON c.customer_id = b.customer_id
      LEFT JOIN booking_detail bd ON bd.booking_id = b.booking_id
      WHERE (%s IS NULL OR b.status = %s)
      GROUP BY b.booking_id, c.customer_name
      ORDER BY b.created_at DESC LIMIT 200;
    """</span>
    <span style="color:#ec4899">async with</span> pool.connection() <span style="color:#ec4899">as</span> conn:
        cur = <span style="color:#ec4899">await</span> conn.execute(sql, (status, status))
        rows = <span style="color:#ec4899">await</span> cur.fetchall()
        <span style="color:#ec4899">return</span> [<span style="color:#ec4899">dict</span>(zip([d[<span style="color:#3b82f6">0</span>] <span style="color:#ec4899">for</span> d <span style="color:#ec4899">in</span> cur.description], r)) <span style="color:#ec4899">for</span> r <span style="color:#ec4899">in</span> rows]`;

const nodeCode = `<span style="color:#ec4899">import</span> express <span style="color:#ec4899">from</span> <span style="color:#f59e0b">'express'</span>;
<span style="color:#ec4899">import</span> { Pool } <span style="color:#ec4899">from</span> <span style="color:#f59e0b">'pg'</span>;

<span style="color:#ec4899">const</span> pool = <span style="color:#ec4899">new</span> Pool({ connectionString: process.env.DATABASE_URL });
<span style="color:#ec4899">const</span> app = express(); app.use(express.json());

app.get(<span style="color:#f59e0b">'/api/rooms'</span>, <span style="color:#ec4899">async</span> (req, res) =&gt; {
  <span style="color:#ec4899">const</span> { type, status } = req.query;
  <span style="color:#ec4899">const</span> { rows } = <span style="color:#ec4899">await</span> pool.query(\`
    SELECT r.room_id, r.room_number, rt.room_type_name,
           r.price_per_night, ri.is_available
    FROM room r
    JOIN room_type rt ON rt.room_type_id = r.room_type_id
    JOIN room_inventory ri ON ri.room_id = r.room_id
    ORDER BY r.room_number;
  \`);
  res.json(rows);
});`;

const sqlCode = `<span style="color:#6b7280;font-style:italic">-- Doanh thu hôm nay</span>
SELECT COALESCE(SUM(pd.total_payment),0) AS revenue_today
FROM payment_detail pd
WHERE pd.payment_datetime::date = CURRENT_DATE;

<span style="color:#6b7280;font-style:italic">-- Tỷ lệ lấp đầy</span>
SELECT ROUND(100.0 * SUM(CASE WHEN is_available = 0 THEN 1 ELSE 0 END) / COUNT(*), 1) AS occupancy_pct
FROM room_inventory;

<span style="color:#6b7280;font-style:italic">-- Booking 7 ngày qua</span>
SELECT DATE(b.checkin_datetime) AS d,
       COUNT(*) AS bookings, SUM(bd.amount) AS revenue
FROM booking b
JOIN booking_detail bd ON bd.booking_id = b.booking_id
WHERE b.checkin_datetime &gt;= CURRENT_DATE - INTERVAL <span style="color:#f59e0b">'7 days'</span>
GROUP BY 1 ORDER BY 1;`;

const preStyle = { background: '#1e1e2e', color: '#cdd6f4', padding: 16, borderRadius: 8, overflowX: 'auto', fontSize: 13, lineHeight: 1.6, margin: 0 };

const tabItems = [
  {
    key: 'python', label: 'Python / FastAPI',
    children: (
      <Card>
        <Typography.Title level={5} style={{ marginTop: 0 }}>Cài đặt</Typography.Title>
        <pre style={preStyle} dangerouslySetInnerHTML={{ __html: pythonCode1 }} />
        <Typography.Title level={5}>Kết nối &amp; endpoint danh sách booking</Typography.Title>
        <pre style={preStyle} dangerouslySetInnerHTML={{ __html: pythonCode2 }} />
      </Card>
    ),
  },
  {
    key: 'node', label: 'Node.js / Express',
    children: (
      <Card>
        <Typography.Title level={5} style={{ marginTop: 0 }}>Endpoint quản lý phòng</Typography.Title>
        <pre style={preStyle} dangerouslySetInnerHTML={{ __html: nodeCode }} />
      </Card>
    ),
  },
  {
    key: 'sql', label: 'SQL mẫu',
    children: (
      <Card>
        <Typography.Title level={5} style={{ marginTop: 0 }}>Dashboard — các KPI chính</Typography.Title>
        <pre style={preStyle} dangerouslySetInnerHTML={{ __html: sqlCode }} />
      </Card>
    ),
  },
];

export default function IntegrationPage() {
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Typography.Title level={3} style={{ margin: 0 }}>Hướng dẫn kết nối Postgres</Typography.Title>
        <Typography.Text type="secondary">Mẫu kết nối cho Python (FastAPI), Node.js (Express) và truy vấn SQL dùng cho từng module</Typography.Text>
      </div>
      <Tabs items={tabItems} />
    </div>
  );
}
