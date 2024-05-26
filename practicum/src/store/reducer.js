import * as Actions from './action'

const initialState = {
    meantimeEmployees: [],
    positions: [],
}

export default function Reducer(state = initialState, action) {
    switch (action.type) {
        case Actions.SET_MEANTIME_EMPLOYEES: {
            return { ...state, meantimeEmployees: action.payload }
        }
        case Actions.ADD_MEANTIME_EMPLOYEES: {
            const meantimeEmployeesToAdd = [...state.meantimeEmployees];
            if (!!state.meantimeEmployees)
                action.payload.id = state.meantimeEmployees[state.meantimeEmployees.length - 1].id + 1;
            else action.payload.id = 0;
            meantimeEmployeesToAdd.push(action.payload);
            return { ...state, meantimeEmployees: meantimeEmployeesToAdd }
        }
        case Actions.PUT_MEANTIME_EMPLOYEES: {
            const meantimeEmployeesToEdit = [...state.meantimeEmployees];
            const findIndex = meantimeEmployeesToEdit.findIndex(x => x.id === action.payload.id);
            meantimeEmployeesToEdit[findIndex] = action.payload;
            return { ...state, meantimeEmployees: meantimeEmployeesToEdit }
        }
        case Actions.SET_POSITIONS: {
            return { ...state, positions: action.payload }
        }
        default: return { ...state }
    }
}