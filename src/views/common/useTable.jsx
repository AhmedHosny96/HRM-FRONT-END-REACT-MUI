import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Table,
  TableCell,
  TableHead,
  TableRow,
  makeStyles,
  TablePagination,
  TableSortLabel,
} from "@material-ui/core";

//table stylings

const useStyles = makeStyles((theme) => ({
  table: {
    marginTop: theme.spacing(3),
    "& thead th": {
      fontWeight: "800",
      color: theme.palette.primary.dark,
    },
    "& tbody td": {
      fontWeight: "400",
    },
    "& tbody tr:hover": {
      backgroundColor: "#fffbf2",
      cursor: "pointer",
    },
  },

  action: {},
}));

export function useTable(records, headCells, filterFn) {
  const classes = useStyles();

  //pagination configurations

  // rows per page
  const pages = [6, 12, 24];

  //currentPage

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pages[page]);

  //sorting configuration

  const [order, setOrder] = useState();
  // order type i.e asc , desc
  const [orderBy, setOrderBy] = useState();

  //table container

  const TableContainer = (props) => (
    <Table className={classes.table}>{props.children}</Table>
  );

  //handling sort

  const handleSort = (cellId) => {
    //check the orderBy if
    const isAsc = orderBy === cellId && order === "asc";
    // update the order
    setOrder(isAsc ? "desc" : "asc");
    //update the orderBy
    setOrderBy(cellId);
  };

  //table headers
  const TableHeader = () => {
    return (
      <TableHead className={classes.table}>
        <TableRow>
          {headCells.map((headCell) => (
            <TableCell key={headCell.id} className={classes.action}>
              {headCell.disableSort ? (
                headCell.label
              ) : (
                <TableSortLabel
                  direction={orderBy === headCell.id ? order : "asc"}
                  onClick={() => {
                    handleSort(headCell.id);
                  }}
                >
                  {headCell.label}
                </TableSortLabel>
              )}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  };

  //handle page change for pagination

  const handlePageChange = (newPage) => {
    // set the current page to new page
    setPage(newPage);
  };

  //handle rows per page change

  const handlePerPageChange = (event) => {
    //convert the event.target.value to integer
    setRowsPerPage(parseInt(event.target.value, 5));
    //reset the current page to zero
    setPage(0);
  };

  //table pagination

  const Pagination = () => (
    <TablePagination
      component="div"
      count={records.length} // no of records in the db
      page={page} // current Page
      rowsPerPage={rowsPerPage} // rows to show per page i.e 5,10,20
      rowsPerPageOptions={pages}
      onChangePage={handlePageChange}
      onChangeRowsPerPage={handlePerPageChange}
    />
  );

  //sorting function further study

  function Sort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  function getComparator(order, orderBy) {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  //func after pagination , sorting and filtering

  const recordsAfterPagingAndSorting = () => {
    return Sort(filterFn.fn(records), getComparator(order, orderBy)).slice(
      page * rowsPerPage,
      (page + 1) * rowsPerPage
    );
  };

  return {
    TableContainer,
    TableHeader,
    Pagination,
    recordsAfterPagingAndSorting,
    headCells,
    records,
  };
}

useTable.PropTypes = {
  children: PropTypes.object.isRequired,
};
