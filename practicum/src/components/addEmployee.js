import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { useForm } from 'react-hook-form';
import { useFieldArray } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect } from 'react';
import Select from 'react-select';
import * as Actions from "../store/action";

export default function FormDialog({ open, handleClose, existingEmployeeData }) {
  const { register, handleSubmit, formState: { errors }, control, reset } = useForm();
  const { fields, append } = useFieldArray({ control, name: 'positions' });
  const dispatch = useDispatch();
  const positions = useSelector(state => state.positions);
  const [selectedPositions, setSelectedPositions] = React.useState([]);

  useEffect(() => {
    if (existingEmployeeData) {
      reset(existingEmployeeData);

      const selectedPositionsFromData = existingEmployeeData.positions.map(position => ({
        value: position.positionId,
        label: positions.find(pos => pos.id === position.positionId)?.name,
        ifManagerial: position.ifManagerial
      }));
      setSelectedPositions(selectedPositionsFromData);
    }
  }, [reset, positions, existingEmployeeData]);

  const handlePositionSelect = (selectedOptions) => {
    setSelectedPositions(selectedOptions);
    const newPositions = selectedOptions.filter(option => !selectedPositions.some(pos => pos.value === option.value));
    newPositions.forEach(option => {
      const index = fields?.length;
      append({ ifManagerial: option.ifManagerial, positionEntry: option.positionEntry });
    });
  };

  const compareDates = (positionEntry, startDate) => {
    return new Date(positionEntry) >= new Date(startDate);
  };

  const handleFormSubmit = (data) => {
    const { startWorkDate } = data;
    const { positions } = data;
    let isValid = true;

    positions.forEach(position => {
      if (!compareDates(position.positionEntry, startWorkDate)) {
        isValid = false;
      }
    });

    if (!isValid) {
      alert('Entry to work date must be later than or equal to start work date');
      return;
    }

    onSubmit(data);
  };

  const onSubmit = (data) => {
    data.gender = Number(data.gender);
    data.dateBirth = `${data.dateBirth}T00:00:00.725Z`;
    data.startWorkDate = `${data.startWorkDate}T00:00:00.725Z`;
    data.employeePositions = selectedPositions.map(position => ({
      positionId: position.value,
      ifManagerial: position.ifManagerial
    }));
    const { positions } = data;
    data.employeePositions = positions.map((position, index) => ({
      ...position,
      ...data.employeePositions[index]
    }));

    const dataToAdd = {
      "fName": data.fName,
      "lName": data.lName,
      "tz": data.tz,
      "startWorkDate": data.startWorkDate,
      "isActive": true,
      "dateBirth": data.dateBirth,
      "gender": data.gender,
      "employeePositions": data.employeePositions
    }
    delete data.positions;
    delete data["ifManagerial"];
    if (existingEmployeeData) {
      const dataToUpdate = { ...data, isActive: true, status: 'edit' };
      dispatch({ type: Actions.PUT_MEANTIME_EMPLOYEES, payload: dataToUpdate });
    }
    else {
      const dataToAddto = { ...dataToAdd, id: 0, status: 'add' };
      dispatch({ type: Actions.ADD_MEANTIME_EMPLOYEES, payload: dataToAddto });
    }

    reset();
    handleClose();
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: handleSubmit(handleFormSubmit),
        }}
      >
        <DialogTitle>{existingEmployeeData ? "Edit Employee" : "Add Employee"}</DialogTitle>
        <DialogContent>
          <div>
            <label htmlFor="fName">First Name</label>
            <input type="text" id="fName" {...register('fName', { required: 'First name is required' })} />
            {errors.fName && <p>{errors.fName.message}</p>}
          </div>
          <div>
            <label htmlFor="lName">Last Name</label>
            <input type="text" id="lName" {...register('lName', { required: 'Last name is required' })} />
            {errors.lName && <p>{errors.lName.message}</p>}
          </div>
          <div>
            <label htmlFor="tz">Tz</label>
            <input
              type="text"
              id="tz"
              {...register('tz', {
                required: 'Tz is required',
                pattern: {
                  value: /^\d{9}$/,
                  message: 'Tz must be 9 digits long and contain only digits.'
                }
              })}
            />
            {errors.tz && <p>{errors.tz.message}</p>}
          </div>
          <div>
            <label htmlFor="dateBirth">Date of Birth</label>
            <input type="date" id="dateBirth" {...register('dateBirth', { required: 'Date of birth is required' })} />
            {errors.dateBirth && <p>{errors.dateBirth.message}</p>}
          </div>
          <div>
            <label htmlFor="gender">Gender</label>
            <select id="gender" {...register('gender', { required: 'Gender is required' })}>
              <option value="0">Male</option>
              <option value="1">Female</option>
            </select>
            {errors.gender && <p>{errors.gender.message}</p>}
          </div>
          <div>
            <label htmlFor="positions">Positions</label>
            <Select id="positions" isMulti options={positions.map(position => ({ value: position.id, label: position.name, ifManagerial: position.ifManagerial }))} onChange={handlePositionSelect} value={selectedPositions} />
          </div>
          {selectedPositions.map((position, index) => (
            <div key={index}>
              <label>{position.label}</label>
              <input type="date" {...register(`positions[${index}].positionEntry`, { required: 'Entry date is required' })} defaultValue={positions[index]?.positionEntry || ''} />
              <label htmlFor={`positions[${index}].ifManagerial`}>Is Managerial?</label>
              <input type="checkbox" id={`positions[${index}].ifManagerial`} {...register(`positions[${index}].ifManagerial`)} defaultChecked={position.ifManagerial || false} />
            </div>
          ))}
          <div>
            <label htmlFor="startWorkDate">Start Work Date</label>
            <input type="date" id="startWorkDate" {...register('startWorkDate', { required: 'Start work date is required' })} />
            {errors.startWorkDate && <p>{errors.startWorkDate.message}</p>}
          </div>
        </DialogContent>
        <DialogActions>
          <Button type="submit">Submit</Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
