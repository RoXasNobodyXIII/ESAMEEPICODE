import React from 'react';

function startOfMonth(d){ const dt=new Date(d.getFullYear(), d.getMonth(), 1); const day=dt.getDay(); return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate()-((day+6)%7)); }
function endOfMonth(d){ const dt=new Date(d.getFullYear(), d.getMonth()+1, 0); const day=dt.getDay(); return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate()+ (7-((day+6)%7))-1); }
function fmtDateKey(d){ return d.toISOString().slice(0,10); }

const CorsiCalendar = () => {
  const [refDate, setRefDate] = React.useState(() => new Date());
  const todayKey = React.useMemo(() => new Date().toISOString().slice(0,10), []);

  const sod = startOfMonth(refDate);
  const eom = endOfMonth(refDate);
  const days = [];
  for(let d=new Date(sod); d<=eom; d.setDate(d.getDate()+1)){
    days.push(new Date(d));
  }

  const monthName = refDate.toLocaleString('it-IT', { month: 'long', year: 'numeric' });

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <button className="btn btn-outline-secondary btn-sm" onClick={() => setRefDate(new Date(refDate.getFullYear(), refDate.getMonth()-1, 1))}>«</button>
          <h3 className="mb-0 text-capitalize">{monthName}</h3>
          <button className="btn btn-outline-secondary btn-sm" onClick={() => setRefDate(new Date(refDate.getFullYear(), refDate.getMonth()+1, 1))}>»</button>
        </div>
        <div className="row g-2">
          {["Lun","Mar","Mer","Gio","Ven","Sab","Dom"].map((w) => (
            <div key={w} className="col-12 col-sm-1 col-md-1" style={{flex: '1 0 14%'}}>
              <div className="text-muted small fw-semibold text-center">{w}</div>
            </div>
          ))}
        </div>
        <div className="row g-2 mt-1">
          {days.map((d, idx) => {
            const inMonth = d.getMonth() === refDate.getMonth();
            const key = fmtDateKey(d);
            const isToday = key === todayKey;
            return (
              <div key={idx} className="col-12 col-sm-1 col-md-1" style={{flex: '1 0 14%'}}>
                <div className={`border rounded p-2 h-100 ${inMonth ? '' : 'bg-light'} ${isToday ? 'border-2 border-primary' : ''}`} style={{minHeight: 84}}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="small fw-semibold">{d.getDate()}</div>
                    {isToday && <span className="badge bg-primary">Oggi</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CorsiCalendar;
