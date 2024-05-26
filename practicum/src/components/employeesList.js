import * as React from 'react';
import { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useSelector, useDispatch } from "react-redux";
import { IconButton, Button, Paper } from '@mui/material';
import { Delete, Edit, Add, Save, GetApp } from '@mui/icons-material';
import * as Actions from "../store/action";
import { CSVLink } from 'react-csv';
import { AddEmployee, EditEmployee, ChangeStatusEmployee } from "../service/setEmployees";
import FormDialog from "../components/addEmployee";
import oceanBackground from "../ocean.jpg";

const DataTable = () => {
  const employees = useSelector(state => state.meantimeEmployees);
  const [employeesToSave, setEmployeesToSave] = useState(employees);
  const [employeeDataToUpdate, setEmployeeDataToUpdate] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setEmployeesToSave(employees);
  }, [employees]);

  useEffect(() => {
    if (employeeDataToUpdate)
      setDialogOpen(true);
    else setDialogOpen(false);
  }, [employeeDataToUpdate])

  const handleEdit = (id) => {
    const emp = employees.find(e => e.id === id);
    const positions = emp.employeePositions.map(position => ({
      positionId: position.positionId,
      positionEntry: position.positionEntry ? position.positionEntry.split('T')[0] : '',
      ifManagerial: position.ifManagerial
    }));

    const existingEmployeeData = {
      id: id,
      fName: emp.fName,
      lName: emp.lName,
      tz: emp.tz,
      dateBirth: emp.dateBirth ? emp.dateBirth.split('T')[0] : '',
      gender: emp.gender,
      positions: positions,
      startWorkDate: emp.startWorkDate ? emp.startWorkDate.split('T')[0] : ''
    };

    setEmployeeDataToUpdate(existingEmployeeData);
  };

  const handleDelete = (id) => {
    const updatedEmployees = employeesToSave.map(employee => {
      if (employee.id === id) {
        return { ...employee, isActive: false, status: 'delete' };
      }
      return employee;
    });
    dispatch({ type: Actions.SET_MEANTIME_EMPLOYEES, payload: updatedEmployees });
    setEmployeesToSave(updatedEmployees);
  };

  const handleAdd = () => {
    setEmployeeDataToUpdate(null);
  };

  const handleSaveChanges = React.useCallback(() => {
    employeesToSave?.forEach(async e => {
      if (e.status)
        if (e.status === 'delete') {
          delete e.status;
          await dispatch(ChangeStatusEmployee(e.id));
        }
        else if (e.status === 'add') {
          delete e.status;
          await dispatch(AddEmployee(e));
        }
        else {
          delete e.status;
          await dispatch(EditEmployee(e.id, e))
        }
    });
  }, [employeesToSave, dispatch])

  const columns = [
    { field: 'fName', headerName: 'First name', width: 130 },
    { field: 'lName', headerName: 'Last name', width: 130 },
    { field: 'tz', headerName: 'Tz', width: 130 },
    { field: 'startWorkDate', headerName: 'startWorkDate', width: 130, type: 'Date' },
    {
      field: 'edit',
      headerName: 'Edit',
      width: 100,
      sortable: false,
      renderCell: ({ row }) => (
        <IconButton aria-label="edit" onClick={() => handleEdit(row.id)}>
          <Edit />
        </IconButton>
      ),
    },
    {
      field: 'delete',
      headerName: 'Delete',
      width: 100,
      sortable: false,
      renderCell: ({ row }) => (
        <IconButton aria-label="delete" onClick={() => handleDelete(row.id)}>
          <Delete />
        </IconButton>
      ),
    },
  ];

  return (
    <>
      <div className='tableContainer' style={{ position: 'relative' }}>
        <Button variant="contained" startIcon={<Add />} onClick={handleAdd} style={{ position: 'absolute', top: '-50px', left: '50%', transform: 'translateX(-50%)', zIndex: '1' }}>
          Add Entry
        </Button>
        <Paper elevation={3} style={{ backgroundImage: `url(${oceanBackground})`, backgroundSize: 'cover', borderRadius: '10px', padding: '10px', position: 'relative', zIndex: '0' }}>
          <DataGrid
            rows={employeesToSave?.filter(employee => employee.isActive) ?? []}
            columns={columns ?? []}
            pageSize={5}
            checkboxSelection
          />
        </Paper>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px', zIndex: '1', position: 'relative' }}>
          <Button variant="contained" startIcon={<Save />} onClick={handleSaveChanges} style={{ backgroundColor: 'rgb(18 171 222)', marginRight: '10px' }}>
            Save Changes
          </Button>
          {!!employeesToSave && <CSVLink data={employeesToSave?.filter(employee => employee.isActive) ?? []} filename={"employee_list.csv"} style={{ textDecoration: 'none' }}>
            <Button variant="contained" startIcon={<GetApp />} style={{ backgroundColor: 'rgb(18 171 222)' }}>
              Export to CSV
            </Button>
          </CSVLink>}
        </div>
      </div>
      <FormDialog open={dialogOpen} handleClose={() => setDialogOpen(false)} existingEmployeeData={employeeDataToUpdate} />
    </>
  );
}

export default DataTable;

