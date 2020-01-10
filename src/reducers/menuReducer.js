import * as types from '../actions/types'

const initialState = {
    mobileOpen: false,
    lang: 1, // 0='English', 1='French'
    avatarPath: "",
}

export default function toggleMenu(state=initialState, action) {
    if(action.type === "AVATAR_CHANGED") {
        return {
            ...state,
            avatarPath: action.payload
        }
    }
    if(action.type === types.TOGGLE_MENU) {
        return {
            ...state,
            mobileOpen: !state.mobileOpen
        }
    }
    if(action.type === types.CHANGE_LANG) {
        return {
            ...state,
            lang: action.payload,
        }
    }
    return state;
}