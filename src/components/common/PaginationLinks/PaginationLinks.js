import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import './PaginationLinks.css';


function shouldJoin(array1, array2) {
  return _.intersection(array1, array2).length > 0 || (array1[array1.length - 1] + 1) === array2[0];
}

export default class PaginationLinks extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    currentPage: PropTypes.number.isRequired,
    lastPage: PropTypes.number.isRequired,
    changePage: PropTypes.func.isRequired,
  };

  static defaultProps = {
    className: null,
  };

  constructor(props) {
    super(props);
    this.isFirstPage = this.isFirstPage.bind(this);
    this.isLastPage = this.isLastPage.bind(this);
    this.changePage = this.changePage.bind(this);
    this.getPages = this.getPages.bind(this);
    this.pageNeighbours = this.pageNeighbours.bind(this);
  }

  getPages() {
    const first = 1;
    const last = this.props.lastPage;
    const current = this.props.currentPage;
    const segment1 = this.pageNeighbours(first);
    const segment2 = this.pageNeighbours(current);
    const segment3 = this.pageNeighbours(last);
    let pages;
    if (shouldJoin(segment1, segment2)) {
      pages = _.union(segment1, segment2);
    } else {
      pages = _.concat(segment1, NaN, segment2);
    }

    if (shouldJoin(segment2, segment3)) {
      if (shouldJoin(pages, segment3)) {
        pages = _.concat(pages, _.difference(_.union(segment2, segment3), pages));
      }
    } else {
      pages = _.concat(pages, NaN, segment3);
    }
    return pages;
  }


  pageNeighbours(page) {
    return _.range(Math.max(1, page - 1), Math.min(this.props.lastPage, page + 1) + 1);
  }

  isFirstPage() {
    const { currentPage } = this.props;
    return currentPage === 1;
  }

  isLastPage() {
    const { currentPage, lastPage } = this.props;
    return currentPage === lastPage;
  }

  changePage(event, page) {
    event.preventDefault();
    this.props.changePage(page);
  }

  render() {
    if (this.isFirstPage() && this.isLastPage()) return null;
    const {
      currentPage,
      className,
    } = this.props;
    return (
      <div className="pagination-container">
        <Pagination className={className}>
          <PaginationItem disabled={this.isFirstPage()}>
            <PaginationLink
              href="#"
              previous
              onClick={evt => this.changePage(evt, currentPage - 1)}
            />
          </PaginationItem>
          {
            this.getPages().map((page, i) => {
              if (!Number.isNaN(page)) {
                return (
                  <PaginationItem key={`page-${page}`} active={currentPage === page}>
                    <PaginationLink href="#" onClick={evt => this.changePage(evt, page)}>
                      { page }
                    </PaginationLink>
                  </PaginationItem>
                );
              }
              return (
                // eslint-disable-next-line react/no-array-index-key
                <PaginationItem key={`hellip-${i}`} disabled>
                  <PaginationLink>
                    &hellip;
                  </PaginationLink>
                </PaginationItem>
              );
            })
          }
          <PaginationItem disabled={this.isLastPage()}>
            <PaginationLink
              href="#"
              next
              onClick={evt => this.changePage(evt, currentPage + 1)}
            />
          </PaginationItem>
        </Pagination>
      </div>
    );
  }
}
