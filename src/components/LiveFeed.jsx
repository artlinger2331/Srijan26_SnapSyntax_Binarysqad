import React from 'react';

const feedItems = [
  { id: 1, type: 'out', icon: '↑', bg: 'rgba(245,158,11,0.15)', color: '#f59e0b', msg: 'Item #402 (Ind. Engine) scanned out at Dock B', time: 'Just now', user: 'JD' },
  { id: 2, type: 'in',  icon: '↓', bg: 'rgba(59,130,246,0.15)',  color: '#3b82f6', msg: 'PO-9923 received (50x Screws)', time: '4m ago', user: 'SM' },
  { id: 3, type: 'alert', icon: '!', bg: 'rgba(239,68,68,0.15)', color: '#ef4444', msg: 'SKU-89A dropped below min threshold (2)', time: '12m ago', user: 'SYS' },
  { id: 4, type: 'out', icon: '↑', bg: 'rgba(245,158,11,0.15)', color: '#f59e0b', msg: 'Item #101 (Steel Beam) scanned out at Dock A', time: '1hr ago', user: 'JD' },
  { id: 5, type: 'in',  icon: '↓', bg: 'rgba(59,130,246,0.15)', color: '#3b82f6', msg: 'PO-9921 received (10x Generators)', time: '2hr ago', user: 'RT' },
];

const LiveFeed = () => (
  <div className="feed-card">
    <div className="feed-header">
      <span style={{ fontSize: 15, fontWeight: 600, color: '#f1f5f9' }}>📡 Live Activity Feed</span>
      <span className="live-dot"></span>
    </div>
    <div className="feed-scroll">
      {feedItems.map(item => (
        <div key={item.id} className="feed-item">
          <div className="feed-icon-wrap" style={{ background: item.bg, color: item.color, fontWeight: 900 }}>{item.icon}</div>
          <div>
            <div className="feed-msg">{item.msg}</div>
            <div className="feed-meta">{item.time} · USR: {item.user}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default LiveFeed;
