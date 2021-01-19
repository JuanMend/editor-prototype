import axios from 'axios';

const initialState = {
  content: '',
  loading: false,
};

const SAVEFILE = 'SAVEFILE';
const SETCONTENT = 'SETCONTENT';
const CONTENT_LOADIING = 'CONTENT_LOADIING';

// action creator

export const loadingContent = () => {
  return {
    type: 'CONTENT_LOADIING',
  };
};
export const loadTxtFile = (file) => (dispatch) => {
  dispatch(loadingContent());
  let reader = new FileReader();
  console.log('Reader Results', reader);

  reader.onloadend = () => {
    dispatch({
      type: 'SETCONTENT',
      payload: reader.result,
    });
  };
  reader.readAsText(file);
};

export const SaveFile = (fileData) => {
  console.log('Blob For Upload File ', fileData);
  // const result = await fileData.text();
  // console.log(result);
  return {
    type: SAVEFILE,
    payload: '',
  };
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'CONTENT_LOADIING':
      return { ...state, loading: true };
    case 'SETCONTENT':
      // console.log('in reducer', action.type, action.payload);
      return { ...state, content: action.payload, loading: false };
    case SAVEFILE:
      return {
        ...state,
      };
    default:
      return state;
  }
}
