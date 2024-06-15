import React, { useState } from 'react';

const DotPagination = ({ totalItems, itemsPerPage, onPageChange }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleClick = (pageNumber) => {
    setCurrentPage(pageNumber);
    onPageChange(pageNumber);
  };

  const renderDots = () => {
    const dots = [];
    for (let i = 1; i <= totalPages; i++) {
      dots.push(
        <li key={i} className={i === currentPage ? 'active' : ''}>
          <button onClick={() => handleClick(i)}>{'\u2022'}</button>
        </li>
      );
    }
    return dots;
  };

  return (
    <div className="dot-pagination">
      <ul>
        {renderDots()}
      </ul>
    </div>
  );
};

export default DotPagination;
