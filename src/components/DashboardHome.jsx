import React from 'react';
import KPICards from './KPICards';
import StockTrendGraph from './StockTrendGraph';
import LiveFeed from './LiveFeed';
import DataTable from './DataTable';

const DashboardHome = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1600, margin: '0 auto', paddingBottom: 40 }}>
      <KPICards />
      <div className="middle-row">
        <StockTrendGraph />
        <LiveFeed />
      </div>
      <DataTable />
    </div>
  );
};

export default DashboardHome;
