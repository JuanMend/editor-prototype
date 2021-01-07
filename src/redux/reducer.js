import axios from 'axios';

const initialState = {};

const SAVEFILE = 'SAVEFILE';

export const SaveFile = (fileData) => {
  console.log('Blob For Upload File ', fileData);
  console.log(fileData.text());
  return {
    type: SAVEFILE,
    payload: '',
  };
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SAVEFILE:
      return {
        ...state,
      };
    default:
      return state;
  }
}
