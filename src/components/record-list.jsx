import React from 'react';
import records from '../records.json';

function RecordList() {
  return (
    <section className="record-list">
      {records.map((record, i) => (
        <figure className="record" key={i}>
          <img src={record.cover} alt={record.title} />
          <figcaption>
            <p>{record.artist}</p>
            <p>{record.title}</p>
          </figcaption>
        </figure>
      ))}
    </section>
  );
}

export default RecordList;
