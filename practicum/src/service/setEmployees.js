import axios from "axios";
import * as Actions from "../store/action";

export default function SetEmployees() {
    return dispatch => {
        axios.get(`https://localhost:7063/api/Employee`)
            .then(res => {
                dispatch({ type: Actions.SET_MEANTIME_EMPLOYEES, payload: res.data })
                console.log(res.data);
            }
            ).catch(err => console.log(err));
    }
}

export function AddEmployee(employee) {
    return dispatch => {
        axios.post(`https://localhost:7063/api/Employee`, employee)
            .then(res => {
                console.log(res.data);
                SetEmployees();
            }
            ).catch(err => console.log(err));
    }
}

export function EditEmployee(id, employee) {
    return dispatch => {
        axios.put(`https://localhost:7063/api/Employee/${id}`, employee)
            .then(res => {
                console.log(res.data);
                SetEmployees();
            }
            ).catch(err => console.log(err));
    }
}
export function ChangeStatusEmployee(id) {
    return dispatch => {
        axios.put(`https://localhost:7063/api/Employee/status/${id}`)
            .then(res => {
                console.log(res.data);
                SetEmployees();
            }
            ).catch(err => console.log(err));
    }
}