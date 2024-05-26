import axios from "axios";
import * as Actions from "../store/action";

export default function SetPositions() {

    return dispatch => {
        axios.get(`https://localhost:7063/api/Position`)
        .then(res => {
            dispatch({ type: Actions.SET_POSITIONS, payload: res.data })
        }
        ).catch(err => console.log(err));
    }
}