import React from 'react';
import _ from 'underscore';

function RecordList({ records }) {
  const sortedRecords = _.sortBy(records, record => record.artist);

  return (
    <section className="record-list">
      {sortedRecords.map((record, i) => (
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

RecordList.propTypes = {
  records: React.PropTypes.arrayOf(React.PropTypes.shape({
    title: React.PropTypes.string.isRequired,
    artist: React.PropTypes.string.isRequired,
    cover: React.PropTypes.string.isRequired
  })).isRequired
};

export default RecordList;
