import React, { useState } from 'react';

const pythonCode1 = `<span class="c"># requirements.txt</span>
fastapi==0.110
uvicorn[standard]==0.29
psycopg[binary]==3.1
pydantic==2.6`;

const pythonCode2 = `<span class="k">from</span> fastapi <span class="k">import</span> FastAPI
<span class="k">from</span> psycopg_pool <span class="k">import</span> AsyncConnectionPool
<span class="k">from</span> datetime <span class="k">import</span> date

app = FastAPI()
pool = AsyncConnectionPool(<span class="s">"postgresql://user:pass@localhost:5432/hotelbooking"</span>)

<span class="k">@app</span>.get(<span class="s">"/api/bookings"</span>)
<span class="k">async def</span> list_bookings(status: str | None = <span class="n">None</span>,
                        from_date: date | None = <span class="n">None</span>):
    sql = <span class="s">"""
      SELECT b.booking_id, c.customer_name,
             b.checkin_datetime, b.checkout_datetime,
             b.status, p.status AS payment_status,
             COALESCE(SUM(bd.amount),0) AS total_amount
      FROM booking b
      JOIN customer c ON c.customer_id = b.customer_id
      LEFT JOIN booking_detail bd ON bd.booking_id = b.booking_id
      LEFT JOIN payment p ON p.payment_id = b.payment_id
      WHERE (%s IS NULL OR b.status = %s)
        AND (%s IS NULL OR b.checkin_datetime::date &gt;= %s)
      GROUP BY b.booking_id, c.customer_name, p.status
      ORDER BY b.created_at DESC LIMIT 200;
    """</span>
    <span class="k">async with</span> pool.connection() <span class="k">as</span> conn:
        cur = <span class="k">await</span> conn.execute(sql, (status, status, from_date, from_date))
        rows = <span class="k">await</span> cur.fetchall()
        <span class="k">return</span> [<span class="k">dict</span>(zip([d[<span class="n">0</span>] <span class="k">for</span> d <span class="k">in</span> cur.description], r)) <span class="k">for</span> r <span class="k">in</span> rows]`;

const nodeCode = `<span class="k">import</span> express <span class="k">from</span> <span class="s">'express'</span>;
<span class="k">import</span> { Pool } <span class="k">from</span> <span class="s">'pg'</span>;

<span class="k">const</span> pool = <span class="k">new</span> Pool({ connectionString: process.env.DATABASE_URL });
<span class="k">const</span> app = express(); app.use(express.json());

app.get(<span class="s">'/api/rooms'</span>, <span class="k">async</span> (req, res) =&gt; {
  <span class="k">const</span> { type, status } = req.query;
  <span class="k">const</span> { rows } = <span class="k">await</span> pool.query(\`
    SELECT r.room_id, r.room_number, rt.room_type_name,
           r.price_per_night, r.capacity, r.is_smoking,
           ri.is_available
    FROM room r
    JOIN room_type rt ON rt.room_type_id = r.room_type_id
    JOIN room_inventory ri ON ri.room_id = r.room_id
    WHERE ($1::int IS NULL OR r.room_type_id = $1)
      AND ($2::float IS NULL OR ri.is_available = $2)
    ORDER BY r.room_number;
  \`, [type || <span class="k">null</span>, status === <span class="s">'available'</span> ? <span class="n">1</span> : status === <span class="s">'occupied'</span> ? <span class="n">0</span> : <span class="k">null</span>]);
  res.json(rows);
});

app.post(<span class="s">'/api/bookings'</span>, <span class="k">async</span> (req, res) =&gt; {
  <span class="k">const</span> client = <span class="k">await</span> pool.connect();
  <span class="k">try</span> {
    <span class="k">await</span> client.query(<span class="s">'BEGIN'</span>);
    <span class="k">const</span> { rows: [b] } = <span class="k">await</span> client.query(\`
      INSERT INTO booking (customer_id, checkin_datetime, checkout_datetime, status, created_at)
      VALUES ($1,$2,$3,'PENDING', NOW()) RETURNING booking_id;\`,
      [req.body.customer_id, req.body.checkin, req.body.checkout]);
    <span class="k">for</span> (<span class="k">const</span> d <span class="k">of</span> req.body.rooms) {
      <span class="k">await</span> client.query(\`
        INSERT INTO booking_detail (booking_id, room_id, quantity, price, amount)
        VALUES ($1,$2,$3,$4,$3*$4);\`,
        [b.booking_id, d.room_id, d.nights, d.price]);
    }
    <span class="k">await</span> client.query(<span class="s">'COMMIT'</span>);
    res.json({ booking_id: b.booking_id });
  } <span class="k">catch</span> (e) {
    <span class="k">await</span> client.query(<span class="s">'ROLLBACK'</span>);
    res.status(<span class="n">500</span>).json({ error: e.message });
  } <span class="k">finally</span> { client.release(); }
});`;

const sqlCode1 = `<span class="c">-- Doanh thu hôm nay</span>
SELECT COALESCE(SUM(pd.total_payment),0) AS revenue_today
FROM payment_detail pd
WHERE pd.payment_datetime::date = CURRENT_DATE;

<span class="c">-- Tỷ lệ lấp đầy</span>
SELECT ROUND(100.0 * SUM(CASE WHEN is_available = 0 THEN 1 ELSE 0 END) / COUNT(*), 1) AS occupancy_pct
FROM room_inventory;

<span class="c">-- Booking 7 ngày qua</span>
SELECT DATE(b.checkin_datetime) AS d,
       COUNT(*) AS bookings, SUM(bd.amount) AS revenue
FROM booking b
JOIN booking_detail bd ON bd.booking_id = b.booking_id
WHERE b.checkin_datetime &gt;= CURRENT_DATE - INTERVAL <span class="s">'7 days'</span>
GROUP BY 1 ORDER BY 1;`;

const sqlCode2 = `UPDATE customer c
SET membership_type_id = mt.membership_type_id
FROM membership_type mt
WHERE c.total_paid &gt;= mt.paid_from
  AND (mt.paid_to IS NULL OR c.total_paid &lt; mt.paid_to)
  AND c.membership_type_id IS DISTINCT FROM mt.membership_type_id;`;

export default function IntegrationPage({ data, persist, openModal, toast, navigateTo }) {
  const [tab, setTab] = useState('python');

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Hướng dẫn kết nối Postgres</h1>
          <div className="page-sub">Mẫu kết nối cho Python (FastAPI), Node.js (Express) và truy vấn SQL dùng cho từng module</div>
        </div>
      </div>

      <div className="tabs">
        <button className={`tab${tab === 'python' ? ' active' : ''}`} onClick={() => setTab('python')}>Python / FastAPI</button>
        <button className={`tab${tab === 'node' ? ' active' : ''}`} onClick={() => setTab('node')}>Node.js / Express</button>
        <button className={`tab${tab === 'sql' ? ' active' : ''}`} onClick={() => setTab('sql')}>SQL mẫu</button>
      </div>

      {tab === 'python' && (
        <div className="card" style={{ padding: 18 }}>
          <h4 style={{ margin: '0 0 8px' }}>Cài đặt</h4>
          <pre dangerouslySetInnerHTML={{ __html: pythonCode1 }} />
          <h4 style={{ margin: '18px 0 8px' }}>Kết nối &amp; endpoint danh sách booking</h4>
          <pre dangerouslySetInnerHTML={{ __html: pythonCode2 }} />
        </div>
      )}

      {tab === 'node' && (
        <div className="card" style={{ padding: 18 }}>
          <h4 style={{ margin: '0 0 8px' }}>Endpoint quản lý phòng &amp; tạo booking</h4>
          <pre dangerouslySetInnerHTML={{ __html: nodeCode }} />
        </div>
      )}

      {tab === 'sql' && (
        <div className="card" style={{ padding: 18 }}>
          <h4 style={{ margin: '0 0 8px' }}>Dashboard — các KPI chính</h4>
          <pre dangerouslySetInnerHTML={{ __html: sqlCode1 }} />
          <h4 style={{ margin: '18px 0 8px' }}>Tự động cập nhật hạng thành viên</h4>
          <pre dangerouslySetInnerHTML={{ __html: sqlCode2 }} />
        </div>
      )}
    </div>
  );
}
