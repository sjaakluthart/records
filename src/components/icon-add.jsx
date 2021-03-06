import React from 'react';

function IconPurchase({ color }) {
  let fill = '#757575';

  if (color) {
    fill = color;
  }

  return (
    <svg width="24px" height="24px" viewBox="0 0 24 24">
      <g id="icon-add" transform="translate(5.000000, 5.000000)" fill={fill}>
        <polygon id="Shape" points="14 8 8 8 8 14 6 14 6 8 0 8 0 6 6 6 6 0 8 0 8 6 14 6" />
      </g>
    </svg>
  );
}

IconPurchase.propTypes = {
  color: React.PropTypes.string
};

export default IconPurchase;
