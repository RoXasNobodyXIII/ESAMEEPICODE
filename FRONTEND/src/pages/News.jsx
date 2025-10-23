import React from 'react';
import CalendarMonth from '../components/CalendarMonth.jsx';

const News = () => {
  React.useEffect(() => {
    document.title = "EVENTI";
  }, []);
  return (
    <div className="container mt-5">
      <h1>EVENTI</h1>
      <div className="mt-3">
        <CalendarMonth />
      </div>
    </div>
  );
};

export default News;

