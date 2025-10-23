import React from 'react';
import { listEvents } from '../utils/eventsStore';
import { Link } from 'react-router-dom';

function startOfMonth(d){ const dt=new Date(d.getFullYear(), d.getMonth(), 1); const day=dt.getDay(); return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate()-((day+6)%7)); }
function endOfMonth(d){ const dt=new Date(d.getFullYear(), d.getMonth()+1, 0); const day=dt.getDay(); return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate()+ (7-((day+6)%7))-1); }
function fmtDateKey(d){ return d.toISOString().slice(0,10); }

const CalendarMonth = () => {
  const [refDate, setRefDate] = React.useState(() => new Date());
  const events = React.useMemo(() => listEvents().filter(e => e.status !== 'bozza'), []);

  const sod = startOfMonth(refDate);
  const eom = endOfMonth(refDate);
  const days = [];
  for(let d=new Date(sod); d<=eom; d.setDate(d.getDate()+1)){
    days.push(new Date(d));
  }

  const byDate = React.useMemo(() => {
    const map = new Map();
    for(const ev of events){
      const key = ev.date;
      if(!map.has(key)) map.set(key, []);
      map.get(key).push(ev);
    }
    return map;
  }, [events]);

  const monthName = refDate.toLocaleString('it-IT', { month: 'long', year: 'numeric' });

  return (
    <div className="card">
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
            const evs = byDate.get(key) || [];
            return (
              <div key={idx} className="col-12 col-sm-1 col-md-1" style={{flex: '1 0 14%'}}>
                <div className={`border rounded p-1 h-100 ${inMonth ? '' : 'bg-light'}`} style={{minHeight: 96}}>
                  <div className="small fw-semibold mb-1 text-end">{d.getDate()}</div>
                  <div className="d-flex flex-column gap-1">
                    {evs.slice(0,3).map((ev) => (
                      <Link key={ev.id} to={`/eventi/${ev.id}`} className="badge bg-warning text-dark text-wrap" title={ev.title}>
                        {ev.type === 'attivita' ? 'Att.' : 'Ev.'} {ev.title.length>12? ev.title.slice(0,12)+'…': ev.title}
                      </Link>
                    ))}
                    {evs.length>3 && (
                      <div className="small text-muted">+{evs.length-3} altro</div>
                    )}
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

export default CalendarMonth;
