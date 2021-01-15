import axios from 'axios';

const initialState = {
  content: '',
};

const SAVEFILE = 'SAVEFILE';
const SETCONTENT = 'SETCONTENT';

// action creator
export const loadTxtFile = (file) => (dispatch) => {
  let reader = new FileReader();
  console.log('Reader Results', reader);

  reader.onloadend = () => {
    dispatch({
      type: SETCONTENT,
      payload: reader.result,
    });
  };
  reader.readAsText(file);
};

// const loadImage = file => dispatch => {
//   let reader = new FileReader();

//   reader.onloadend = () => {
//     dispatch({
//       type: 'SET_IMAGE_IN_REDUCER',
//       image: reader.result
//     });
//   };
//   reader.readAsDataURL(file);
// }

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
    case SETCONTENT:
      console.log('in reducer', action.type);
      return { ...state, content: action.payload };
    case SAVEFILE:
      return {
        ...state,
      };
    default:
      return state;
  }
}
